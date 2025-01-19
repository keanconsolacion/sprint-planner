import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserState {
	userId?: string;
	setUserId: (id: string) => void;
	clearUserId: () => void;
}

export const useUserStore = create<UserState>()(
	persist(
		(set) => ({
			userId: undefined,
			setUserId: (id: string) => set(() => ({ userId: id })),
			clearUserId: () => set(() => ({ userId: undefined })),
		}),
		{
			name: "user-storage",
		}
	)
);
