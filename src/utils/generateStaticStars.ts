import { setChromaticity, setSize, setLuminosity } from "./starProps";
import { seededRandom } from "./random";

const SPECTRAL_TYPES = ["O", "B", "A", "F", "F", "G", "G", "K", "M"];

export interface DecorativeStar {
	x: number;
	y: number;
	color: string;
	size: number;
	glow: number;
	beamLen: number;
	beamW: number;
	pulseDelay: string;
}

export function generateStaticStars(seeds: number[]): DecorativeStar[] {
	return seeds.map((seed) => {
		const vmag = 0.5 + seededRandom(seed + 2) * 5;
		const spectral =
			SPECTRAL_TYPES[
				Math.floor(seededRandom(seed + 3) * SPECTRAL_TYPES.length)
			];
		const color = setChromaticity(spectral);
		const size = setSize(vmag);
		const glow = setLuminosity(vmag);
		const beamLen = size * 5;
		const beamW = Math.max(1.5, size * 0.18);
		const pulseDelay = (seededRandom(seed + 4) * 3).toFixed(2);
		const x = seededRandom(seed) * 98 + 1;
		const y = seededRandom(seed + 1) * 98 + 1;

		return {
			x,
			y,
			color,
			size,
			glow,
			beamLen,
			beamW,
			pulseDelay,
		};
	});
}
