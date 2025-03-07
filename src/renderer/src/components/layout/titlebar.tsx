import Icon from "../icons/icon";

export default function Titlebar() {
	const handleClose = async () => {
		await window.electron.ipcRenderer.invoke("app:close");
	};

	const handleMinimize = async () => {
		await window.electron.ipcRenderer.invoke("app:minimize");
	};

	return (
		<div
			id="titlebar"
			className="absolute top-0 w-full z-50"
			style={{ zIndex: 100 }}
		>
			<div className="flex flex-row items-center justify-center h-10 w-full px-2">
				<div className="flex gap-1 items-center justify-end h-full w-full">
					<button
						type="button"
						id="minimize-button"
						onClick={handleMinimize}
						className="cursor-pointer p-2"
					>
						<Icon name="Minus" className="h-3 w-3" />
					</button>
					<button
						type="button"
						id="close-button"
						onClick={handleClose}
						className="cursor-pointer p-2"
					>
						<Icon name="Close" className="h-3 w-3" />
					</button>
				</div>
			</div>
		</div>
	);
}
