import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { forwardRef } from "react";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
	{
		variants: {
			variant: {
				primary: "bg-white hover:bg-white/80 text-black font-semibold",
				tertiary: "bg-white hover:bg-white/90 text-black font-medium",
				secondary:
					"bg-white/10 hover:bg-white/20 text-neutral-200 border border-white/10",
				outline: "border border-white/10 hover:bg-white/10 text-neutral-300",
				ghost: "hover:bg-white/10 text-neutral-300",
				danger:
					"bg-red-500/30 hover:bg-red-500/40 text-red-200 border border-red-500/20",
				accent: "bg-white hover:bg-white/90 text-black border border-white/20",
			},
			size: {
				sm: "h-8 px-3 text-xs",
				md: "h-10 px-4 text-sm",
				lg: "h-12 px-6 text-base",
				icon: "h-10 w-10 p-2",
				"icon-sm": "h-8 w-8 p-1.5",
			},
		},
		defaultVariants: {
			variant: "secondary",
			size: "md",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	accentColor?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ className = "", variant, size, accentColor, children, style, ...props },
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
				className={`${buttonVariants({ variant: accentColor ? "accent" : variant, size })} ${className}`}
				ref={ref}
				style={accentStyle}
				{...props}
			>
				{children}
			</button>
		);
	},
);

Button.displayName = "Button";

export { Button, buttonVariants };

