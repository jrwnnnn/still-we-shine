import {seededRandom} from "@utils/random";

export function setPosition(seed: number): { x: number; y: number } {
	return {
		x: 5 + seededRandom(seed) * 90,
		y: 5 + seededRandom(seed + 571) * 90,
	};
}
