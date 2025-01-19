import { Card, CardContent } from "@/components/ui/card";
import { Dices } from "lucide-react";
import { tv } from "tailwind-variants";

interface PointButtonProps {
	point: string;
	selected: boolean;
	preview: boolean;
	onClick: () => void;
}

const pointButtonStyles = tv({
	slots: {
		base: "flex items-center justify-center h-[100px] w-[80px]",
		content: "p-0 w-full h-full relative flex items-center justify-center",
		dice1: "absolute w-4 h-4 left-2 top-2 opacity-40",
		dice2: "absolute w-4 h-4 right-2 bottom-2 opacity-40",
		point: "select-none text-[26px]",
	},
	variants: {
		selected: {
			true: "bg-slate-50 text-black",
		},
		preview: {
			true: {
				base: "cursor-not-allowed",
			},
			false: {
				base: "transition-transform duration-200 hover:scale-110 cursor-pointer",
			},
		},
	},
});

const PointButton = ({ point, onClick, selected = false, preview = false }: PointButtonProps) => {
	const { base, content, point: pointStyles, dice1, dice2 } = pointButtonStyles({ preview });
	return (
		
		<Card className={base({ selected })} onClick={onClick}>
			<CardContent className={content()}>
				<Dices className={dice1()} />
				<p className={pointStyles()}>
					{point}
				</p>
				<Dices className={dice2()} />
			</CardContent>
		</Card>
	);
};

export default PointButton;
