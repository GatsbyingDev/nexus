import { Link } from "react-router-dom";
import { useDMs } from "@/hooks/useDMs";
import { useFriends } from "@/hooks/useFriends";
import { ServerSidebar } from "@/components/navigation/ServerSidebar";
import { ChatArea } from "@/components/chat/ChatArea";

const DMSidebar = () => {
  const { data: dms = [] } = useDMs();
  const { data: friends = [] } = useFriends();

  return (
    <aside className="flex w-[240px] flex-col border-r border-outline-variant bg-surface-container">
      <div className="border-b border-outline-variant p-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">Direct Messages</h2>
      </div>
      <div className="flex-1 overflow-auto p-2">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">Conversations</p>
        {dms.map((dm) => (
          <button key={dm._id} className="mb-1 block w-full rounded px-2 py-1 text-left text-sm hover:bg-surface-container-high">
            DM {dm._id.slice(-4)}
          </button>
        ))}

        <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-wide text-on-surface-variant">Friends</p>
        {friends.map((friend) => (
          <Link key={friend.userId} to={`/dm/${friend.userId}`} className="mb-1 block rounded px-2 py-1 text-sm hover:bg-surface-container-high">
            {friend.userId.slice(0, 8)} ({friend.status})
          </Link>
        ))}
      </div>
    </aside>
  );
};

export const DMLayout = () => {
  return (
    <div className="flex h-full bg-background text-on-surface">
      <ServerSidebar />
      <DMSidebar />
      <ChatArea />
    </div>
  );
};
