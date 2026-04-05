import type { IMessage } from "@nexus/shared/src/types";
import { Message } from "./Message";

interface MessageGroupProps {
  messages: IMessage[];
}

export const MessageGroup = ({ messages }: MessageGroupProps) => {
  return (
    <div className="px-4 py-1 hover:bg-surface-container-low">
      {messages.map((message, idx) => (
        <Message key={message._id} message={message} showHeader={idx === 0} />
      ))}
    </div>
  );
};
