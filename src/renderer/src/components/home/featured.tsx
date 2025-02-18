import PromoBanner from "./promo";
import ScriptList from "./feed";

export default function Featured() {
	return (
		<>
			<ScriptList endpoint="/featured" type="featured" />
			<PromoBanner />
		</>
	);
}
