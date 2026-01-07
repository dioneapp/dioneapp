import { Button, Input, Modal, ModalBody, ModalFooter } from "@/components/ui";
import { useTranslation } from "@/translations/translation-context";

export default function CustomCommandsModal({
	commands,
	onEdit,
	onLaunch,
	onCancel,
}: {
	commands: Record<string, string>;
	onEdit: (oldCommand: string, newCommand: string) => void;
	onLaunch: () => void;
	onCancel: () => void;
}) {
	const { t } = useTranslation();

	return (
		<Modal
			isOpen={true}
			onClose={onCancel}
			title={t("customCommands.title")}
			maxWidth="xl"
		>
			<ModalBody>
				<ul className="w-full rounded-xl text-sm text-neutral-300 font-mono flex flex-col gap-2 max-h-64 overflow-y-auto">
					{Object.entries(commands).map(([oldCommand, newCommand]) => (
						<li key={oldCommand} className="flex flex-col gap-1">
							<span className="select-all text-[10px] text-neutral-400 truncate">
								{oldCommand}
							</span>
							<Input
								onChange={(e) => onEdit(oldCommand, e.target.value)}
								value={newCommand}
								variant="mono"
								size="md"
							/>
						</li>
					))}
				</ul>
			</ModalBody>

			<ModalFooter>
				<Button variant="primary" onClick={onLaunch} className="w-full">
					{t("customCommands.launch")}
				</Button>
			</ModalFooter>
		</Modal>
	);
}
