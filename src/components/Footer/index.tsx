import { useTranslation } from "react-i18next";
import { tv } from "tailwind-variants";

const styles = tv({
	slots: {
		footer: "flex flex-col items-center w-full py-2",
		hr: "w-full border-t-2 my-2",
		text: "text-xs opacity-50",
	},
});

const Footer = () => {
	const { t } = useTranslation();
	const { footer, hr, text } = styles();

	return (
		<>
			<footer className={footer()}>
				<hr className={hr()} />
				<p className={text()}>{t("footer.title")}</p>
			</footer>
		</>
	);
};

export default Footer;
