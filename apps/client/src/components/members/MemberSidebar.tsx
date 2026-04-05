import { useServerMembers } from "@/hooks/useServerMembers";
import { MemberListItem } from "./MemberListItem";

interface MemberSidebarProps {
  serverId: string;
}

export const MemberSidebar = ({ serverId }: MemberSidebarProps) => {
  const { data: members = [] } = useServerMembers(serverId);

  const online = members.filter((member) => {
    if (typeof member.userId === "string") {
      return false;
    }
    return member.userId?.status === "online";
  });

  const offline = members.filter((member) => {
    if (typeof member.userId === "string") {
      return true;
    }
    return member.userId?.status !== "online";
  });

  return (
    <aside className="w-[240px] border-l border-outline-variant bg-surface-container p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Online — {online.length}</p>
      <div className="space-y-1">
        {online.map((member) => (
          <MemberListItem key={member._id} member={member} />
        ))}
      </div>

      <p className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Offline — {offline.length}</p>
      <div className="space-y-1">
        {offline.map((member) => (
          <MemberListItem key={member._id} member={member} />
        ))}
      </div>
    </aside>
  );
};
