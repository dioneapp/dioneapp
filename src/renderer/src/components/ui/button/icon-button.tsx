import { type VariantProps, cva } from "class-variance-authority";
import type React from "react";
import { forwardRef } from "react";

const iconButtonVariants = cva(
	"inline-flex items-center justify-center rounded-xl transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
	{
		variants: {
			variant: {
				default: "hover:bg-white/10 text-neutral-300 hover:text-white",
				secondary:
					"bg-white/10 hover:bg-white/20 text-neutral-300 border border-white/10",
				outline: "border border-white/10 hover:bg-white/10 text-neutral-300",
				ghost: "hover:bg-white/10 text-neutral-300 hover:text-white",
				danger: "hover:bg-red-500/20 text-red-400 hover:text-red-300",
				accent: "",
			},
			size: {
				xs: "h-6 w-6 p-1",
				sm: "h-8 w-8 p-1.5",
				"icon-sm": "h-7 w-7 p-1.5",
				md: "h-10 w-10 p-2",
				lg: "h-12 w-12 p-3",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
	VariantProps<typeof iconButtonVariants> & {
		icon: React.ReactNode;
		tooltip?: string;
		accentColor?: boolean;
	};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
	(
		{
			className = "",
			variant,
			size,
			icon,
			tooltip,
			accentColor,
			style,
			...props
		},
		ref,
	) => {
		const accentStyle = accentColor
			? {
					...style,
					borderColor:
						"color-mix(in srgb, var(--theme-accent) 50%, transparent)",
					backgroundColor:
						"color-mix(in srgb, var(--theme-accent) 20%, transparent)",
					color: "var(--theme-accent)",
				}
			: style;

		return (
			<button
				className={`${iconButtonVariants({ variant: accentColor ? "accent" : variant, size })} ${className}`}
				ref={ref}
				title={tooltip}
				style={accentStyle}
				{...props}
			>
				{icon}
			</button>
		);
	},
);

IconButton.displayName = "IconButton";

export { IconButton, iconButtonVariants };
