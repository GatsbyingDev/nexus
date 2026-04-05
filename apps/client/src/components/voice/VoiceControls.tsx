import { useVoiceStore } from "@/stores/voiceStore";

export const VoiceControls = () => {
  const activeChannelId = useVoiceStore((s) => s.activeChannelId);
  const isMuted = useVoiceStore((s) => s.isMuted);
  const isDeafened = useVoiceStore((s) => s.isDeafened);
  const toggleMute = useVoiceStore((s) => s.toggleMute);
  const toggleDeafen = useVoiceStore((s) => s.toggleDeafen);
  const leaveChannel = useVoiceStore((s) => s.leaveChannel);

  if (!activeChannelId) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 border-t border-outline-variant p-3">
      <button onClick={toggleMute} className={`rounded px-2 py-1 text-xs ${isMuted ? "bg-error/20 text-error" : "bg-surface-container-high"}`}>Mute</button>
      <button onClick={toggleDeafen} className={`rounded px-2 py-1 text-xs ${isDeafened ? "bg-error/20 text-error" : "bg-surface-container-high"}`}>Deafen</button>
      <button onClick={() => void leaveChannel()} className="rounded bg-error/20 px-2 py-1 text-xs text-error">Leave</button>
    </div>
  );
};
