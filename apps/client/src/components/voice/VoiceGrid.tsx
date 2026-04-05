import { useVoiceStore } from "@/stores/voiceStore";
import { VoiceTile } from "./VoiceTile";

export const VoiceGrid = () => {
  const localStream = useVoiceStore((s) => s.localStream);
  const remoteStreams = useVoiceStore((s) => s.remoteStreams);

  return (
    <div className="grid grid-cols-2 gap-3 p-3">
      <VoiceTile title="You" stream={localStream} isLocal />
      {Array.from(remoteStreams.entries()).map(([userId, stream]) => (
        <VoiceTile key={userId} title={userId.slice(0, 8)} stream={stream} />
      ))}
    </div>
  );
};
