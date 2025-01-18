import dioneIcon from "../../assets/icon.svg";

export default function QuickLaunch() {
    return (
        <div className="flex mt-auto w-full h-64">
            <div>
                <h2 className="font-semibold">Quick Launch</h2>
                <div className="grid grid-cols-3 gap-2 my-4">
                    <button className="flex flex-col justify-center items-center rounded-xl gap-2 w-full h-full">
                        <img src={dioneIcon} alt="Dione logo" className="h-20 w-20 border border-white/10 rounded-xl" />   
                        <p className="text-xs text-neutral-400">Dione</p>
                    </button>
                    <button className="flex flex-col justify-center items-center rounded-xl gap-2 w-full h-full">
                    <img src={dioneIcon} alt="Dione logo" className="h-20 w-20 border border-white/10 rounded-xl" />  
                        <p className="text-xs text-neutral-400">Dione</p>
                    </button>
                    <button className="flex flex-col justify-center items-center rounded-xl gap-2 w-full h-full">
                    <img src={dioneIcon} alt="Dione logo" className="h-20 w-20 border border-white/10 rounded-xl" />  
                        <p className="text-xs text-neutral-400">Dione</p>
                    </button>
                    <button className="flex flex-col justify-center items-center rounded-xl gap-2 w-full h-full">
                    <img src={dioneIcon} alt="Dione logo" className="h-20 w-20 border border-white/10 rounded-xl" />  
                        <p className="text-xs text-neutral-400">Dione</p>
                    </button>
                    <button className="flex flex-col justify-center items-center rounded-xl gap-2 w-full h-full">                        
                        <img src={dioneIcon} alt="Dione logo" className="h-20 w-20 border border-white/10 rounded-xl" />  
                        <p className="text-xs text-neutral-400">Dione</p>
                    </button>
                    <button className="flex flex-col justify-center items-center rounded-xl gap-2 w-full h-full">
                        <img src={dioneIcon} alt="Dione logo" className="h-20 w-20 border border-white/10 rounded-xl" />  
                        <p className="text-xs text-neutral-400">Dione</p>
                    </button>
                </div>
            </div>
        </div>
    )
}