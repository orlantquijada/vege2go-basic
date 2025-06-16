import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const fooTable = sqliteTable("foo", {
	bar: text("bar").notNull().default("Hey!"),
});

export const User = sqliteTable("users", {
	id: text().primaryKey().notNull(),
	name: text(),
	address: text(),
	contact: text(),
});

export const Order = sqliteTable("orders", {
	id: text().primaryKey().notNull(),
	user: text().references(() => User.id, { onDelete: "cascade" }),
});

export const Vegetable = sqliteTable("vegetables", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	label: text().notNull(),
	price: text(),
	unit: text(),
});

export const OrderItem = sqliteTable("order_items", {
	id: integer().primaryKey({ autoIncrement: true }).notNull(),
	order: text()
		.references(() => Order.id, { onDelete: "cascade" })
		.notNull(),
	vegetableId: integer()
		.references(() => Vegetable.id, {
			onDelete: "cascade",
		})
		.notNull(),
	quantity: integer().notNull().default(1),
});
