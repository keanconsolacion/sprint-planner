import { AvatarImage, AvatarFallback, Avatar } from "../ui/avatar";
import { useController, useFormContext } from "react-hook-form";
import { avatars } from "@/commons";
import { tv } from "tailwind-variants";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";

const styles = tv({
	slots: {
		root: "flex flex-col gap-2",
		popoverTriggerContainer: "flex gap-3 items-center",
		popoverContent: "w-80",
		avatar: "cursor-pointer hover:scale-110 transition-transform duration-200",
		avatarContainer: "flex gap-2 flex-wrap w-full",
		buttonContent: "flex gap-2 items-center",
		attribution: "flex w-full justify-end text-[10px] text-gray-600 mt-4 underline",
	},
});

const AvatarSelector = () => {
	const { t } = useTranslation();
	const { control } = useFormContext();
	const {
		root,
		popoverTriggerContainer,
		popoverContent,
		avatar: avatarStyles,
		avatarContainer,
		buttonContent,
		attribution,
	} = styles();

	const {
		field: { value: avatarSrc, onChange: onChangeAvatar },
	} = useController({
		name: "avatarSrc",
		control: control,
		defaultValue: avatars[0],
	});

	return (
		<div className={root()}>
			<p>{t("avatarSelector.title")}</p>
			<Popover>
				<div className={popoverTriggerContainer()}>
					<Avatar className={avatarStyles()}>
						<AvatarImage src={avatarSrc} alt={avatarSrc} />
						<AvatarFallback>?</AvatarFallback>
					</Avatar>
					<PopoverTrigger asChild>
						<Button variant="outline" type="button">
							<div className={buttonContent()}>{t("action.chooseAvatar")}</div>
						</Button>
					</PopoverTrigger>
				</div>
				<PopoverContent className={popoverContent()}>
					<div className={avatarContainer()}>
						{avatars.map((_avatarSrc) => (
							<Avatar key={_avatarSrc} className={avatarStyles()} onClick={() => onChangeAvatar(_avatarSrc)}>
								<AvatarImage src={_avatarSrc} alt={_avatarSrc} />
								<AvatarFallback>?</AvatarFallback>
							</Avatar>
						))}
						<a className={attribution()} href="https://www.flaticon.com/free-icons/panda">
							{t("avatarSelector.attribution")}
						</a>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default AvatarSelector;
