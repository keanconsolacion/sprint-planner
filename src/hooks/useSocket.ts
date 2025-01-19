import useAuditStore from "@/store/useAuditStore";
import { useRoomStore } from "@/store/useRoomStore";
import { useSocketStore } from "@/store/useSocketStore";
import { useEffect } from "react";

const useSocket = () => {
	const socket = useSocketStore((state) => state.socket);
	const connectSocket = useSocketStore((state) => state.connectSocket);
	const disconnectSocket = useSocketStore((state) => state.disconnectSocket);

	const { clearRoom, setRoom } = useRoomStore();
	const { clearLogs } = useAuditStore();

	useEffect(() => {
		connectSocket();
		return () => {
			clearRoom();
			clearLogs();
			disconnectSocket();
		};
	}, [clearLogs, clearRoom, connectSocket, disconnectSocket, setRoom]);

	return socket;
};

export default useSocket;
