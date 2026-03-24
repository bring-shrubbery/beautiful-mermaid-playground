"use client";

import { renderMermaidASCII, renderMermaidSVG } from "beautiful-mermaid";
import { useCallback, useEffect, useMemo, useState } from "react";
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
	}, [debouncedText]);

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
						asciiOutput={asciiOutput}
						error={error}
						mode={previewMode}
						onModeChange={setPreviewMode}
						rawAsciiOutput={rawAsciiOutput}
						svgOutput={svgOutput}
					/>
				</div>
			</div>
		</div>
	);
}
