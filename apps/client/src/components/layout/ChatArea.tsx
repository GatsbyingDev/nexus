import { useMemo } from "react";
import { MessageInput } from "@/components/chat/MessageInput";
import { MessageList } from "@/components/chat/MessageList";
import { TypingIndicator } from "@/components/chat/TypingIndicator";

export const ChatArea = () => {
  const messages = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        _id: String(i),
        channelId: "demo",
        authorId: "demo",
        content: `Demo message ${i + 1}`,
        attachments: [],
        embeds: [],
        mentions: [],
        reactions: [],
        edited: false,
        deleted: false,
        createdAt: new Date(Date.now() - i * 60000).toISOString(),
        updatedAt: new Date(Date.now() - i * 60000).toISOString(),
        author: { _id: "demo", username: "demo", displayName: "Nexus User" }
      })),
    []
  );

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-surface">
      <header className="border-b border-outline-variant px-4 py-3 text-sm font-semibold"># general</header>
      <div className="min-h-0 flex-1">
        <MessageList messages={messages} />
      </div>
      <TypingIndicator />
      <MessageInput onSend={() => undefined} />
    </section>
  );
};
