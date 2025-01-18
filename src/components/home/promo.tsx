import { openLink } from "../../utils/openLink";

export default function PromoBanner() {
  return (
    <div className="mt-4 w-full rounded-xl bg-gradient-to-br from-purple-500/20 via-indigo-500/15 to-blue-500/10 border border-white/10 overflow-hidden">
      <div className="relative w-full p-4">
        {/* background effects */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-purple-500/20 rounded-full -translate-y-1/2 blur-2xl" />
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-blue-500/20 rounded-full translate-y-1/2 blur-2xl" />

        {/* main promo content */}
        <div className="relative flex flex-row items-center justify-between px-4 z-10">
          <div className="flex flex-col space-y-1">
            <h3 className="text-lg font-semibold text-white">
              Want to be featured here?
            </h3>
            <p className="text-sm text-white/70">
              Showcase your tool to our community
            </p>
          </div>
          <button
            onClick={() => openLink("https://getdione.app/promote")}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-300 text-sm font-medium whitespace-nowrap"
          >
            Get Featured
          </button>
        </div>
      </div>
    </div>
  );
}