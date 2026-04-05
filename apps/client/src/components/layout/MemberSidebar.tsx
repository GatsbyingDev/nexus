import { MemberListItem } from "@/components/members/MemberListItem";

export const MemberSidebar = () => (
  <aside className="w-[240px] border-l border-outline-variant bg-surface-container p-3">
    <p className="mb-2 text-xs font-semibold uppercase text-on-surface-variant">Members</p>
    <div className="space-y-1">
      <MemberListItem username="Nexus User" status="online" />
      <MemberListItem username="Design Bot" status="idle" />
    </div>
  </aside>
);
