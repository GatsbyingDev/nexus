import type { IServerMember } from "@nexus/shared/src/types";
import { MemberStatusDot } from "./MemberStatusDot";

interface MemberListItemProps {
  member: IServerMember & {
    userId:
      | string
      | {
          _id: string;
          username: string;
          displayName?: string;
          avatar?: string;
          status?: "online" | "idle" | "dnd" | "invisible" | "offline";
        };
  };
}

export const MemberListItem = ({ member }: MemberListItemProps) => {
  const user = typeof member.userId === "string" ? null : member.userId;
  const status = user?.status === "invisible" ? "offline" : user?.status ?? "offline";

  return (
    <div className="flex items-center gap-2 rounded px-2 py-1 hover:bg-surface-container-high">
      <div className="relative h-8 w-8 rounded-full bg-surface-container-highest">
        {user?.avatar && <img src={user.avatar} alt={user.displayName || user.username} className="h-full w-full rounded-full object-cover" />}
        <span className="absolute bottom-0 right-0"><MemberStatusDot status={status} /></span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">{member.nickname || user?.displayName || user?.username || member.userId}</p>
      </div>
    </div>
  );
};
