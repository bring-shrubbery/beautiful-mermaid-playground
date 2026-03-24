"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { renderMermaidSVG, renderMermaidASCII } from "beautiful-mermaid";
import { useDebouncedValue } from "@/hooks/use-debounce";
import { Navbar } from "@/components/navbar";
import { MermaidEditor } from "@/components/mermaid-editor";
import { MermaidPreview } from "@/components/mermaid-preview";

const DEFAULT_TEXT = `graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[End]
    C --> D`;

export default function HomePage() {
	const [mermaidText, setMermaidText] = useState(DEFAULT_TEXT);
	const [previewMode, setPreviewMode] = useState<"svg" | "ascii">("svg");
	const [immediateRender, setImmediateRender] = useState(false);

	const debouncedText = useDebouncedValue(mermaidText, 300, immediateRender);

	useEffect(() => {
		if (immediateRender) {
			setImmediateRender(false);
		}
	}, [immediateRender]);

	const { svgOutput, asciiOutput, rawAsciiOutput, error } = useMemo(() => {
		try {
			const svg = renderMermaidSVG(debouncedText, {
				bg: "var(--background)",
				fg: "var(--foreground)",
				transparent: true,
			});
			const ascii = renderMermaidASCII(debouncedText, { colorMode: "html" });
			const rawAscii = renderMermaidASCII(debouncedText, { colorMode: "none" });
			return { svgOutput: svg, asciiOutput: ascii, rawAsciiOutput: rawAscii, error: null };
		} catch (e) {
			return {
				svgOutput: "",
				asciiOutput: "",
				rawAsciiOutput: "",
				error: e instanceof Error ? e.message : "Rendering failed",
			};
		}
	}, [debouncedText]);

	const handlePaste = useCallback(() => {
		setImmediateRender(true);
	}, []);

	return (
		<div className="flex flex-col h-screen">
			<Navbar />
			<div className="flex flex-1 min-h-0">
				<div className="w-1/2 border-r">
					<MermaidEditor
						value={mermaidText}
						onChange={setMermaidText}
						onPaste={handlePaste}
					/>
				</div>
				<div className="w-1/2">
					<MermaidPreview
						svgOutput={svgOutput}
						asciiOutput={asciiOutput}
						rawAsciiOutput={rawAsciiOutput}
						mode={previewMode}
						onModeChange={setPreviewMode}
						error={error}
					/>
				</div>
			</div>
		</div>
	);
}
