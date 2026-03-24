"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { HugeiconsIcon } from "@hugeicons/react";
import { Sun02Icon, Moon02Icon, GithubIcon } from "@hugeicons/core-free-icons";
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
    <header className="h-14 border-b flex items-center px-4 justify-between">
      <span className="font-semibold">Beautiful Mermaid Playground</span>
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {mounted ? (
            resolvedTheme === "dark" ? (
              <HugeiconsIcon icon={Sun02Icon} size={18} />
            ) : (
              <HugeiconsIcon icon={Moon02Icon} size={18} />
            )
          ) : null}
        </Button>
        <a
          href="https://github.com/lukilabs/beautiful-mermaid"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub repository"
        >
          <Button variant="ghost" size="icon">
            <HugeiconsIcon icon={GithubIcon} size={18} />
          </Button>
        </a>
      </div>
    </header>
  );
}
