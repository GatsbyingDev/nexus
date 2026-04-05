import { useEffect, useRef } from "react";

interface VoiceTileProps {
  title: string;
  stream: MediaStream | null;
  isLocal?: boolean;
}

export const VoiceTile = ({ title, stream, isLocal = false }: VoiceTileProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container p-3">
      <p className="text-sm font-semibold">{title}</p>
      <p className="text-xs text-on-surface-variant">{stream ? "Connected" : "Waiting"}</p>
      <audio ref={audioRef} autoPlay playsInline muted={isLocal} />
    </div>
  );
};
