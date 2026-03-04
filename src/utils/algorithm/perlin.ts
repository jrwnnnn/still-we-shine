import { seededRandom } from "@utils/random";

type Point = { seed: number; x: number; y: number };

const placedPoints: Point[] = [];
const positionCache = new Map<number, { x: number; y: number }>();

export function setPosition(seed: number): { x: number; y: number } {
    const cached = positionCache.get(seed);
    if (cached) return cached;

    const PAD = 5;
    const RANGE = 100 - PAD * 2; 

    const NOISE_SEED = 91; 
    const FREQUENCY = 3; 
    const DENSITY_POWER = 1.6; 
    const MIN_DIST = 1.0; 
    const MAX_ATTEMPTS = 80;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

    const gridRandom = (ix: number, iy: number, seedOffset: number) => {
        const combined = seedOffset + ix * 374761393 + iy * 668265263;
        return seededRandom(combined | 0);
    };

    const noise2D = (x: number, y: number, freq: number, seedOffset: number) => {
        const gx = x * freq;
        const gy = y * freq;
        const ix = Math.floor(gx);
        const iy = Math.floor(gy);
        const fx = gx - ix;
        const fy = gy - iy;

        const s = gridRandom(ix, iy, seedOffset);
        const t = gridRandom(ix + 1, iy, seedOffset);
        const u = gridRandom(ix, iy + 1, seedOffset);
        const v = gridRandom(ix + 1, iy + 1, seedOffset);

        const sx = fade(fx);
        const a = lerp(s, t, sx);
        const b = lerp(u, v, sx);
        return lerp(a, b, fade(fy));
    };

    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        const rx = seededRandom(seed + attempt * 811);
        const ry = seededRandom(seed + attempt * 1301 + 9973);
        const x = PAD + rx * RANGE;
        const y = PAD + ry * RANGE;

        const nx = (x - PAD) / RANGE;
        const ny = (y - PAD) / RANGE;

        let density = noise2D(nx, ny, FREQUENCY, NOISE_SEED);
        density = Math.min(Math.max(density, 0), 1);
        const acceptProb = Math.pow(density, DENSITY_POWER);

        const draw = seededRandom(seed + attempt * 2027 + 17);
        if (draw > acceptProb) continue;

        let ok = true;
        for (const p of placedPoints) {
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
            placedPoints.push({ seed, x, y });
            positionCache.set(seed, pos);
            return pos;
        }
    }

    const fallbackX = PAD + seededRandom(seed) * RANGE;
    const fallbackY = PAD + seededRandom(seed + 571) * RANGE;
    const fallback = { x: fallbackX, y: fallbackY };
    placedPoints.push({ seed, x: fallbackX, y: fallbackY });
    positionCache.set(seed, fallback);
    return fallback;
}
