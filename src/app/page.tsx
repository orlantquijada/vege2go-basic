import CreateOrderForm from "@/components/CreateOrderForm";
import { db } from "@/db/client";
import { User } from "@/db/schema";
import { getUserCookie } from "@/lib/user";
import { eq } from "drizzle-orm";
import { Suspense } from "react";

export default async function Home() {
	return (
		<Suspense fallback={<span>loading...</span>}>
			<Veges />
		</Suspense>
	);
}

async function Veges() {
	const veges = await db.query.Vegetable.findMany();
	const userId = await getUserCookie();

	const user = userId
		? await db.query.User.findFirst({ where: eq(User.id, userId) })
		: undefined;

	return <CreateOrderForm veges={veges} user={user} />;
}
