import { useEffect, useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { IMessage } from "@nexus/shared/src/types";
import { MessageGroup } from "./MessageGroup";

interface MessageListProps {
  messages: IMessage[];
  hasNextPage: boolean;
  loadMore: () => Promise<void>;
}

export const MessageList = ({ messages, hasNextPage, loadMore }: MessageListProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const groups = useMemo(() => {
    const acc: IMessage[][] = [];

    for (const msg of messages) {
      const last = acc[acc.length - 1];
      if (!last || last[last.length - 1].authorId !== msg.authorId) {
        acc.push([msg]);
      } else {
        last.push(msg);
      }
    }

    return acc;
  }, [messages]);

  const rowVirtualizer = useVirtualizer({
    count: groups.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 84,
    overscan: 12
  });

  useEffect(() => {
    const node = parentRef.current;
    if (!node) {
      return;
    }

    const onScroll = () => {
      if (node.scrollTop < 120 && hasNextPage) {
        void loadMore();
      }
    };

    node.addEventListener("scroll", onScroll);
    return () => node.removeEventListener("scroll", onScroll);
  }, [hasNextPage, loadMore]);

  return (
    <div ref={parentRef} className="h-full overflow-auto">
      <div style={{ height: rowVirtualizer.getTotalSize(), position: "relative" }}>
        {rowVirtualizer.getVirtualItems().map((item) => {
          const group = groups[item.index];
          if (!group) return null;

          return (
            <div
              key={group[0]._id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${item.start}px)`
              }}
            >
              <MessageGroup messages={group} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
