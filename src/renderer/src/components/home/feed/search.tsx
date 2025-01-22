import { useState } from "react";
import ScriptList from "../feed";
import Search from "../../../assets/Search.svg";

export default function SearchBar() {
    const [search, setSearch] = useState("");

    return (
        <>
        <div className="w-full space-y-4 mb-4">
            <div className="relative">
                <input
                    type="text"
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search scripts..."
                    className="w-full h-10 text-sm text-white 
                        bg-black/10 bg-gradient-to-r from-[#BCB1E7]/5 to-transparent 
                        border border-white/10 hover:border-white/20 backdrop-blur-3xl
                        rounded-lg pl-4 pr-4 transition-colors duration-200 hover:shadow-lg
                        placeholder:text-neutral-400 
                        focus:outline-none focus:border-white/20
                        active:border-white/20 active:outline-none"
                />
                <img
                    src={Search}
                    alt="Search"
                    className="absolute right-3 top-2.5 h-5 w-5 pointer-events-none"
                />
            </div>
        </div>
        {search.length === 0 ? (
            <ScriptList endpoint="/explore" type="explore" />
        ): (
            <ScriptList endpoint={`/searchbar/${search}`} type="search" />
        )} 
        </>
    );
}