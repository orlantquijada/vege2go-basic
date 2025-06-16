import { cookies } from "next/headers";

const USER_ID_KEY = "userId";

export async function getUserCookie() {
	const cookieStore = await cookies();
	const userId = cookieStore.get(USER_ID_KEY)?.value;

	return userId;
}

export async function setUserCookie(userId: string) {
	const cookieStore = await cookies();
	cookieStore.set(USER_ID_KEY, userId, {
		maxAge: 60 * 60 * 24 * 365, // 1 yr
		httpOnly: false,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		path: "/",
	});
}
