import { seededRandom } from "@utils/random";

type Point = { seed: number; x: number; y: number; layer?: number };

const placedPoints: Point[] = [];
const positionCache = new Map<string, { x: number; y: number }>();

export function setPosition(
	seed: number,
	layer = 1,
): { x: number; y: number; layer?: number } {
	const cacheKey = `${seed}:${layer}`;
	const cached = positionCache.get(cacheKey);
	if (cached) return { ...cached, layer };

	const PAD = 5;
	const RANGE = 100 - PAD * 2;
	const LAYERS: Record<
		number,
		{
			ARMS: number;
			ARM_LIKELIHOOD: number;
			ARM_TIGHTNESS: number;
			ARM_SPREAD: number;
			RADIAL_SCALE: number;
			MIN_DIST: number;
			MAX_ATTEMPTS: number;
		}
	> = {
		0: {
			ARMS: 3,
			ARM_LIKELIHOOD: 0.9,
			ARM_TIGHTNESS: 8.0,
			ARM_SPREAD: 0.12,
			RADIAL_SCALE: RANGE * 0.45,
			MIN_DIST: 1.6,
			MAX_ATTEMPTS: 16,
		},
		1: {
			ARMS: 3,
			ARM_LIKELIHOOD: 0.78,
			ARM_TIGHTNESS: 6.0,
			ARM_SPREAD: 0.18,
			RADIAL_SCALE: RANGE / 2,
			MIN_DIST: 0.9,
			MAX_ATTEMPTS: 30,
		},
		2: {
			ARMS: 4,
			ARM_LIKELIHOOD: 0.5,
			ARM_TIGHTNESS: 5.0,
			ARM_SPREAD: 0.28,
			RADIAL_SCALE: RANGE * 0.6,
			MIN_DIST: 0.5,
			MAX_ATTEMPTS: 24,
		},
	};

	const params = LAYERS[layer] ?? LAYERS[1];
	const {
		ARMS,
		ARM_LIKELIHOOD,
		ARM_TIGHTNESS,
		ARM_SPREAD,
		RADIAL_SCALE,
		MIN_DIST,
		MAX_ATTEMPTS,
	} = params;

	const normal = (s1: number, s2: number) => {
		const u1 = Math.max(1e-6, seededRandom(s1));
		const u2 = Math.max(1e-6, seededRandom(s2));
		const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
		return z0;
	};

	for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
		const pick = seededRandom(seed + attempt * 701 + 11 + layer * 97);
		const onArm = pick < ARM_LIKELIHOOD;

		let x: number, y: number;

		if (onArm) {
			const armIdx = Math.floor(seededRandom(seed + 97 + layer * 41) * ARMS);

			const rSample = seededRandom(seed + attempt * 827 + 13 + layer * 59);
			const r = Math.pow(rSample, 0.6);
			const radius = r * RADIAL_SCALE;

			const armBase = (armIdx / ARMS) * (2 * Math.PI);

			// angle follows a logarithmic-like spiral: theta = base + tightness * log(1 + k * r)
			// this produces a curvature that increases with radius for a clearer arm shape
			const thetaBase = armBase + ARM_TIGHTNESS * Math.log(1 + r * 8);

			const aJitter =
				normal(
					seed + attempt * 401 + layer * 13,
					seed + attempt * 601 + layer * 17,
				) * ARM_SPREAD;
			const rJitter =
				normal(
					seed + attempt * 911 + layer * 19,
					seed + attempt * 1201 + layer * 23,
				) *
				(RADIAL_SCALE * 0.02);

			const theta = thetaBase + aJitter;
			const rr = Math.max(0, radius + rJitter);

			x = 50 + Math.cos(theta) * rr;
			y = 50 + Math.sin(theta) * rr;
		} else {
			const ux = seededRandom(seed + attempt * 1009 + 19);
			const uy = seededRandom(seed + attempt * 1307 + 29);
			x = PAD + ux * RANGE;
			y = PAD + uy * RANGE;
		}

		x = Math.max(PAD, Math.min(100 - PAD, x));
		y = Math.max(PAD, Math.min(100 - PAD, y));

		let ok = true;
		for (const p of placedPoints) {
			if ((p.layer ?? 1) !== layer) continue;
			const dx = p.x - x;
			const dy = p.y - y;
			const dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < MIN_DIST) {
				ok = false;
				break;
			}
		}

		if (ok) {
			const pos = { x, y };
			placedPoints.push({ seed, x, y, layer });
			positionCache.set(cacheKey, pos);
			return { ...pos, layer };
		}
	}

	const fallbackX = PAD + seededRandom(seed + layer * 37) * RANGE;
	const fallbackY = PAD + seededRandom(seed + 571 + layer * 71) * RANGE;
	const fallback = { x: fallbackX, y: fallbackY };
	placedPoints.push({ seed, x: fallbackX, y: fallbackY, layer });
	positionCache.set(cacheKey, fallback);
	return { ...fallback, layer };
}
