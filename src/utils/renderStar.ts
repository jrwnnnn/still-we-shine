import { setChromaticity, setSize, setLuminosity } from "./starProps";
import { seededRandom, hashSeed } from "./random";

export interface Star {
	color: string;
	size: number;
	glow: number;
	beamLen: number;
	beamW: number;
	pulseDelay: string;
}

export function renderStar(starData: any, row: any): Star | null {
	if (!starData) return null;

	const vmag = parseFloat(starData.Vmag) || 3;
	const color = setChromaticity(starData["Sp Type"]);
	const size = setSize(vmag);
	const glow = setLuminosity(vmag);
	const beamLen = size * 5;
	const beamW = Math.max(1.5, size * 0.18);

	const seed = hashSeed(
		`${row.star_hr}-${row.name}-${row.birth_year}-${row.death_year}`,
	);
	const pulseDelay = (seededRandom(seed + 999) * 3).toFixed(2);

	return {
		color,
		size,
		glow,
		beamLen,
		beamW,
		pulseDelay,
	};
}

export default renderStar;
