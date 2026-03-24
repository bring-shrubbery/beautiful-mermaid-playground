"use client";

import type { ThemeName } from "beautiful-mermaid";
import {
	renderMermaidASCII,
	renderMermaidSVG,
	THEMES,
} from "beautiful-mermaid";
import { useTheme } from "next-themes";
import { useCallback, useEffect, useMemo, useState } from "react";
import type {
	AsciiCustomizations,
	SvgCustomizations,
} from "@/components/customize-panel";
import {
	toAsciiRenderOptions,
	toSvgRenderOptions,
} from "@/components/customize-panel";
import { MermaidEditor } from "@/components/mermaid-editor";
import { MermaidPreview } from "@/components/mermaid-preview";
import { Navbar } from "@/components/navbar";
import { useDebouncedValue } from "@/hooks/use-debounce";

const DEFAULT_TEXT = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[End]
    C --> D`;

export default function HomePage() {
	const [mermaidText, setMermaidText] = useState(DEFAULT_TEXT);
	const [previewMode, setPreviewMode] = useState<"svg" | "ascii">("svg");
	const { resolvedTheme } = useTheme();
	const [themeName, setThemeName] = useState<ThemeName | "auto">("auto");
	const [immediateRender, setImmediateRender] = useState(false);
	const [svgCustomizations, setSvgCustomizations] = useState<SvgCustomizations>(
		{},
	);
	const [asciiCustomizations, setAsciiCustomizations] =
		useState<AsciiCustomizations>({});

	const debouncedText = useDebouncedValue(mermaidText, 300, immediateRender);

	useEffect(() => {
		if (immediateRender) {
			setImmediateRender(false);
		}
	}, [immediateRender]);

	const { svgOutput, asciiOutput, rawAsciiOutput, error } = useMemo(() => {
		try {
			const autoTheme =
				resolvedTheme === "dark" ? "github-dark" : "github-light";
			const resolvedThemeName = themeName === "auto" ? autoTheme : themeName;
			const themeColors = THEMES[resolvedThemeName];
			const svgOverrides = toSvgRenderOptions(svgCustomizations);
			const svg = renderMermaidSVG(debouncedText, {
				...themeColors,
				...svgOverrides,
			});

			const asciiOverrides = toAsciiRenderOptions(asciiCustomizations);
			const ascii = renderMermaidASCII(debouncedText, {
				colorMode: "html",
				...asciiOverrides,
			});
			const rawAscii = renderMermaidASCII(debouncedText, {
				colorMode: "none",
				...asciiOverrides,
			});
			return {
				svgOutput: svg,
				asciiOutput: ascii,
				rawAsciiOutput: rawAscii,
				error: null,
			};
		} catch (e) {
			return {
				svgOutput: "",
				asciiOutput: "",
				rawAsciiOutput: "",
				error: e instanceof Error ? e.message : "Rendering failed",
			};
		}
	}, [
		debouncedText,
		themeName,
		resolvedTheme,
		svgCustomizations,
		asciiCustomizations,
	]);

	const handlePaste = useCallback(() => {
		setImmediateRender(true);
	}, []);

	return (
		<div className="flex h-screen flex-col">
			<Navbar />
			<div className="flex min-h-0 flex-1">
				<div className="w-1/2 border-r">
					<MermaidEditor
						onChange={setMermaidText}
						onPaste={handlePaste}
						value={mermaidText}
					/>
				</div>
				<div className="w-1/2">
					<MermaidPreview
						asciiCustomizations={asciiCustomizations}
						asciiOutput={asciiOutput}
						error={error}
						mode={previewMode}
						onAsciiCustomizationsChange={setAsciiCustomizations}
						onModeChange={setPreviewMode}
						onSvgCustomizationsChange={setSvgCustomizations}
						onThemeNameChange={setThemeName}
						rawAsciiOutput={rawAsciiOutput}
						svgCustomizations={svgCustomizations}
						svgOutput={svgOutput}
						themeName={themeName}
						themeNames={Object.keys(THEMES)}
					/>
				</div>
			</div>
		</div>
	);
}
