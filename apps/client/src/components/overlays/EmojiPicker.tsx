interface EmojiPickerProps {
  onPick: (emoji: string) => void;
}

const emojiSet = ["😀", "😁", "😂", "🤣", "😎", "🔥", "🎉", "❤️", "👍", "👀"];

export const EmojiPicker = ({ onPick }: EmojiPickerProps) => {
  return (
    <div className="grid grid-cols-5 gap-1 rounded-md border border-outline-variant bg-surface-container p-2">
      {emojiSet.map((emoji) => (
        <button key={emoji} onClick={() => onPick(emoji)} className="rounded p-1 text-lg hover:bg-surface-container-high">
          {emoji}
        </button>
      ))}
    </div>
  );
};
