import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { IMessage } from "@nexus/shared/src/types";
import { api } from "@/lib/axios";
import { useMessages } from "@/hooks/useMessages";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";

interface ChatAreaProps {
  channelId?: string;
}

export const ChatArea = ({ channelId }: ChatAreaProps) => {
  const [typingUsers] = useState<string[]>([]);
  const messagesQuery = useMessages(channelId);

  const messages = useMemo<IMessage[]>(() => {
    if (!messagesQuery.data) {
      return [];
    }

    return messagesQuery.data.pages.flatMap((p) => p.data);
  }, [messagesQuery.data]);

  const sendMessage = async (content: string): Promise<void> => {
    if (!channelId) {
      return;
    }

    try {
      await api.post(`/channels/${channelId}/messages`, { content });
    } catch {
      toast.error("Failed to send message");
    }
  };

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-surface">
      <header className="border-b border-outline-variant px-4 py-3 text-sm font-semibold">
        {channelId ? `# ${channelId.slice(0, 8)}` : "Select a channel"}
      </header>

      <div className="min-h-0 flex-1">
        <MessageList
          messages={messages}
          hasNextPage={Boolean(messagesQuery.hasNextPage)}
          loadMore={async () => {
            if (messagesQuery.hasNextPage && !messagesQuery.isFetchingNextPage) {
              await messagesQuery.fetchNextPage();
            }
          }}
        />
      </div>

      <TypingIndicator users={typingUsers} />
      <MessageInput disabled={!channelId} onSend={sendMessage} />
    </section>
  );
};
