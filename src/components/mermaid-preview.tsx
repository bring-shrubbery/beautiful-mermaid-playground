"use client";

import { HugeiconsIcon } from "@hugeicons/react";
import { Copy01Icon, Download04Icon } from "@hugeicons/core-free-icons";
import { Button } from "@/components/ui/button";
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
  error: string | null;
}

export function MermaidPreview({
  svgOutput,
  asciiOutput,
  rawAsciiOutput,
  mode,
  onModeChange,
  error,
}: MermaidPreviewProps) {
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
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b">
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(v) => {
            if (v) onModeChange(v as "svg" | "ascii");
          }}
        >
          <ToggleGroupItem value="svg">SVG</ToggleGroupItem>
          <ToggleGroupItem value="ascii">ASCII</ToggleGroupItem>
        </ToggleGroup>

        <div className="flex-1" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={handleCopy}>
              <HugeiconsIcon icon={Copy01Icon} size={16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Copy</TooltipContent>
        </Tooltip>

        {mode === "svg" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={handleDownload}>
                <HugeiconsIcon icon={Download04Icon} size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Download SVG</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {error ? (
          <p className="text-destructive">{error}</p>
        ) : mode === "svg" ? (
          <div
            dangerouslySetInnerHTML={{ __html: svgOutput }}
            className="flex items-center justify-center"
          />
        ) : (
          <pre
            dangerouslySetInnerHTML={{ __html: asciiOutput }}
            className="font-mono text-sm"
          />
        )}
      </div>
    </div>
  );
}
