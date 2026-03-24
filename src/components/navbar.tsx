"use client";

import { GithubIcon, Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
	const [mounted, setMounted] = useState(false);
	const { resolvedTheme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	function toggleTheme() {
		setTheme(resolvedTheme === "dark" ? "light" : "dark");
	}

	return (
		<header className="flex h-14 items-center justify-between border-b px-4">
			<span className="font-semibold">Beautiful Mermaid Playground</span>
			<div className="flex items-center gap-1">
				<Button
					aria-label="Toggle theme"
					onClick={toggleTheme}
					size="icon"
					variant="ghost"
				>
					{mounted ? (
						resolvedTheme === "dark" ? (
							<HugeiconsIcon icon={Sun02Icon} size={18} />
						) : (
							<HugeiconsIcon icon={Moon02Icon} size={18} />
						)
					) : null}
				</Button>
				<a
					aria-label="GitHub repository"
					href="https://github.com/bring-shrubbery/beautiful-mermaid-playground"
					rel="noopener noreferrer"
					target="_blank"
				>
					<Button size="icon" variant="ghost">
						<HugeiconsIcon icon={GithubIcon} size={18} />
					</Button>
				</a>
			</div>
		</header>
	);
}
