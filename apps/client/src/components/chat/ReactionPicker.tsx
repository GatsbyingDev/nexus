interface ReactionPickerProps {
  onSelect: (emoji: string) => void;
}

const emojis = ["👍", "🔥", "❤️", "😂", "🎉"];

export const ReactionPicker = ({ onSelect }: ReactionPickerProps) => {
  return (
    <div className="flex items-center gap-1 rounded-md border border-outline-variant bg-surface-container p-1">
      {emojis.map((emoji) => (
        <button key={emoji} onClick={() => onSelect(emoji)} className="rounded px-1.5 py-0.5 text-sm hover:bg-surface-container-high">
          {emoji}
        </button>
      ))}
    </div>
  );
};
