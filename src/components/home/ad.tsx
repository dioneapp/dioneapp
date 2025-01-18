import { openLink } from "../../utils/openLink";

export default function Ad() {
  return (
    <div className="cursor-pointer relative w-full h-full border border-white/10 rounded-xl overflow-hidden" onClick={() => openLink("https://getdione.app")}>
      <div className="absolute inset-0 flex items-center justify-center hover:scale-95 transition-all duration-500">
        <div className="bg-[#BCB1E7] rounded-full absolute w-44 h-24 blur-3xl" />
        <div className="w-full px-4 py-8 mx-auto text-center z-50">
          <h2 className="text-3xl font-semibold text-center text-nowrap">
            <span>Explore, Install, Innovate — in 1 Click.</span>
          </h2>
        </div>
      </div>
    </div>
  );
}