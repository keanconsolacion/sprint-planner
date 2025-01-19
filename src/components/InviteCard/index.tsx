import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useRoomStore } from "@/store/useRoomStore";
import { tv } from "tailwind-variants";
import { TOAST_DURATION } from "../constants";
import { useTranslation } from "react-i18next";

const styles = tv({
	slots: {
		base: "w-[350px]",
		button: "w-full ",
	},
});

const InviteCard = () => {
	const { t } = useTranslation();
	const { base, button } = styles();
	const { toast } = useToast();
	const { room } = useRoomStore();

	const handleCopyInviteLink = () => {
		navigator.clipboard.writeText(`${import.meta.env.VITE_BASE_URL}?join=${room?.id}`);
		toast({
			title: "Copied to clipboard.",
			description: "The invite URL has been copied to your clipboard.",
			duration: TOAST_DURATION,
		});
	};

	if (!room) {
		return null;
	}

	return (
		<Card className={base()}>
			<CardHeader>
				<CardTitle>{t("inviteCard.title")}</CardTitle>
				<CardDescription>{t("inviteCard.description")}</CardDescription>
			</CardHeader>
			<CardContent>
				<Button variant={"outline"} className={button()} onClick={handleCopyInviteLink} disabled={!room}>
					{t("action.copyInviteLink")}
				</Button>
			</CardContent>
		</Card>
	);
};

export default InviteCard;
