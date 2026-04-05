import { MemberStatusDot } from "./MemberStatusDot";

interface MemberUser {
  _id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  status?: "online" | "idle" | "dnd" | "invisible" | "offline";
}

interface MemberShape {
  _id: string;
  userId: string | MemberUser;
  nickname?: string;
}

interface MemberListItemProps {
  member: MemberShape;
}

export const MemberListItem = ({ member }: MemberListItemProps) => {
  const user = typeof member.userId === "string" ? null : member.userId;
  const fallbackUserId = typeof member.userId === "string" ? member.userId : member.userId._id;
  const status = user?.status === "invisible" ? "offline" : user?.status ?? "offline";

  return (
    <div className="flex items-center gap-2 rounded px-2 py-1 hover:bg-surface-container-high">
      <div className="relative h-8 w-8 rounded-full bg-surface-container-highest">
        {user?.avatar && (
          <img
            src={user.avatar}
            alt={user.displayName || user.username}
            className="h-full w-full rounded-full object-cover"
          />
        )}
        <span className="absolute bottom-0 right-0">
          <MemberStatusDot status={status} />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">
          {member.nickname || user?.displayName || user?.username || fallbackUserId}
        </p>
      </div>
    </div>
  );
};
