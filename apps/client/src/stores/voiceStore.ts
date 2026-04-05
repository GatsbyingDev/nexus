import { create } from "zustand";
import { getSocket } from "@/lib/socket";

const rtcConfig: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
};

interface VoiceState {
  activeChannelId: string | null;
  peers: Map<string, RTCPeerConnection>;
  remoteStreams: Map<string, MediaStream>;
  localStream: MediaStream | null;
  isMuted: boolean;
  isDeafened: boolean;
  joinChannel: (channelId: string) => Promise<void>;
  leaveChannel: () => Promise<void>;
  toggleMute: () => void;
  toggleDeafen: () => void;
}

const peerKey = (userId: string): string => userId;

export const useVoiceStore = create<VoiceState>((set, get) => {
  const ensurePeer = (remoteUserId: string): RTCPeerConnection => {
    const key = peerKey(remoteUserId);
    const existing = get().peers.get(key);
    if (existing) {
      return existing;
    }

    const pc = new RTCPeerConnection(rtcConfig);
    const socket = getSocket();

    pc.onicecandidate = (event) => {
      if (!event.candidate) {
        return;
      }

      socket.emit("voice_ice", {
        to: remoteUserId,
        candidate: event.candidate.toJSON()
      });
    };

    pc.ontrack = (event) => {
      const stream = event.streams[0];
      if (!stream) {
        return;
      }

      const nextStreams = new Map(get().remoteStreams);
      nextStreams.set(key, stream);
      set({ remoteStreams: nextStreams });
    };

    const localStream = get().localStream;
    if (localStream) {
      for (const track of localStream.getTracks()) {
        pc.addTrack(track, localStream);
      }
    }

    const nextPeers = new Map(get().peers);
    nextPeers.set(key, pc);
    set({ peers: nextPeers });

    return pc;
  };

  const setupSocketListeners = (): void => {
    const socket = getSocket();

    socket.off("voice_participants");
    socket.off("voice_user_joined");
    socket.off("voice_user_left");
    socket.off("voice_signal");
    socket.off("voice_ice");

    socket.on("voice_participants", async (payload: { channelId: string; participants: string[] }) => {
      const selfId = socket.id;

      for (const userId of payload.participants) {
        if (!userId || userId === selfId) {
          continue;
        }

        const pc = ensurePeer(userId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit("voice_signal", {
          to: userId,
          signal: offer
        });
      }
    });

    socket.on("voice_user_joined", async (payload: { userId: string; channelId: string }) => {
      if (payload.channelId !== get().activeChannelId) {
        return;
      }

      const pc = ensurePeer(payload.userId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket.emit("voice_signal", {
        to: payload.userId,
        signal: offer
      });
    });

    socket.on("voice_signal", async (payload: { from: string; signal: RTCSessionDescriptionInit }) => {
      const pc = ensurePeer(payload.from);

      if (payload.signal.type === "offer") {
        await pc.setRemoteDescription(new RTCSessionDescription(payload.signal));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit("voice_signal", {
          to: payload.from,
          signal: answer
        });
        return;
      }

      if (payload.signal.type === "answer") {
        await pc.setRemoteDescription(new RTCSessionDescription(payload.signal));
      }
    });

    socket.on("voice_ice", async (payload: { from: string; candidate: RTCIceCandidateInit }) => {
      const pc = ensurePeer(payload.from);
      await pc.addIceCandidate(new RTCIceCandidate(payload.candidate));
    });

    socket.on("voice_user_left", (payload: { userId: string }) => {
      const key = peerKey(payload.userId);
      const peer = get().peers.get(key);

      if (peer) {
        peer.close();
      }

      const nextPeers = new Map(get().peers);
      nextPeers.delete(key);

      const nextStreams = new Map(get().remoteStreams);
      nextStreams.delete(key);

      set({ peers: nextPeers, remoteStreams: nextStreams });
    });
  };

  return {
    activeChannelId: null,
    peers: new Map(),
    remoteStreams: new Map(),
    localStream: null,
    isMuted: false,
    isDeafened: false,
    joinChannel: async (channelId: string) => {
      const socket = getSocket();
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

      set({ activeChannelId: channelId, localStream: stream });
      setupSocketListeners();

      socket.emit("voice_join", { channelId });
    },
    leaveChannel: async () => {
      const socket = getSocket();
      const activeChannelId = get().activeChannelId;

      if (activeChannelId) {
        socket.emit("voice_leave", { channelId: activeChannelId });
      }

      for (const peer of get().peers.values()) {
        peer.close();
      }

      const stream = get().localStream;
      if (stream) {
        for (const track of stream.getTracks()) {
          track.stop();
        }
      }

      set({
        activeChannelId: null,
        peers: new Map(),
        remoteStreams: new Map(),
        localStream: null,
        isMuted: false,
        isDeafened: false
      });
    },
    toggleMute: () => {
      const stream = get().localStream;
      if (!stream) {
        return;
      }

      const nextMuted = !get().isMuted;
      for (const track of stream.getAudioTracks()) {
        track.enabled = !nextMuted;
      }

      set({ isMuted: nextMuted });
    },
    toggleDeafen: () => {
      set({ isDeafened: !get().isDeafened });
    }
  };
});
