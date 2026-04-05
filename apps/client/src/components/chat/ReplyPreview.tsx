interface ReplyPreviewProps {
  content?: string;
  onCancel?: () => void;
}

export const ReplyPreview = ({ content, onCancel }: ReplyPreviewProps) => {
  if (!content) {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-md bg-surface-container p-2 text-xs text-on-surface-variant">
      <span className="truncate">Replying to: {content}</span>
      <button onClick={onCancel} className="rounded px-1 hover:bg-surface-container-high">x</button>
    </div>
  );
};
