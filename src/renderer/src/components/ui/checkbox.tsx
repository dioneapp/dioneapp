import { type VariantProps, cva } from "class-variance-authority";
import type React from "react";
import { forwardRef } from "react";

const checkboxVariants = cva(
	"cursor-pointer rounded transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed",
	{
		variants: {
			variant: {
				default:
					"border-white/20 bg-white/5 hover:bg-white/10 checked:bg-white checked:border-white focus:ring-white/50",
				accent: "border-white/20 bg-white/5 hover:bg-white/10 focus:ring-2",
			},
			size: {
				sm: "h-4 w-4",
				md: "h-5 w-5",
				lg: "h-6 w-6",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "md",
		},
	},
);

export interface CheckboxProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
		VariantProps<typeof checkboxVariants> {
	label?: string;
	accentColor?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	(
		{ className = "", variant, size, label, accentColor, style, ...props },
		ref,
	) => {
		const accentStyle = accentColor
			? {
					...style,
					accentColor: "var(--theme-accent)",
				}
			: style;

		const checkbox = (
			<input
				type="checkbox"
				className={`${checkboxVariants({ variant: accentColor ? "accent" : variant, size })} ${className}`}
				ref={ref}
				style={accentStyle}
				{...props}
			/>
		);

		if (label) {
			return (
				<label className="flex items-center gap-2 cursor-pointer">
					{checkbox}
					<span className="text-sm text-neutral-300 select-none">{label}</span>
				</label>
			);
		}

		return checkbox;
	},
);

Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
