CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user` text,
	FOREIGN KEY (`user`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order` text NOT NULL,
	`vegetable_id` integer NOT NULL,
	`quantity` integer DEFAULT 1 NOT NULL,
	FOREIGN KEY (`order`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`vegetable_id`) REFERENCES `vegetables`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`address` text,
	`contact` text
);
--> statement-breakpoint
CREATE TABLE `vegetables` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`label` text NOT NULL,
	`price` text,
	`unit` text
);
--> statement-breakpoint
CREATE TABLE `foo` (
	`bar` text DEFAULT 'Hey!' NOT NULL
);
