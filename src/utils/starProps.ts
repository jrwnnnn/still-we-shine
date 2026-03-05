import starCatalog from "../data/star-catalog.json";

export type Star = (typeof starCatalog)[number];

export function getRandomStar(): Star {
	const index = Math.floor(Math.random() * starCatalog.length);
	return starCatalog[index];
}

export function setChromaticity(spectralType: string): string {
	const starClass = spectralType?.[0];
	const colorMap: Record<string, string> = {
		O: "#9bb0ff",
		B: "#aabfff",
		A: "#cad7ff",
		F: "#f8f7ff",
		G: "#fff4ea",
		K: "#ffd2a1",
		M: "#ffcc6f",
	};
	return colorMap[starClass] || "#ffffff";
}

export function setSize(vmag: number): number {
	return Math.min(18, Math.max(4, 18 - vmag * 2));
}

export function setLuminosity(vmag: number): number {
	return Math.min(1, Math.max(0.6, 1.1 - vmag * 0.08));
}
