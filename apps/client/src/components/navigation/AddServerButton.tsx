import { useUIStore } from "@/stores/uiStore";

export const AddServerButton = () => {
  const openModal = useUIStore((s) => s.openModal);

  return (
    <button
      onClick={() => openModal("create-server")}
      className="grid h-12 w-12 place-items-center rounded-2xl bg-surface-container-high text-2xl text-tertiary transition hover:rounded-xl hover:bg-tertiary hover:text-surface"
      aria-label="Add server"
    >
      +
    </button>
  );
};
