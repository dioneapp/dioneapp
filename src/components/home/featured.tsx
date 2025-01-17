import ScriptList from "./feed/feed";

export default function Featured() {
    return <ScriptList endpoint="/featured" type="featured" />;
}