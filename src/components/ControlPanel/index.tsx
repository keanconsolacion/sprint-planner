import Timer from "../Timer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoomStore } from "../../store/useRoomStore";
import { UpdateRoomType, VotingState } from "@/commons";
import { Button } from "@/components/ui/button";
import { tv } from "tailwind-variants";
import { Socket } from "socket.io-client";
import { Separator } from "../ui/separator";
import { useUserStore } from "@/store/useUserStore";
import { AvatarFallback, AvatarImage, Avatar } from "../ui/avatar";
import { CircleCheck } from "lucide-react";
import { isEmpty } from "lodash-es";
import { useTranslation } from "react-i18next";

const styles = tv({
	slots: {
		base: "w-[350px]",
		container: "flex flex-col gap-3",
		button: "w-full font-medium text-md",
		userRowContainer: "flex flex-col gap-2 max-h-[360px] overflow-y-auto",
		userRow: "flex justify-between items-center",
		user: "flex items-center gap-2",
		point: "px-1",
		avatar: "w-8 h-8",
	},
	variants: {
		isInitialOrEnded: {
			true: {
				button: "border-green-500 text-green-500",
			},
			false: {
				button: "border-red-500 text-red-500",
			},
		},
	},
});

const ControlPanel = ({ socket }: { socket: Socket }) => {
	const {t} = useTranslation()
	const { button, base, container, user: userStyles, userRowContainer, userRow, avatar, point } = styles();
	const { userId } = useUserStore();
	const { room } = useRoomStore();
	const { votingState, users } = room ?? {};

	const isInitialOrEndedVotingState = votingState === VotingState.INITIAL || votingState === VotingState.ENDED;

	const renderUsers = () => {
		if (!users) {
			return null;
		}
		return Object.values(users).map((user) => (
			<div className={userRow()} key={user.id}>
				<div className={userStyles()}>
					<Avatar className={avatar()}>
						<AvatarImage src={user.avatarSrc} />
						<AvatarFallback>?</AvatarFallback>
					</Avatar>
					<p>{user.name}</p>
					{!isEmpty(user.data) && <CircleCheck className="text-green-400" />}
				</div>
				{room?.votingState === VotingState.ENDED && <p className={point()}>{(user.data?.point as string) ?? "?"}</p>}
			</div>
		));
	};

	const handleClick = () => {
		socket.emit(
			"updateRoom",
			room?.id,
			userId,
			isInitialOrEndedVotingState ? UpdateRoomType.START_VOTING : UpdateRoomType.END_VOTING
		);
	};

	const getButtonLabel = () => {
		switch(votingState) {
			case VotingState.ENDED:
				return t('action.startAnother')
			case VotingState.INITIAL:
				return t('action.startVoting')
			default:
				return t('action.endVoting')
		}
	}

	if (!room) {
		return null;
	}

	return (
		<Card className={base()}>
			<CardHeader>
				<CardTitle>{room?.roomName}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className={container()}>
					<div className={userRowContainer()}>{renderUsers()}</div>
					<Separator />
					{votingState === VotingState.STARTED && room?.updatedOn && <Timer updatedOn={room.updatedOn} />}
					<Button
						variant={"outline"}
						className={button({ isInitialOrEnded: isInitialOrEndedVotingState })}
						onClick={handleClick}
					>
						{getButtonLabel()}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default ControlPanel;
