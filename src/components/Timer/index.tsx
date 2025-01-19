import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface TimerProps {
	updatedOn: string;
}

const Timer: React.FC<TimerProps> = ({ updatedOn }) => {
	const { t } = useTranslation();

	const [timeElapsed, setTimeElapsed] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			const now = new Date();
			const updatedDate = new Date(updatedOn);
			const elapsed = Math.floor((now.getTime() - updatedDate.getTime()) / 1000);
			setTimeElapsed(elapsed);
		}, 1000);

		return () => clearInterval(interval);
	}, [updatedOn]);

	const minutes = Math.floor(timeElapsed / 60);
	const seconds = timeElapsed % 60;

	return <p>{t("timer.elapsed", { minutes, seconds })}</p>;
};

export default Timer;
