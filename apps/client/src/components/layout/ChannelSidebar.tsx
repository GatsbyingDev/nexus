import { ChannelCategory } from "@/components/channels/ChannelCategory";
import { ChannelItem } from "@/components/channels/ChannelItem";
import { UserInfoBar } from "@/components/misc/UserInfoBar";

export const ChannelSidebar = () => (
  <aside className="flex w-[240px] flex-col border-r border-outline-variant bg-surface-container">
    <div className="flex-1 p-3">
      <ChannelCategory>
        <ChannelItem active name="general" type="TEXT" />
        <ChannelItem name="announcements" type="ANNOUNCEMENT" />
        <ChannelItem name="Voice 1" type="VOICE" />
      </ChannelCategory>
    </div>
    <UserInfoBar />
  </aside>
);
