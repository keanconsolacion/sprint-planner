import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import uuid from "uuid4";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useController, useFormContext } from "react-hook-form";
import { PointValuesType, ServerCallbackProps, CreateRoomResponseObject, PointValues } from "../../commons";
import { useRoomStore } from "../../store/useRoomStore";
import { Label } from "@radix-ui/react-label";
import { Socket } from "socket.io-client";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/store/useUserStore";
import useAuditStore, { initialLogMessages } from "@/store/useAuditStore.ts";
import { useTranslation } from "react-i18next";
import AvatarSelector from "../AvatarSelector";

export const CreateRoomCard = ({ socket }: { socket: Socket }) => {
	const { t } = useTranslation();
	const joinRoomId = new URLSearchParams(window.location.search).get("join");
	const formMethods = useFormContext();
	const { userId, setUserId } = useUserStore();
	const { setRoom, room } = useRoomStore();
	const { addLog } = useAuditStore();
	const { toast } = useToast();
	const {
		formState: { errors },
	} = formMethods;

	const {
		field: { value: nickname, onChange: onChangeNickname },
	} = useController({
		name: "nickname",
		control: formMethods.control,
		rules: { required: t("error.required") },
		defaultValue: "",
	});

	const {
		field: { value: roomName, onChange: onChangeRoomName },
	} = useController({
		name: "roomName",
		control: formMethods.control,
		rules: { required: t("error.required") },
		defaultValue: "",
	});

	const {
		field: { value: pointValues, onChange: onChangePointValues },
	} = useController({
		name: "pointValues",
		control: formMethods.control,
		rules: { required: t("error.required") },
		defaultValue: PointValuesType.FIBB,
	});

	const createRoom = () => {
		const _userId = userId ?? uuid();
		const { nickname, roomName, avatarSrc } = formMethods.getValues();
		setUserId(_userId);
		socket.emit(
			"createRoom",
			{
				userId: _userId,
				nickname,
				roomName,
				pointValues: PointValues[pointValues as PointValuesType],
				avatarSrc,
			},
			(response: ServerCallbackProps<CreateRoomResponseObject>) => {
				const { data, message } = response;
				const { room } = data ?? {};
				if (room?.id) {
					[...initialLogMessages, message].forEach((log) => addLog(log));
					setRoom(room);
				} else {
					toast({
						variant: "destructive",
						title: t("error.title"),
						description: t("error.description"),
					});
				}
				return console.log(message);
			}
		);
	};

	if (room || joinRoomId) {
		return null;
	}

	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>{t("createRoomCard.title")}</CardTitle>
				<CardDescription>{t("createRoomCard.description")}</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={formMethods.handleSubmit(createRoom)}>
					<div className="grid w-full items-center gap-4">
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">{t("createRoomCard.fields.nickname.label")}</Label>
							<Input
								id="name"
								placeholder={t("createRoomCard.fields.nickname.placeholder")}
								value={nickname}
								onChange={onChangeNickname}
							/>
							{errors.nickname && <p className="text-red-500 text-sm mt-1">{errors.nickname.message as string}</p>}
						</div>
						<AvatarSelector />
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="name">{t("createRoomCard.fields.roomName.label")}</Label>
							<Input
								id="name"
								placeholder={t("createRoomCard.fields.roomName.placeholder")}
								value={roomName}
								onChange={onChangeRoomName}
							/>
							{errors.roomName && <p className="text-red-500 text-sm mt-1">{errors.roomName.message as string}</p>}
						</div>
						<div className="flex flex-col space-y-1.5">
							<Label htmlFor="framework">{t("createRoomCard.fields.pointValues.label")}</Label>
							<Select value={pointValues} onValueChange={onChangePointValues}>
								<SelectTrigger id="framework">
									<SelectValue placeholder="Select" />
								</SelectTrigger>
								<SelectContent position="popper">
									<SelectItem value={PointValuesType.FIBB}>{t("createRoomCard.fields.pointValues.fib")}</SelectItem>
									<SelectItem value={PointValuesType.SCRUM}>{t("createRoomCard.fields.pointValues.scrum")}</SelectItem>
									<SelectItem value={PointValuesType.INCREMENTAL}>
										{t("createRoomCard.fields.pointValues.incremental")}
									</SelectItem>
									<SelectItem value={PointValuesType.HALF_INCREMENTAL}>
										{t("createRoomCard.fields.pointValues.halfIncremental")}
									</SelectItem>
								</SelectContent>
							</Select>
							{errors.pointValues && (
								<p className="text-red-500 text-sm mt-1">{errors.pointValues.message as string}</p>
							)}
						</div>
						<Button type="submit">{t('action.createRoom')}</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};
