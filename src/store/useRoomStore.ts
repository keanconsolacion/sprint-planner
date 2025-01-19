import { create } from "zustand";
import { Room } from "../commons";
import { persist } from "zustand/middleware";

interface RoomStore {
	room?: Room;
	setRoom: (room: Room) => void;
	clearRoom: () => void;
}

export const useRoomStore = create<RoomStore>()(
	persist(
		(set) => ({
			room: undefined,
			setRoom: (newRoom: Room) => set(() => ({ room: newRoom })),
			clearRoom: () => set(() => ({ room: undefined })),
		}),
		{
			name: "room-storage",
		}
	)
);
