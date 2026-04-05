interface ReactionChipProps {
  emoji: string;
  count: number;
  active?: boolean;
}

export const ReactionChip = ({ emoji, count, active = false }: ReactionChipProps) => {
  return (
    <button className={`rounded-full border px-2 py-0.5 text-xs ${active ? "border-primary-container bg-primary-container/20 text-primary" : "border-outline-variant bg-surface-container text-on-surface-variant"}`}>
      {emoji} {count}
    </button>
  );
};
