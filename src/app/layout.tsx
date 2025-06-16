import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Leaf from "@/icons/leaf";
import Link from "next/link";

const inter = Inter({
	variable: "--font-inter",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Vege2Go",
	description: "Order local fresh produce in Cebu!",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.variable} antialiased`}>
				<div className="max-w-md px-4 mx-auto w-full">
					<Header />

					{children}
				</div>
			</body>
		</html>
	);
}

function Header() {
	return (
		<header className="h-18 flex items-center justify-center">
			<Link href={{ pathname: "/" }}>
				<h1 className="font-inter font-bold text-lg text-accent flex gap-1 items-center justify-center">
					<Leaf className="text-accent" />
					<span>Vege2Go</span>
				</h1>
			</Link>
		</header>
	);
}
