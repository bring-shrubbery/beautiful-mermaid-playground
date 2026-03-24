"use client";

import {
	Copy01Icon,
	Download04Icon,
	Settings02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { DiagramColors } from "beautiful-mermaid";
import { useState } from "react";
import type {
	AsciiCustomizations,
	SvgCustomizations,
} from "@/components/customize-panel";
import {
	AsciiCustomizePanel,
	SvgCustomizePanel,
} from "@/components/customize-panel";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface MermaidPreviewProps {
	svgOutput: string;
	asciiOutput: string;
	rawAsciiOutput: string;
	mode: "svg" | "ascii";
	onModeChange: (mode: "svg" | "ascii") => void;
	themeName: string;
	themeNames: string[];
	onThemeNameChange: (name: string) => void;
	themeColors: DiagramColors;
	svgCustomizations: SvgCustomizations;
	onSvgCustomizationsChange: (options: SvgCustomizations) => void;
	asciiCustomizations: AsciiCustomizations;
	onAsciiCustomizationsChange: (options: AsciiCustomizations) => void;
	error: string | null;
}

function SvgContent({ html }: { html: string }) {
	return (
		<div
			className="flex items-center justify-center"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}

function AsciiContent({ html }: { html: string }) {
	return (
		<pre
			className="font-mono text-sm"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}

export function MermaidPreview({
	svgOutput,
	asciiOutput,
	rawAsciiOutput,
	mode,
	onModeChange,
	themeName,
	themeNames,
	onThemeNameChange,
	themeColors,
	svgCustomizations,
	onSvgCustomizationsChange,
	asciiCustomizations,
	onAsciiCustomizationsChange,
	error,
}: MermaidPreviewProps) {
	const [customizeOpen, setCustomizeOpen] = useState(false);

	function handleCopy() {
		const text = mode === "svg" ? svgOutput : rawAsciiOutput;
		navigator.clipboard.writeText(text);
	}

	function handleDownload() {
		const blob = new Blob([svgOutput], { type: "image/svg+xml" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "diagram.svg";
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<div className="flex h-full flex-col">
			{/* Toolbar */}
			<div className="flex items-center gap-2 border-b p-2">
				<ToggleGroup
					onValueChange={(v) => {
						if (v) onModeChange(v as "svg" | "ascii");
					}}
					type="single"
					value={mode}
				>
					<ToggleGroupItem value="svg">SVG</ToggleGroupItem>
					<ToggleGroupItem value="ascii">ASCII</ToggleGroupItem>
				</ToggleGroup>

				{mode === "svg" && (
					<Select onValueChange={onThemeNameChange} value={themeName}>
						<SelectTrigger className="w-44">
							<SelectValue placeholder="Theme" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="auto">Auto (system)</SelectItem>
							{themeNames.map((name) => (
								<SelectItem key={name} value={name}>
									{name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}

				<div className="flex-1" />

				<Tooltip>
					<TooltipTrigger asChild>
						<Button onClick={handleCopy} size="icon" variant="ghost">
							<HugeiconsIcon icon={Copy01Icon} size={16} />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Copy</TooltipContent>
				</Tooltip>

				{mode === "svg" && (
					<Tooltip>
						<TooltipTrigger asChild>
							<Button onClick={handleDownload} size="icon" variant="ghost">
								<HugeiconsIcon icon={Download04Icon} size={16} />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Download SVG</TooltipContent>
					</Tooltip>
				)}

				<Tooltip>
					<TooltipTrigger asChild>
						<Button
							onClick={() => setCustomizeOpen(!customizeOpen)}
							size="icon"
							variant={customizeOpen ? "secondary" : "ghost"}
						>
							<HugeiconsIcon icon={Settings02Icon} size={16} />
						</Button>
					</TooltipTrigger>
					<TooltipContent>Customize</TooltipContent>
				</Tooltip>
			</div>

			{/* Content + optional customize panel */}
			<div className="flex min-h-0 flex-1">
				<div className="flex-1 overflow-auto p-4">
					{error ? (
						<p className="text-destructive">{error}</p>
					) : mode === "svg" ? (
						<SvgContent html={svgOutput} />
					) : (
						<AsciiContent html={asciiOutput} />
					)}
				</div>

				{customizeOpen && (
					<div className="w-56 shrink-0 overflow-auto border-l">
						{mode === "svg" ? (
							<SvgCustomizePanel
								onChange={onSvgCustomizationsChange}
								options={svgCustomizations}
								themeColors={themeColors}
							/>
						) : (
							<AsciiCustomizePanel
								onChange={onAsciiCustomizationsChange}
								options={asciiCustomizations}
								themeColors={themeColors}
							/>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
