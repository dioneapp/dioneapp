import React, { useEffect, useState } from "react";
// import all svgs in the assets folder
const icons = import.meta.glob("@assets/svgs/*.svg", {
	eager: true,
	query: "?raw",
	import: "default",
});

type IconProps = {
	name: string;
	className?: string;
};

const Icon: React.FC<IconProps> = ({ name, className = "" }) => {
	const [svgContent, setSvgContent] = useState<string | null>(null);

	useEffect(() => {
		// make sure to write the name correctly or the icon will not be displayed!
		const iconSvg = icons[`/src/assets/svgs/${name}.svg`];
		if (iconSvg) {
			setSvgContent(iconSvg as unknown as string);
		} else {
			console.error(`⚠️ Icon "${name}" not found`);
			setSvgContent(null);
		}
	}, [name]);

	if (!svgContent) return null;

	// inject className into svg
	const modifiedSvgContent = svgContent.replace(
		/<svg([^>]+)>/,
		(_match, group) => {
			const existingClass = group.match(/class="([^"]+)"/);
			const newClass = existingClass
				? `${existingClass[1]} ${className}`
				: className;
			return `<svg${group} class="${newClass}">`;
		},
	);

	return (
		<span
			className={className}
			dangerouslySetInnerHTML={{ __html: modifiedSvgContent }} // probably should change this later for security reasons
		/>
	);
};

export default Icon;
