import starCatalog from "../data/star-catalog.json";

export type Star = (typeof starCatalog)[number];

export function getRandomStar(): Star {
	const index = Math.floor(Math.random() * starCatalog.length);
	return starCatalog[index];
}

export function getChromaticity(spectralType: string): string {
	const starClass = spectralType[0];
	const colorMap: Record<string, string> = {
		O: "blue",
		B: "bluish white",
		A: "white",
		F: "yellowish white",
		G: "yellow",
		K: "light orange",
		H: "light orangish red",
	};
	return colorMap[starClass] || "unknown";
}
