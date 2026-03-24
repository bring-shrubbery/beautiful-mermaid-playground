import "@/styles/globals.css";

import type { Metadata } from "next";
import { Caveat, Geist, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const caveat = Caveat({
	subsets: ["latin"],
	variable: "--font-cursive",
});

export const metadata: Metadata = {
	title: "Beautiful Mermaid Playground",
	description: "Playground for the beautiful-mermaid npm package",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
	subsets: ["latin"],
	variable: "--font-geist-sans",
});

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			className={cn(
				geist.variable,
				"font-sans",
				inter.variable,
				caveat.variable,
			)}
			lang="en"
			suppressHydrationWarning
		>
			<body>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<TooltipProvider>{children}</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
