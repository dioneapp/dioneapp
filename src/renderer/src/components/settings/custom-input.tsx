import { Folder } from "lucide-react";

interface CustomInputProps {
	value: string;
	onChange: (value: string) => void;
	onClick: () => void;
	onClickIcon?: () => void;
	icon?: React.ReactNode;
}

export default function CustomInput({
	value,
	onChange,
	onClick,
	onClickIcon = () => {},
	icon = <Folder className="w-4 h-4 text-neutral-300" />,
}: CustomInputProps) {
	return (
		<div className="flex gap-2 items-center justify-end w-full">
			<div className="flex gap-0">
				<input
					required
					readOnly
					onClick={onClick}
					className="bg-white/10 border border-r-none border-white/5 text-neutral-200 font-mono text-sm h-10 px-4 rounded-xl rounded-r-none truncate max-w-[calc(100%-12rem)] min-w-[18rem] focus:outline-none hover:bg-white/20 cursor-pointer transition-colors duration-200"
					type="text"
					value={value}
					onChange={(e) => {
						const value = e.target.value;
						if (value !== null && value.trim() !== "") {
							onChange(value);
						}
					}}
				/>
				<button
					onClick={() => onClickIcon()}
					className="bg-white/10 rounded-r-xl px-4 border border-white/5 hover:bg-white/20 transition-colors duration-200 cursor-pointer"
					type="button"
				>
					{icon}
				</button>
			</div>
		</div>
	);
}
