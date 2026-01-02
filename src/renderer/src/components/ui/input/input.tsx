import { cva, type VariantProps } from "class-variance-authority";
import type React from "react";
import { forwardRef } from "react";

const inputVariants = cva(
	"w-full bg-white/10 border border-white/5 text-neutral-200 rounded-xl focus:outline-none hover:bg-white/20 transition-colors duration-200",
	{
		variants: {
			size: {
				sm: "h-8 px-3 text-xs",
				md: "h-10 px-4 text-sm",
				lg: "h-12 px-6 text-base",
			},
			variant: {
				default: "",
				mono: "font-mono",
			},
		},
		defaultVariants: {
			size: "md",
			variant: "default",
		},
	},
);

export interface InputProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
		VariantProps<typeof inputVariants> {}

const Input = forwardRef<HTMLInputElement, InputProps>(
	({ className = "", size, variant, ...props }, ref) => {
		return (
			<input
				className={`${inputVariants({ size, variant })} ${className}`}
				ref={ref}
				{...props}
			/>
		);
	},
);

Input.displayName = "Input";

export { Input, inputVariants };

interface InputWithIconProps extends Omit<InputProps, "size"> {
	icon?: React.ReactNode;
	onIconClick?: () => void;
	iconPosition?: "left" | "right";
	size?: "sm" | "md" | "lg";
}

export const InputWithIcon = forwardRef<HTMLInputElement, InputWithIconProps>(
	(
		{
			icon,
			onIconClick,
			iconPosition = "right",
			className = "",
			size,
			variant,
			...props
		},
		ref,
	) => {
		const hasIcon = !!icon;
		const iconClickable = !!onIconClick;

		// Padding adjustments for icon inside input
		const paddingClassName = iconPosition === "left" ? "pl-10" : "pr-10";

		return (
			<div className={`relative ${className}`}>
				{iconPosition === "left" && hasIcon && (
					<div
						onClick={iconClickable ? onIconClick : undefined}
						className={`absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 ${iconClickable ? "cursor-pointer" : "cursor-default pointer-events-none"}`}
					>
						{icon}
					</div>
				)}

				<input
					className={`${inputVariants({ size, variant })} ${hasIcon ? paddingClassName : ""}`}
					ref={ref}
					{...props}
				/>

				{iconPosition === "right" && hasIcon && (
					<div
						onClick={iconClickable ? onIconClick : undefined}
						className={`absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 ${iconClickable ? "cursor-pointer" : "cursor-default pointer-events-none"}`}
					>
						{icon}
					</div>
				)}
			</div>
		);
	},
);

InputWithIcon.displayName = "InputWithIcon";

const textareaVariants = cva(
	"w-full bg-white/10 border border-white/5 text-neutral-200 rounded-xl focus:outline-none hover:bg-white/20 transition-colors duration-200 resize-none",
	{
		variants: {
			size: {
				sm: "p-2 text-xs",
				md: "p-3 text-sm",
				lg: "p-4 text-base",
			},
			variant: {
				default: "",
				mono: "font-mono",
			},
		},
		defaultVariants: {
			size: "md",
			variant: "default",
		},
	},
);

export interface TextareaProps
	extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
		VariantProps<typeof textareaVariants> {}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className = "", size, variant, ...props }, ref) => {
		return (
			<textarea
				className={`${textareaVariants({ size, variant })} ${className}`}
				ref={ref}
				{...props}
			/>
		);
	},
);

Textarea.displayName = "Textarea";
