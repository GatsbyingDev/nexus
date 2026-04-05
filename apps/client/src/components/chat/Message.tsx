import type { IMessage } from "@nexus/shared/src/types";
import { MessageContextMenu } from "./MessageContextMenu";

interface MessageProps {
  message: IMessage;
  showHeader: boolean;
}

export const Message = ({ message, showHeader }: MessageProps) => {
  return (
    <article className="group py-0.5">
      {showHeader && (
        <div className="mb-0.5 flex items-center gap-2">
          <span className="text-sm font-semibold">{message.authorId.slice(0, 8)}</span>
          <span className="text-xs text-on-surface-variant">{new Date(message.createdAt).toLocaleString()}</span>
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-on-surface">{message.deleted ? <i className="text-on-surface-variant">Message deleted</i> : message.content}</p>
        <MessageContextMenu message={message} />
      </div>
    </article>
  );
};
