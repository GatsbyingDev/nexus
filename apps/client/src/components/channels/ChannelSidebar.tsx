import { Link } from "react-router-dom";
import { useChannels } from "@/hooks/useChannels";
import { ChannelCategory } from "./ChannelCategory";
import { ChannelItem } from "./ChannelItem";
import { UserInfoBar } from "./UserInfoBar";

interface ChannelSidebarProps {
  serverId?: string;
  activeChannelId?: string;
}

export const ChannelSidebar = ({ serverId, activeChannelId }: ChannelSidebarProps) => {
  const { data: channels = [] } = useChannels(serverId);

  const grouped = channels.reduce<Record<string, typeof channels>>((acc, channel) => {
    const key = channel.categoryName || (channel.type === "VOICE" ? "Voice Channels" : "Text Channels");
    if (!acc[key]) acc[key] = [];
    acc[key].push(channel);
    return acc;
  }, {});

  return (
    <aside className="flex w-[240px] flex-col border-r border-outline-variant bg-surface-container">
      <header className="border-b border-outline-variant px-4 py-3 text-sm font-semibold">Server</header>
      <div className="flex-1 overflow-auto p-2">
        {Object.entries(grouped).map(([category, items]) => (
          <ChannelCategory key={category} title={category}>
            {items
              .sort((a, b) => a.position - b.position)
              .map((channel) => (
                <Link key={channel._id} to={`/channels/${channel.serverId}/${channel._id}`}>
                  <ChannelItem
                    channel={channel}
                    active={channel._id === activeChannelId}
                  />
                </Link>
              ))}
          </ChannelCategory>
        ))}
      </div>
      <UserInfoBar />
    </aside>
  );
};
