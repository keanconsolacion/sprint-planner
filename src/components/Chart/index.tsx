import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useRoomStore } from "@/store/useRoomStore";
import { VotingState } from "@/commons";
import { tv } from "tailwind-variants";
import { useTranslation } from "react-i18next";

const styles = tv({
	slots: {
		base: "w-[448px]",
		cardContent: "flex-col justify-center items-center",
		doughnut: "flex justify-center items-center px-8",
		calculations: "flex gap-4 justify-center mt-8",
	},
});

const Chart = () => {
	const { t } = useTranslation();
	const { base, cardContent, doughnut, calculations } = styles();
	const { room } = useRoomStore();

	if (!room || room?.votingState !== VotingState.ENDED) {
		return null;
	}

	// No need to memoize these values, as it's only rendered once per voting summary.
	const dataPoints = room?.users ? Object.values(room.users).map((user) => (user.data?.point as string) ?? "?") : [];
	const uniqueDataPoints = [...new Set(dataPoints)];
	const dataPointsCount = uniqueDataPoints.map((point) => dataPoints.filter((dataPoint) => dataPoint === point).length);
	const numericalPoints = dataPoints.filter((point) => !isNaN(Number(point)));
	const mean = numericalPoints.reduce((acc, curr) => acc + parseInt(curr), 0) / numericalPoints.length;
	const sortedNumericalPoints = numericalPoints.map(Number).sort((a, b) => a - b);
	const middle = Math.floor(sortedNumericalPoints.length / 2);
	const median =
		sortedNumericalPoints.length % 2 === 0
			? (sortedNumericalPoints[middle - 1] + sortedNumericalPoints[middle]) / 2
			: sortedNumericalPoints[middle];
	const data = {
		labels: uniqueDataPoints,
		datasets: [
			{
				label: "# of Votes",
				data: dataPointsCount,
				backgroundColor: [
					"rgba(255, 99, 132, 0.6)",
					"rgba(54, 162, 235, 0.6)",
					"rgba(255, 206, 86, 0.6)",
					"rgba(75, 192, 192, 0.6)",
					"rgba(153, 102, 255, 0.6)",
					"rgba(255, 159, 64, 0.6)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
				],
				borderWidth: 0,
			},
		],
	};

	return (
		<Card className={base()}>
			<CardHeader>
				<CardTitle>{t("chart.title")}</CardTitle>
			</CardHeader>
			<CardContent className={cardContent()}>
				<div className={doughnut()}>
					<Doughnut data={data} options={{ maintainAspectRatio: true }} />
				</div>
				<div className={calculations()}>
					<p>{t("chart.votes", { count: numericalPoints.length })}</p>
					<p>{t("chart.average", { average: isNaN(mean) ? "?" : mean.toPrecision(2) })}</p>
					<p>{t("chart.median", { median: isNaN(median) ? "?" : median })}</p>
				</div>
			</CardContent>
		</Card>
	);
};

export default Chart;
