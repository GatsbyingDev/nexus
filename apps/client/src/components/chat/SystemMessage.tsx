interface SystemMessageProps {
  content: string;
}

export const SystemMessage = ({ content }: SystemMessageProps) => {
  return <div className="px-4 py-2 text-center text-xs text-on-surface-variant">{content}</div>;
};
