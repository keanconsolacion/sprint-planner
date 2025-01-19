import { tv } from "tailwind-variants";
import { Button } from "../ui/button";
import { useRoomStore } from "@/store/useRoomStore";
import { useTranslation } from "react-i18next";

const styles = tv({
	slots: {
		base: "h-[65px] flex flex-col",
		logo: "font-bold text-2xl text-center",
		content: "w-full flex flex-1 justify-center items-center",
		container: "flex px-[16px] flex-1 justify-between max-w-screen-lg",
		buttonContainer: "flex gap-[8px]",
	},
});

const NavigationBar = () => {
	const { t } = useTranslation();
	const { base, logo, content, container, buttonContainer } = styles();
	const joinRoomId = new URLSearchParams(window.location.search).get("join");
	const { room } = useRoomStore();

	return (
		<header className={base()}>
			<div className={content()}>
				<div className={container()}>
					<p className={logo()}>{t("navigationBar.title")}</p>
					{(room || joinRoomId) && (
						<div className={buttonContainer()}>
							<Button variant={"outline"} size={"sm"} onClick={() => (window.location.href = "/")}>
								<a>{t("action.createNewRoom")}</a>
							</Button>
						</div>
					)}
				</div>
			</div>
			<hr />
		</header>
	);
};

export default NavigationBar;
