"use client";

import { type CreateOrderBody, createOrder } from "@/lib/actions";
import { useRouter } from "next/navigation";
import Input, { Label } from "./ui/input";

type Props = {
	veges: {
		id: number;
		label: string;
		price: string | null;
		unit: string | null;
	}[];
	user?: {
		name: string | null;
		id: string;
		address: string | null;
		contact: string | null;
	};
};

export default function CreateOrderForm({ veges, user }: Props) {
	const router = useRouter();
	const handleSubmit = async (formData: FormData) => {
		const data = Object.fromEntries(formData.entries());

		const items: CreateOrderBody["items"] = [];
		for (const vege of veges) {
			if (data[vege.id])
				items.push({ quantity: Number(data[vege.id]), vegetableId: vege.id });
		}

		const payload: CreateOrderBody = {
			items,
			user: formData.get("userId")?.toString() || {
				name: formData.get("name")?.toString() || "",
				address: formData.get("address")?.toString() || "",
				contact: formData.get("contact")?.toString() || "",
			},
		};

		const res = await createOrder(payload);

		if (res.success) {
			router.push(`/${res.orderId}`);
		}
	};

	return (
		<form className="pb-6" action={handleSubmit}>
			<div className="flex py-3 gap-6 flex-col">
				{user ? (
					<div>
						<input
							type="hidden"
							name="userId"
							value={user?.id}
							className="hidden"
						/>

						<p>
							Welcome back, <strong>{user.name}</strong>!
						</p>
					</div>
				) : (
					<>
						<div className="flex flex-col gap-2">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								type="text"
								placeholder="Enter your name"
								name="name"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="number">Contact Number</Label>
							<Input
								id="number"
								type="text"
								placeholder="Enter your contact number (09xx xxx xxxx)"
								name="contact"
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="address">Address</Label>
							<Input
								id="address"
								type="text"
								name="address"
								placeholder="Enter your address"
							/>
						</div>
					</>
				)}
			</div>

			<div className="py-4">
				<h1 className="text-base font-semibold">Vegetables</h1>

				<div className="flex flex-col py-3 gap-6">
					{veges.map((vege) => (
						<div className="flex flex-col gap-2" key={vege.id}>
							<Label
								htmlFor={vege.id.toString()}
								className="flex justify-between"
								key={vege.id}
							>
								<span className="capitalize">{vege.label}</span>
								<span>
									₱{vege.price}
									{!!vege.unit && `/${vege.unit}`}
								</span>
							</Label>
							<Input
								id={vege.id.toString()}
								name={vege.id.toString()}
								type="number"
							/>
						</div>
					))}
				</div>
			</div>
			<button
				type="submit"
				className="bg-accent text-on-accent rounded-xl h-12 grid place-items-center w-full font-semibold text-base transition-all active:scale-98"
			>
				Place Order
			</button>
		</form>
	);
}
