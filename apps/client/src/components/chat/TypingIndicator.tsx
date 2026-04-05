interface TypingIndicatorProps {
  users: string[];
}

export const TypingIndicator = ({ users }: TypingIndicatorProps) => {
  if (users.length === 0) {
    return <div className="h-5 px-4" />;
  }

  const label = users.length === 1 ? `${users[0]} is typing...` : `${users.length} users are typing...`;

  return <div className="px-4 py-1 text-xs text-on-surface-variant">{label}</div>;
};
