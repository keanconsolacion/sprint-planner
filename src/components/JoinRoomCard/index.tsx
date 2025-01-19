import { useToast } from "@/hooks/use-toast";
import { useRoomStore } from "@/store/useRoomStore";
import { useUserStore } from "@/store/useUserStore";
import { FormProvider, useController, useForm } from "react-hook-form";
import uuid from "uuid4";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import { Socket } from "socket.io-client";
import { Room, ServerCallbackProps } from "@/commons";
import { TOAST_DURATION } from "../constants";
import AvatarSelector from "../AvatarSelector";
import useAuditStore, { initialLogMessages } from "@/store/useAuditStore";
import { tv } from "tailwind-variants";
import { useTranslation } from "react-i18next";

const styles = tv({
	slots: {
		base: "w-[350px]",
		form: "grid w-full items-center gap-4",
		nickname: "flex flex-col space-y-1.5",
		lobby: "flex flex-col space-y-1.5",
		footer: "flex justify-between mt-4",
		errorText: "text-red-500 text-sm mt-1",
	},
});

export const JoinRoomCard = ({ socket }: { socket: Socket }) => {
	const { t } = useTranslation();
	const { base, form, nickname: nicknameStyles, lobby, footer, errorText } = styles();

	const joinRoomId = new URLSearchParams(window.location.search).get("join");
	
	const { room } = useRoomStore();
	const { userId, setUserId } = useUserStore();
	const { setRoom } = useRoomStore();
	const { addLog } = useAuditStore();
	const { toast } = useToast();
	
	const formMethods = useForm({});
	const {
		formState: { errors },
	} = formMethods;

	const {
		field: { value: nickname, onChange: onChangeNickname },
	} = useController({
		name: "nickname",
		control: formMethods.control,
		rules: { required: t('error.required') },
		defaultValue: "",
	});

	const onCreateInstead = () => {
		window.location.href = import.meta.env.VITE_BASE_URL;
	};

	const joinRoom = () => {
		const _userId = userId ?? uuid();
		setUserId(_userId);
		const { nickname, avatarSrc } = formMethods.getValues();
		socket.emit(
			"joinRoom",
			joinRoomId,
			_userId,
			nickname,
			avatarSrc,
			({ status, data: room }: ServerCallbackProps<Room>) => {
				if (status === "ok" && room) {
					toast({
						title: t("joinRoomCard.snackbar.joinedRoomSuccess"),
						description: t("joinRoomCard.snackbar.joinedRoomSuccessDescription", { roomName: room.roomName }),
						duration: TOAST_DURATION,
					});
					initialLogMessages.forEach((log) => addLog(log));
					setRoom(room);
				} else {
					toast({
						variant: "destructive",
						title: t("joinRoomCard.snackbar.joinedRoomFail"),
						description: t("joinRoomCard.snackbar.joinedRoomFailDescription"),
						duration: TOAST_DURATION,
					});
				}
			}
		);
	};

	if (room || !joinRoomId) {
		return null;
	}

	return (
		<FormProvider {...formMethods}>
			<Card className={base()}>
				<CardHeader>
					<CardTitle>{t("joinRoomCard.title")}</CardTitle>
					<CardDescription>{t("joinRoomCard.description")}</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={formMethods.handleSubmit(joinRoom)}>
						<div className={form()}>
							<div className={nicknameStyles()}>
								<Label htmlFor="name">{t("joinRoomCard.fields.nickname.label")}</Label>
								<Input
									id="name"
									placeholder={t("joinRoomCard.fields.nickname.placeholder")}
									value={nickname}
									onChange={onChangeNickname}
								/>
								{errors.nickname && <p className={errorText()}>{errors.nickname.message as string}</p>}
							</div>
							<AvatarSelector />
							<div className={lobby()}>
								<Label htmlFor="name">{t("joinRoomCard.fields.lobbyId.label")}</Label>
								<Input id="name" value={joinRoomId} disabled />
							</div>
						</div>
						<div className={footer()}>
							<Button variant="outline" type="button" onClick={onCreateInstead}>
								{t("action.createInstead")}
							</Button>
							<Button type="submit">{t('action.enterRoom')}</Button>
						</div>
					</form>
				</CardContent>
			</Card>
		</FormProvider>
	);
};
