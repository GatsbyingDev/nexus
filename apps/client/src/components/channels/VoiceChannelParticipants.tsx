interface VoiceChannelParticipantsProps {
  participants: { userId: string; displayName?: string }[];
}

export const VoiceChannelParticipants = ({ participants }: VoiceChannelParticipantsProps) => {
  if (participants.length === 0) {
    return <p className="text-xs text-on-surface-variant">No one is connected</p>;
  }

  return (
    <ul className="space-y-1">
      {participants.map((p) => (
        <li key={p.userId} className="text-xs text-on-surface-variant">
          {p.displayName ?? p.userId.slice(0, 8)}
        </li>
      ))}
    </ul>
  );
};
