"use client";

import type {
	AsciiRenderOptions,
	DiagramColors,
	RenderOptions,
} from "beautiful-mermaid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const FONT_OPTIONS = [
	"Inter",
	"Arial",
	"Helvetica",
	"Georgia",
	"Times New Roman",
	"Courier New",
	"Verdana",
	"Trebuchet MS",
	"Palatino",
	"Garamond",
	"Comic Sans MS",
] as const;

interface SvgCustomizations {
	font?: string;
	padding?: number;
	nodeSpacing?: number;
	layerSpacing?: number;
	componentSpacing?: number;
	transparent?: boolean;
	interactive?: boolean;
	bg?: string;
	fg?: string;
	line?: string;
	accent?: string;
	muted?: string;
	surface?: string;
	border?: string;
}

interface AsciiCustomizations {
	useAscii?: boolean;
	paddingX?: number;
	paddingY?: number;
	boxBorderPadding?: number;
	fg?: string;
	border?: string;
	line?: string;
	arrow?: string;
	accent?: string;
	bg?: string;
	corner?: string;
	junction?: string;
}

export type { AsciiCustomizations, SvgCustomizations };

function NumberField({
	label,
	value,
	placeholder,
	onChange,
}: {
	label: string;
	value: number | undefined;
	placeholder: string;
	onChange: (value: number | undefined) => void;
}) {
	return (
		<div className="flex items-center justify-between gap-2">
			<Label className="shrink-0 text-xs">{label}</Label>
			<Input
				className="h-7 w-20 text-xs"
				onChange={(e) => {
					const v = e.target.value;
					onChange(v === "" ? undefined : Number(v));
				}}
				placeholder={placeholder}
				type="number"
				value={value ?? ""}
			/>
		</div>
	);
}

function ColorField({
	label,
	value,
	fallback,
	onChange,
}: {
	label: string;
	value: string | undefined;
	fallback: string;
	onChange: (value: string | undefined) => void;
}) {
	return (
		<div className="flex items-center justify-between gap-2">
			<Label className="shrink-0 text-xs">{label}</Label>
			<div className="flex items-center gap-1">
				{value && (
					<button
						className="text-muted-foreground text-xs hover:text-foreground"
						onClick={() => onChange(undefined)}
						type="button"
					>
						Reset
					</button>
				)}
				<input
					className="h-7 w-8 cursor-pointer rounded border-none bg-transparent"
					onChange={(e) => onChange(e.target.value)}
					type="color"
					value={value ?? fallback}
				/>
			</div>
		</div>
	);
}

function SwitchField({
	label,
	checked,
	onChange,
}: {
	label: string;
	checked: boolean;
	onChange: (checked: boolean) => void;
}) {
	return (
		<div className="flex items-center justify-between gap-2">
			<Label className="text-xs">{label}</Label>
			<Switch checked={checked} onCheckedChange={onChange} />
		</div>
	);
}

function SectionTitle({ children }: { children: React.ReactNode }) {
	return (
		<h3 className="font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
			{children}
		</h3>
	);
}

export function SvgCustomizePanel({
	options,
	onChange,
	themeColors,
}: {
	options: SvgCustomizations;
	onChange: (options: SvgCustomizations) => void;
	themeColors: DiagramColors;
}) {
	const update = (patch: Partial<SvgCustomizations>) =>
		onChange({ ...options, ...patch });

	return (
		<div className="flex flex-col gap-3 p-3">
			<SectionTitle>Layout</SectionTitle>
			<div className="flex flex-col gap-2">
				<div className="flex items-center justify-between gap-2">
					<Label className="shrink-0 text-xs">Font</Label>
					<Select
						onValueChange={(v) =>
							update({ font: v === "Inter" ? undefined : v })
						}
						value={options.font ?? "Inter"}
					>
						<SelectTrigger className="h-7 w-28 text-xs">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{FONT_OPTIONS.map((font) => (
								<SelectItem key={font} value={font}>
									<span style={{ fontFamily: font }}>{font}</span>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<NumberField
					label="Padding"
					onChange={(v) => update({ padding: v })}
					placeholder="40"
					value={options.padding}
				/>
				<NumberField
					label="Node spacing"
					onChange={(v) => update({ nodeSpacing: v })}
					placeholder="24"
					value={options.nodeSpacing}
				/>
				<NumberField
					label="Layer spacing"
					onChange={(v) => update({ layerSpacing: v })}
					placeholder="40"
					value={options.layerSpacing}
				/>
				<NumberField
					label="Component spacing"
					onChange={(v) => update({ componentSpacing: v })}
					placeholder="24"
					value={options.componentSpacing}
				/>
			</div>

			<Separator />

			<SectionTitle>Options</SectionTitle>
			<div className="flex flex-col gap-2">
				<SwitchField
					checked={options.transparent ?? false}
					label="Transparent background"
					onChange={(v) => update({ transparent: v })}
				/>
				<SwitchField
					checked={options.interactive ?? false}
					label="Interactive tooltips"
					onChange={(v) => update({ interactive: v })}
				/>
			</div>

			<Separator />

			<SectionTitle>Colors</SectionTitle>
			<div className="flex flex-col gap-2">
				<ColorField
					fallback={themeColors.bg}
					label="Background"
					onChange={(v) => update({ bg: v })}
					value={options.bg}
				/>
				<ColorField
					fallback={themeColors.fg}
					label="Foreground"
					onChange={(v) => update({ fg: v })}
					value={options.fg}
				/>
				<ColorField
					fallback={themeColors.line ?? themeColors.fg}
					label="Line"
					onChange={(v) => update({ line: v })}
					value={options.line}
				/>
				<ColorField
					fallback={themeColors.accent ?? themeColors.fg}
					label="Accent"
					onChange={(v) => update({ accent: v })}
					value={options.accent}
				/>
				<ColorField
					fallback={themeColors.muted ?? themeColors.fg}
					label="Muted"
					onChange={(v) => update({ muted: v })}
					value={options.muted}
				/>
				<ColorField
					fallback={themeColors.surface ?? themeColors.bg}
					label="Surface"
					onChange={(v) => update({ surface: v })}
					value={options.surface}
				/>
				<ColorField
					fallback={themeColors.border ?? themeColors.fg}
					label="Border"
					onChange={(v) => update({ border: v })}
					value={options.border}
				/>
			</div>
		</div>
	);
}

export function AsciiCustomizePanel({
	options,
	onChange,
	themeColors,
}: {
	options: AsciiCustomizations;
	onChange: (options: AsciiCustomizations) => void;
	themeColors: DiagramColors;
}) {
	const update = (patch: Partial<AsciiCustomizations>) =>
		onChange({ ...options, ...patch });

	return (
		<div className="flex flex-col gap-3 p-3">
			<SectionTitle>Options</SectionTitle>
			<div className="flex flex-col gap-2">
				<SwitchField
					checked={options.useAscii ?? false}
					label="Use ASCII characters"
					onChange={(v) => update({ useAscii: v })}
				/>
			</div>

			<Separator />

			<SectionTitle>Spacing</SectionTitle>
			<div className="flex flex-col gap-2">
				<NumberField
					label="Horizontal padding"
					onChange={(v) => update({ paddingX: v })}
					placeholder="5"
					value={options.paddingX}
				/>
				<NumberField
					label="Vertical padding"
					onChange={(v) => update({ paddingY: v })}
					placeholder="5"
					value={options.paddingY}
				/>
				<NumberField
					label="Box border padding"
					onChange={(v) => update({ boxBorderPadding: v })}
					placeholder="1"
					value={options.boxBorderPadding}
				/>
			</div>

			<Separator />

			<SectionTitle>Colors</SectionTitle>
			<div className="flex flex-col gap-2">
				<ColorField
					fallback={themeColors.fg}
					label="Text"
					onChange={(v) => update({ fg: v })}
					value={options.fg}
				/>
				<ColorField
					fallback={themeColors.fg}
					label="Border"
					onChange={(v) => update({ border: v })}
					value={options.border}
				/>
				<ColorField
					fallback={themeColors.line ?? themeColors.fg}
					label="Line"
					onChange={(v) => update({ line: v })}
					value={options.line}
				/>
				<ColorField
					fallback={themeColors.accent ?? themeColors.fg}
					label="Arrow"
					onChange={(v) => update({ arrow: v })}
					value={options.arrow}
				/>
				<ColorField
					fallback={themeColors.accent ?? themeColors.fg}
					label="Accent"
					onChange={(v) => update({ accent: v })}
					value={options.accent}
				/>
				<ColorField
					fallback={themeColors.bg}
					label="Background"
					onChange={(v) => update({ bg: v })}
					value={options.bg}
				/>
				<ColorField
					fallback={themeColors.line ?? themeColors.fg}
					label="Corner"
					onChange={(v) => update({ corner: v })}
					value={options.corner}
				/>
				<ColorField
					fallback={themeColors.fg}
					label="Junction"
					onChange={(v) => update({ junction: v })}
					value={options.junction}
				/>
			</div>
		</div>
	);
}

export function toSvgRenderOptions(
	customizations: SvgCustomizations,
): Partial<RenderOptions> {
	const opts: Partial<RenderOptions> = {};
	if (customizations.font) opts.font = customizations.font;
	if (customizations.padding !== undefined)
		opts.padding = customizations.padding;
	if (customizations.nodeSpacing !== undefined)
		opts.nodeSpacing = customizations.nodeSpacing;
	if (customizations.layerSpacing !== undefined)
		opts.layerSpacing = customizations.layerSpacing;
	if (customizations.componentSpacing !== undefined)
		opts.componentSpacing = customizations.componentSpacing;
	if (customizations.transparent) opts.transparent = customizations.transparent;
	if (customizations.interactive) opts.interactive = customizations.interactive;
	if (customizations.bg) opts.bg = customizations.bg;
	if (customizations.fg) opts.fg = customizations.fg;
	if (customizations.line) opts.line = customizations.line;
	if (customizations.accent) opts.accent = customizations.accent;
	if (customizations.muted) opts.muted = customizations.muted;
	if (customizations.surface) opts.surface = customizations.surface;
	if (customizations.border) opts.border = customizations.border;
	return opts;
}

export function toAsciiRenderOptions(
	customizations: AsciiCustomizations,
): Partial<AsciiRenderOptions> {
	const opts: Partial<AsciiRenderOptions> = {};
	if (customizations.useAscii) opts.useAscii = customizations.useAscii;
	if (customizations.paddingX !== undefined)
		opts.paddingX = customizations.paddingX;
	if (customizations.paddingY !== undefined)
		opts.paddingY = customizations.paddingY;
	if (customizations.boxBorderPadding !== undefined)
		opts.boxBorderPadding = customizations.boxBorderPadding;

	const theme: Record<string, string> = {};
	if (customizations.fg) theme.fg = customizations.fg;
	if (customizations.border) theme.border = customizations.border;
	if (customizations.line) theme.line = customizations.line;
	if (customizations.arrow) theme.arrow = customizations.arrow;
	if (customizations.accent) theme.accent = customizations.accent;
	if (customizations.bg) theme.bg = customizations.bg;
	if (customizations.corner) theme.corner = customizations.corner;
	if (customizations.junction) theme.junction = customizations.junction;
	if (Object.keys(theme).length > 0) opts.theme = theme;

	return opts;
}
