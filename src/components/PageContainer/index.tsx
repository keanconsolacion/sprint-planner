import { PropsWithChildren } from "react";
import { tv } from "tailwind-variants";

const styles = tv({
	slots: {
		base: "p-4 flex flex-col items-center",
		content: "max-w-screen-lg",
	},
});

const PageContainer = ({ children }: PropsWithChildren) => {
	const { base, content } = styles();
	return (
		<div className={base()} style={{ minHeight: "calc(100vh - 115px)" }}>
			<div className={content()}>{children}</div>
		</div>
	);
};

export default PageContainer;
