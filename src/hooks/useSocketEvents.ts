import { useEffect, useCallback } from "react";
import { Room, ServerCallbackProps, UpdateRoomEvent } from "@/commons";
import { useRoomStore } from "@/store/useRoomStore";
import { useSocketStore } from "@/store/useSocketStore";
import { useToast } from "./use-toast";
import { TOAST_DURATION } from "@/components/constants";
import useAuditStore from "@/store/useAuditStore";

const useSocketEvents = () => {
	const socket = useSocketStore((state) => state.socket);
	const { setRoom } = useRoomStore();
	const { toast } = useToast();
	const { addLog } = useAuditStore();

	const handleUpdateRoom = useCallback(
		({ status, data, message, eventType }: ServerCallbackProps<Room>) => {
			if (eventType === UpdateRoomEvent.USER_JOINED_ROOM || eventType === UpdateRoomEvent.USER_LEFT_ROOM) {				
				toast({
					variant: "default",
					title: message,
					duration: TOAST_DURATION,
				});
			}
			if (status === "ok" && data) {
				setRoom(data);
				addLog(message);
				return;
			}
			console.log("Failed to update room with message: ", message);
		},
		[addLog, setRoom, toast]
	);

	useEffect(() => {
		if (!socket) {
			return;
		}

		socket.on("updateRoom", handleUpdateRoom);

		return () => {
			socket?.off("updateRoom", handleUpdateRoom);
		};
	}, [socket, handleUpdateRoom, setRoom]);
};

export default useSocketEvents;
