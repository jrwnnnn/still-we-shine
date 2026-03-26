import { getRandomStar } from "./starProps";

const ipCache = new Map<string, { count: number; lastReset: number }>();
const WINDOW = 5 * 60 * 1000;
const MAX_STARS = 5;
const VALID_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export function isRateLimited(ip: string, peek = false): boolean {
	const now = Date.now();
	let user = ipCache.get(ip);

	if (!user || now - user.lastReset > WINDOW) {
		user = { count: 0, lastReset: now };
		ipCache.set(ip, user);
	}

	if (user.count >= MAX_STARS) return true;

	if (!peek) {
		user.count++;
	}

	return false;
}

async function isBot(token: string | null): Promise<boolean> {
	if (!token) return true;
	const res = await fetch(
		`https://www.google.com/recaptcha/api/siteverify?secret=${import.meta.env.RECAPTCHA_SECRET_KEY || process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
		{ method: "POST" },
	);
	const data = await res.json();
	return !data.success || data.score < 0.5;
}

export async function validateSubmission(formData: FormData, ip: string) {
	if (isRateLimited(ip)) return "Too many requests.";
	if (await isBot(formData.get("recaptcha_token") as string))
		return "Security check failed. Please try again.";

	const name = (formData.get("name") as string)?.trim();
	const birthYear = parseInt(formData.get("birth_year") as string);
	const deathYear = parseInt(formData.get("death_year") as string);
	const image = formData.get("image") as File;

	if (!name) return "Pet name is required.";
	if (birthYear > deathYear) return "Birth year must be before death year.";
	if (image?.size > 5 * 1024 * 1024) return "Image must be under 5MB.";
	if (image?.size > 0 && !VALID_TYPES.includes(image.type))
		return "Invalid image format.";

	return {
		name,
		birthYear,
		deathYear,
		message: (formData.get("message") as string)?.trim(),
		image,
		star: getRandomStar(),
	};
}
