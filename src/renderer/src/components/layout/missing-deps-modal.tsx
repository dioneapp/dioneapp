import Icon from "../icons/icon";

interface props {
    data: any; 
    set: React.Dispatch<React.SetStateAction<any>>;
  }

export default function MissingDepsModal({ data, set }: props) {
	return (
		<div className="absolute inset-0 flex items-center justify-center bg-black/80 p-4 backdrop-blur-3xl" style={{zIndex: 80}}>
			<div className="p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden max-w-2xl max-h-2/4 h-full w-full backdrop-blur-md">
            <div className="flex justify-between w-full items-center">
                <h2 className="font-semibold text-lg flex items-center justify-center">Some dependencies are missing</h2>
                <button className="cursor-pointer z-50 flex items-center justify-center p-2 bg-white/10 rounded-full" type="button" onClick={() => set(null)}><Icon name="Close" className="h-3 w-3" /></button>
            </div>
            <div className="py-6 w-full h-full flex flex-col">
                <div className="flex flex-col gap-4 w-full max-h-60 overflow-auto border border-white/10 rounded p-4"> 
                    {data.map((dep) => (
                        <>
                        <div className="flex items-center justify-between" key={dep.name}>
                            <p className="text-xs text-neutral-400">{dep.name}{dep.version ? `@${dep.version}` : ""}</p>
                            <span>
                            {dep.installed || dep.reason === "installed" ? (
                                <Icon name="Installed" className="h-4 w-4" />
                            ) : (
                                <>
                                {dep.reason === "not-accepted" && <Icon name="NotAccepted" className="h-4 w-4" />}
                                {dep.reason === "version-not-satisfied" && <Icon name="NotSatisfied" className="h-4 w-4" />}
                                {dep.reason === "error" && <Icon name="NotInstalled" className="h-4 w-4" />}
                                </>
                            )}
                            </span>
                        </div>
                        <div className="h-[0.1px] w-full bg-neutral-400/10 rounded-full last:hidden" key={dep} />
                        </>
                    ))}
                </div>
                <div className="mt-auto flex items-center justify-end">
                    <button type="button" className="text-xs font-medium bg-white hover:bg-white/80 cursor-pointer transition-colors duration-300 rounded-full py-1 px-4 text-black">Install missing dependencies</button>
                </div>
            </div>
            </div> 
		</div>
	);
}