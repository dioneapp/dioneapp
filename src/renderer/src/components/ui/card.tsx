import { type VariantProps, cva } from "class-variance-authority";
import type React from "react";

const cardVariants = cva(
	"rounded-xl border transition-all duration-200 cursor-default",
	{
		variants: {
			variant: {
				default: "border-white/10 bg-white/5 hover:bg-white/8",
				subtle: "border-white/5 bg-black/30",
				elevated: "border-white/10 bg-neutral-900 shadow-2xl",
				interactive:
					"border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 cursor-pointer",
				info: "border-blue-500/20 bg-blue-500/10",
				warning: "border-orange-500/20 bg-orange-500/10",
				success: "border-green-500/20 bg-green-500/10",
				danger: "border-red-500/20 bg-red-500/10",
			},
			padding: {
				none: "",
				sm: "p-2",
				md: "p-3",
				lg: "p-4",
				xl: "p-5",
			},
		},
		defaultVariants: {
			variant: "default",
			padding: "md",
		},
	},
);

export interface CardProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof cardVariants> {
	as?: "div" | "section" | "article";
}

export function Card({
	className,
	variant,
	padding,
	as: Component = "div",
	...props
}: CardProps) {
	return (
		<Component
			className={`${cardVariants({ variant, padding })} ${className || ""}`}
			{...props}
		/>
	);
}
