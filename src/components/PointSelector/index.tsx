import { PointValues, PointValuesType, VotingState } from "@/commons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { tv } from "tailwind-variants";
import PointButton from "../PointButton";
import { useRoomStore } from "../../store/useRoomStore";
import { Socket } from "socket.io-client";
import { useUserStore } from "@/store/useUserStore";
import { CirclePause, ClipboardCheck, Eye, Vote } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

const pointSelectorStyles = tv({
	slots: {
		base: "w-[348px] lg:w-[448px]",
		title: "flex items-center gap-2",
		pointsContainer: "flex items-center justify-between flex-wrap gap-4",
	},
});

const PointSelector = ({ socket }: { socket: Socket }) => {
	const { t } = useTranslation();
	const { base, title, pointsContainer } = pointSelectorStyles();

	const { room } = useRoomStore();
	const { userId } = useUserStore();
	const { pointValues, votingState } = room ?? {};

	const formMethods = useFormContext();
	const watchPointValues = formMethods.watch("pointValues");

	const [selectedPoint, setSelectedPoint] = useState<string | undefined>();

	useEffect(() => {
		if (votingState === VotingState.INITIAL || votingState === VotingState.ENDED) {
			setSelectedPoint(undefined);
		}
	}, [votingState]);

	const handlePointClick = ({ point }: { point?: string; isBRB?: boolean; isPass?: boolean }) => {
		socket.emit("vote", room?.id, userId, point);
	};

	const renderPoints = () => {
		const values = room ? pointValues : PointValues[(watchPointValues as PointValuesType) ?? PointValuesType.FIBB];
		return (
			<div className={pointsContainer()}>
				{values?.map((point: string) => (
					<PointButton
						key={point}
						point={point}
						selected={selectedPoint === point}
						preview={votingState !== VotingState.STARTED}
						onClick={() => {
							if (votingState === VotingState.STARTED) {
								setSelectedPoint(point);
								handlePointClick({ point });
							}
						}}
					/>
				))}
			</div>
		);
	};

	const renderTitle = () => {
		const titles = {
			[VotingState.INITIAL]: {
				icon: <CirclePause />,
				text: t('pointSelector.title', { context: votingState }),
			},
			[VotingState.STARTED]: {
				icon: <Vote />,
				text: t('pointSelector.title', { context: votingState }),
			},
			[VotingState.ENDED]: {
				icon: <ClipboardCheck />,
				text: t('pointSelector.title', { context: votingState }),
			},
			default: {
				icon: <Eye />,
				text: t('pointSelector.title', { context: votingState }),
			},
		};

		const { icon, text } = (votingState && titles[votingState]) ?? titles.default;

		return (
			<div className={title()}>
				{icon}
				{text}
			</div>
		);
	};

	const renderDescription = () => {
		switch (votingState) {
			case VotingState.INITIAL:
				return t("pointSelector.description", { context: votingState });
			case VotingState.STARTED:
				return t("pointSelector.description", { context: votingState });
			case VotingState.ENDED:
				return "";
		}
	};

	if (room?.votingState === VotingState.ENDED) {
		return null;
	}

	return (
		<Card className={base()}>
			<CardHeader>
				<CardTitle>{renderTitle()}</CardTitle>
				<CardDescription>{renderDescription()}</CardDescription>
			</CardHeader>
			<CardContent>{renderPoints()}</CardContent>
		</Card>
	);
};

export default PointSelector;
