import { useParams } from "react-router-dom";
import { ServerSidebar } from "@/components/navigation/ServerSidebar";
import { ChannelSidebar } from "@/components/channels/ChannelSidebar";
import { ChatArea } from "@/components/chat/ChatArea";
import { MemberSidebar } from "@/components/members/MemberSidebar";
import { useUIStore } from "@/stores/uiStore";

export const ServerLayout = () => {
  const { serverId, channelId } = useParams<{ serverId: string; channelId?: string }>();
  const memberListOpen = useUIStore((s) => s.memberListOpen);

  return (
    <div className="flex h-full bg-background text-on-surface">
      <ServerSidebar />
      <ChannelSidebar serverId={serverId} activeChannelId={channelId} />
      <ChatArea channelId={channelId} />
      {memberListOpen && serverId && <MemberSidebar serverId={serverId} />}
    </div>
  );
};
