interface MemberStatusDotProps {
  status: "online" | "idle" | "dnd" | "offline";
}

export const MemberStatusDot = ({ status }: MemberStatusDotProps) => {
  const color =
    status === "online"
      ? "bg-tertiary"
      : status === "idle"
      ? "bg-yellow-400"
      : status === "dnd"
      ? "bg-error"
      : "bg-outline-variant";

  return <span className={`block h-2.5 w-2.5 rounded-full ring-2 ring-surface-container ${color}`} />;
};
