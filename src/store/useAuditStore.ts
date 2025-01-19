import uuid4 from "uuid4";
import { create } from "zustand";

interface AuditLog {
	id: string;
	message: string;
	timestamp: Date;
}

interface AuditStore {
	logs: AuditLog[];
	addLog: (message: string) => void;
	clearLogs: () => void;
}

export const initialLogMessages: string[] = ["Welcome to Sprint planner. Happy planning! 🚀"];

const useAuditStore = create<AuditStore>((set) => ({
	logs: [],
	addLog: (message: string) => {
		const newLog: AuditLog = {
			id: uuid4(),
			message,
			timestamp: new Date(),
		};
		set((state) => ({
			logs: [...state.logs, newLog],
		}));
	},
	clearLogs: () => set({ logs: [] }),
}));

export default useAuditStore;
