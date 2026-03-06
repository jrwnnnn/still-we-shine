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

type StarData = { Vmag?: string; "Sp Type"?: string };
type Row = Record<string, unknown>;

export function renderStar(
	starData: StarData | null | undefined,
	row: Row,
): Star | null {
	if (!starData) return null;

	const vmag = parseFloat(String(starData.Vmag ?? "")) || 3;
	const color = setChromaticity(String(starData["Sp Type"] ?? ""));
	const size = setSize(vmag);
	const glow = setLuminosity(vmag);
	const beamLen = size * 5;
	const beamW = Math.max(1.5, size * 0.18);

	const seed = hashSeed(
		`${String(row["star_hr"] ?? "")}-${String(row["name"] ?? "")}-${String(row["birth_year"] ?? "")}-${String(row["death_year"] ?? "")}`,
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
