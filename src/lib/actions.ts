"use server";

import { db } from "@/db/client";
import { Order, OrderItem, User } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { v4 as uuidV4 } from "uuid";
import { z } from "zod/v4-mini";
import { setUserCookie } from "./user";

const createOrderSchema = z.object({
	user: z.union([
		z.object({
			name: z.string().check(z.minLength(1)),
			address: z.string().check(z.minLength(5)),
			contact: z.string().check(z.minLength(11)),
		}),
		z.string(),
	]),
	items: z
		.array(
			z.object({
				vegetableId: z.number(),
				quantity: z.number().check(z.minimum(1)),
			}),
		)
		.check(z.minLength(1)),
});
export type CreateOrderBody = z.infer<typeof createOrderSchema>;

export async function createOrder(body: CreateOrderBody) {
	const validatedFields = createOrderSchema.safeParse(body);

	if (!validatedFields.success) {
		return {
			success: false,
		} as const;
	}

	const { user: userData, items } = validatedFields.data;

	try {
		const result = await db.transaction(async (tx) => {
			// find or create user
			const user =
				typeof userData === "string"
					? await tx.select().from(User).where(eq(User.id, userData)).get()
					: (
							await tx
								.insert(User)
								.values({ id: uuidV4(), ...userData })
								.returning()
						)[0];

			if (!user || !user.id) throw new Error("Failed to find or create user.");

			const newOrders = await tx
				.insert(Order)
				.values({ id: uuidV4(), user: user.id })
				.returning();

			const orderId = newOrders[0]?.id;

			if (!orderId) throw new Error("Failed to create order.");

			const orderItemsToInsert = items.map((item) => ({
				order: orderId,
				vegetableId: item.vegetableId,
				quantity: item.quantity,
			}));

			await tx.insert(OrderItem).values(orderItemsToInsert);

			setUserCookie(user.id);

			return { orderId };
		});

		revalidatePath("/");

		return {
			success: true,
			message: "Order created successfully!",
			orderId: result.orderId,
		} as const;
	} catch (error) {
		console.error("Failed to create order:", error);
		return {
			success: false,
			message: "An unexpected error occurred. Please try again.",
		} as const;
	}
}
