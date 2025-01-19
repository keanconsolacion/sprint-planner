import AuditLog from "@/components/AuditLog";
import ControlPanel from "@/components/ControlPanel";
import { CreateRoomCard } from "@/components/CreateRoomCard";
import InviteCard from "@/components/InviteCard";
import { JoinRoomCard } from "@/components/JoinRoomCard";
import PointSelector from "@/components/PointSelector";
import useSocketEvents from "@/hooks/useSocketEvents";
import { useSocketStore } from "@/store/useSocketStore";
import Chart from "@/components/Chart";
import { useForm, FormProvider } from "react-hook-form";
import { tv } from "tailwind-variants";

const styles = tv({
	slots: {
		root: "flex gap-6 flex-wrap justify-center",
		left: "flex flex-col gap-3 items-center",
		right: "flex flex-col gap-3",
	},
});

const Lobby = () => {
	const { root, left, right } = styles();
	const socket = useSocketStore((state) => state.socket);

	const formMethods = useForm({});

	useSocketEvents();

	if (!socket) {
		return <p>Connecting to server...</p>;
	}

	return (
		<FormProvider {...formMethods}>
			<div className={root()}>
				<div className={left()}>
					<PointSelector socket={socket} />
					<Chart />
					<AuditLog />
				</div>
				<div className={right()}>
					<ControlPanel socket={socket} />
					<JoinRoomCard socket={socket} />
					<CreateRoomCard socket={socket} />
					<InviteCard />
				</div>
			</div>
		</FormProvider>
	);
};

export default Lobby;
