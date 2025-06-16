import { cn } from "@/lib/utils/cn";
import type { ComponentProps } from "react";

type InputProps = ComponentProps<"input">;

export default function Input({ className, ...props }: InputProps) {
	return (
		<input
			className={cn(
				"h-10 px-4 placeholder:text-ui-placeholder bg-ui-input rounded-xl text-sm focus-within:outline-ui-placeholder/10",
				className,
			)}
			{...props}
		/>
	);
}

export function Label({ className, ...props }: ComponentProps<"label">) {
	return (
		<label className={cn("text-sm text-foreground", className)} {...props} />
	);
}
