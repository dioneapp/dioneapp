import dioneIcon from "../assets/icon.svg"

export default function Loading() {
    return (
        <div className="h-full w-full relative overflow-hidden">
            {/* background effects */}
            <div className="absolute inset-0 flex justify-center items-center">
                <div
                    className="absolute bg-white h-[70vh] w-[70vh] rounded-full blur-3xl opacity-[0.01]"
                />
                <div className="bg-[#BCB1E7] opacity-10 h-[50vh] w-[50vh] rounded-full blur-2xl" />
            </div>
            {/* main loading content */}
            <div className="flex flex-col items-center justify-center h-full w-full py-12">
                <div className="flex flex-col items-center justify-center h-full w-full">
                    <img src={dioneIcon} alt="Loading Dione" className="h-80 w-80" />
                    <div className="loader w-40">
                        <div className="loaderBar"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}