import { db } from "@/db/client";
import { Order, OrderItem, Vegetable } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
	params: Promise<{ id: string }>;
};

export default async function OrderSuccessPage({ params }: Props) {
	const { id } = await params;

	return (
		<Suspense fallback={<span>loading...</span>}>
			<OrderDetails orderId={id} />
		</Suspense>
	);
}

async function OrderDetails({ orderId }: { orderId: string }) {
	const order = await db.query.Order.findFirst({
		where: eq(Order.id, orderId),
	});

	if (!order) notFound();

	const orderItemsWithVeges = await db
		.select({
			id: OrderItem.id,
			quantity: OrderItem.quantity,
			vegetableName: Vegetable.label,
			price: Vegetable.price,
			unit: Vegetable.unit,
		})
		.from(OrderItem)
		.innerJoin(Vegetable, eq(OrderItem.vegetableId, Vegetable.id))
		.where(eq(OrderItem.order, order.id));

	return (
		<div>
			<h1 className="text-center mb-3">
				Thank you for using <strong>Vege2Go</strong>!
			</h1>

			<Link
				href="/"
				className="bg-accent text-on-accent rounded-xl h-12 grid place-items-center w-full font-semibold text-base transition-all active:scale-98"
			>
				Buy Again
			</Link>

			<div className="mt-6">
				<h2 className="font-semibold mb-3">Order:</h2>
				{!!orderItemsWithVeges.length && (
					<ul className="flex flex-col gap-1.5 w-full">
						{orderItemsWithVeges.map((item) => (
							<li key={item.id} className="w-full">
								<span className="flex justify-between">
									<span>{item.vegetableName}</span>
									<span>
										{item.quantity}
										{item.unit}
									</span>
								</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
