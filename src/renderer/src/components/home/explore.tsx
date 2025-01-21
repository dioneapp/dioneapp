import SearchBar from "./feed/search";
import ScriptList from "./feed";


export default function Explore() {
    return (
        <>
            <SearchBar />
            <ScriptList endpoint="/explore" type="explore" />
        </>
    );
}