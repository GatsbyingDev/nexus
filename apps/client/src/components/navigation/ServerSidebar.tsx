import { Link, useLocation } from "react-router-dom";
import { useServers } from "@/hooks/useServers";
import { ServerIcon } from "./ServerIcon";
import { AddServerButton } from "./AddServerButton";

export const ServerSidebar = () => {
  const { data: servers = [] } = useServers();
  const location = useLocation();

  return (
    <aside className="flex w-[72px] flex-col items-center gap-2 border-r border-outline-variant bg-surface-container-low py-3">
      <Link to="/channels/@me">
        <ServerIcon name="DM" active={location.pathname.startsWith("/channels/@me")} />
      </Link>

      <div className="my-1 h-px w-8 bg-outline-variant" />

      {servers.map((server) => {
        const active = location.pathname.includes(`/channels/${server._id}`);
        return (
          <Link key={server._id} to={`/channels/${server._id}`}>
            <ServerIcon name={server.name} icon={server.icon} active={active} />
          </Link>
        );
      })}

      <AddServerButton />
    </aside>
  );
};
