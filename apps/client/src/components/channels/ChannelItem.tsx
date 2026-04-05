import type { IChannel } from "@nexus/shared/src/types";

interface ChannelItemProps {
  channel: IChannel;
  active?: boolean;
}

export const ChannelItem = ({ channel, active = false }: ChannelItemProps) => {
  const prefix = channel.type === "VOICE" ? "🔊" : channel.type === "ANNOUNCEMENT" ? "📢" : "#";

  return (
    <div className={`mb-1 flex items-center gap-2 rounded px-2 py-1 text-sm ${active ? "bg-surface-container-high text-on-surface" : "text-on-surface-variant hover:bg-surface-container-high"}`}>
      <span className="text-xs">{prefix}</span>
      <span className="truncate">{channel.name}</span>
    </div>
  );
};
