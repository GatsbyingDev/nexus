import { create } from "zustand";

interface ModalState {
  name: string;
  props?: Record<string, unknown>;
}

interface UIState {
  memberListOpen: boolean;
  activeModal: ModalState | null;
  activeSidebarSection: "servers" | "dms";
  toggleMemberList: () => void;
  openModal: (name: string, props?: Record<string, unknown>) => void;
  closeModal: () => void;
  setActiveSidebarSection: (section: "servers" | "dms") => void;
}

export const useUIStore = create<UIState>((set) => ({
  memberListOpen: true,
  activeModal: null,
  activeSidebarSection: "servers",
  toggleMemberList: () => set((state) => ({ memberListOpen: !state.memberListOpen })),
  openModal: (name, props) => set({ activeModal: { name, props } }),
  closeModal: () => set({ activeModal: null }),
  setActiveSidebarSection: (section) => set({ activeSidebarSection: section })
}));
