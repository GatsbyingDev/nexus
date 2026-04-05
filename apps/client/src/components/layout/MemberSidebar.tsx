import { MemberSidebar as MembersSidebar } from "@/components/members/MemberSidebar";

export const MemberSidebar = () => null;

export const ServerMemberSidebar = ({ serverId }: { serverId: string }) => {
  return <MembersSidebar serverId={serverId} />;
};
