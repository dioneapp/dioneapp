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
  return (
    <div className="absolute inset-0 w-full h-full z-50 backdrop-blur-sm bg-[#080808]">
      <div className="w-full h-full flex justify-center items-center">
        <div className="relative max-w-xl w-full border border-white/10 rounded-xl bg-[#080808] flex flex-col gap-4">
          <div className="p-6 flex flex-col gap-2 relative z-10">
            <h2 className="text-lg font-semibold text-white">Launch with custom parameters</h2>
            <ul className="w-full rounded text-sm text-neutral-300 font-mono flex flex-col gap-2 max-h-64 overflow-y-auto">
              {Object.entries(commands).map(([oldCommand, newCommand]) => (
                <li key={oldCommand} className="flex flex-col gap-1">
                  <span className="select-all text-[10px] text-neutral-400 truncate">{oldCommand}</span>
                  <input
                    onChange={(e) => onEdit(oldCommand, e.target.value)}
                    value={newCommand}
                    className="w-full focus:outline-none rounded px-2 py-1 bg-white/10 border border-white/10 text-white text-sm"
                  />
                </li>
              ))}
            </ul>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={onCancel}
                className="cursor-pointer bg-white/10 hover:bg-white/20 text-neutral-200 font-medium rounded-full p-1 px-4 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={onLaunch}
                className="cursor-pointer bg-white hover:bg-white/80 text-black font-semibold rounded-full p-1 px-4 text-sm"
              >
                Launch
              </button>
            </div>
          </div>
          {/* background effects */}
          <div className="absolute w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-2/4 w-32 h-32 bg-[#BCB1E7] rounded-full -translate-y-1/2 blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
