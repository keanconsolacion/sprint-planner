import { Card } from "../ui/card";
import { Virtuoso } from "react-virtuoso";
import { tv } from "tailwind-variants";
import { useRoomStore } from "@/store/useRoomStore";
import useAuditStore from "@/store/useAuditStore";

const styles = tv({
	slots: {
		base: "w-[348px] lg:w-[448px] h-[120px] pl-3 py-0 overflow-x-auto",
		log: "text-[12px] flex-shrink-0 pb-1",
		timestamp: "opacity-70 text-[10px]",
		message: "opacity-80",
	},
});

const AuditLog = () => {
	const { base, log, timestamp, message } = styles();
	const { room } = useRoomStore();
	const { logs } = useAuditStore();

	if (!room) return null;

	return (
		<Card className={base()}>
			<Virtuoso
				data={logs}
				totalCount={logs.length}
				height={80}
				itemContent={(_, data) => (
					<p className={log()}>
						<span className={message()}>{data.message}</span>{" "}
						<span className={timestamp()}>
							(
							{new Date(data.timestamp).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
								second: "2-digit",
							})}
							)
						</span>
					</p>
				)}
				alignToBottom
				followOutput
			/>
		</Card>
	);
};

export default AuditLog;
