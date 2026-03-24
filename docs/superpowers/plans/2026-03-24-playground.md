# Beautiful Mermaid Playground Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page playground where users write Mermaid code in Monaco editor and see live SVG/ASCII previews.

**Architecture:** Next.js 15 App Router, single client page composing Navbar + split editor/preview. State lives in page.tsx. Rendering uses synchronous `renderMermaidSVG` and `renderMermaidASCII` from `beautiful-mermaid`. Theme via `next-themes`.

**Tech Stack:** Next.js 15, React 19, Tailwind CSS v4, shadcn (radix-nova), next-themes, @monaco-editor/react, beautiful-mermaid, hugeicons

---

## File Structure

```
src/
  app/
    layout.tsx          — MODIFY: add ThemeProvider, update metadata
    page.tsx            — REWRITE: playground page (client component, owns state)
  components/
    navbar.tsx          — CREATE: top navbar with title, theme toggle, github link
    mermaid-editor.tsx  — CREATE: Monaco editor wrapper
    mermaid-preview.tsx — CREATE: SVG/ASCII preview with toolbar
    theme-provider.tsx  — CREATE: next-themes ThemeProvider wrapper (client component)
    ui/
      button.tsx        — CREATE via shadcn CLI
      toggle-group.tsx  — CREATE via shadcn CLI
      tooltip.tsx       — CREATE via shadcn CLI
  hooks/
    use-debounce.ts     — CREATE: debounce hook for editor input
```

---

### Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install next-themes and @monaco-editor/react**

```bash
bun add next-themes @monaco-editor/react
```

- [ ] **Step 2: Add shadcn components**

```bash
bunx shadcn@latest add button toggle-group tooltip
```

- [ ] **Step 3: Verify installs**

```bash
bun run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add package.json bun.lock src/components/ui/
git commit -m "chore: add next-themes, monaco-editor, shadcn button/toggle-group/tooltip"
```

---

### Task 2: Set up theme provider and update layout

**Files:**
- Create: `src/components/theme-provider.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create theme-provider.tsx**

A thin client-component wrapper around `next-themes` `ThemeProvider`:

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

- [ ] **Step 2: Update layout.tsx**

- Import `ThemeProvider`
- Wrap `{children}` with `<ThemeProvider attribute="class" defaultTheme="system" enableSystem>`
- Update metadata title to "Beautiful Mermaid Playground" and description
- Add `suppressHydrationWarning` to `<html>` (required by next-themes)

- [ ] **Step 3: Verify**

```bash
bun run typecheck
```

- [ ] **Step 4: Commit**

```bash
git add src/components/theme-provider.tsx src/app/layout.tsx
git commit -m "feat: add theme provider with dark/light/system support"
```

---

### Task 3: Create Navbar component

**Files:**
- Create: `src/components/navbar.tsx`

- [ ] **Step 1: Create navbar.tsx**

Client component with:
- Left: "Beautiful Mermaid Playground" title text
- Right: theme toggle button (cycles dark/light/system using `useTheme` from next-themes), GitHub icon link
- Use shadcn `button` (variant="ghost", size="icon") for the icon buttons
- Use hugeicons for Sun/Moon/Github icons (`@hugeicons/core-free-icons` + `@hugeicons/react`)
- Fixed height navbar with border-bottom

- [ ] **Step 2: Verify**

```bash
bun run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add src/components/navbar.tsx
git commit -m "feat: add navbar with title, theme toggle, and GitHub link"
```

---

### Task 4: Create useDebounce hook

**Files:**
- Create: `src/hooks/use-debounce.ts`

- [ ] **Step 1: Create use-debounce.ts**

Simple debounce hook that returns debounced value. Also accepts a `flush` mechanism — when `immediate` flag is true, bypass debounce and update instantly.

```ts
import { useEffect, useRef, useState } from "react";

export function useDebouncedValue<T>(value: T, delay: number, immediate?: boolean): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (immediate) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setDebouncedValue(value);
      return;
    }
    timeoutRef.current = setTimeout(() => setDebouncedValue(value), delay);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [value, delay, immediate]);

  return debouncedValue;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/use-debounce.ts
git commit -m "feat: add useDebouncedValue hook with immediate flush support"
```

---

### Task 5: Create MermaidEditor component

**Files:**
- Create: `src/components/mermaid-editor.tsx`

- [ ] **Step 1: Create mermaid-editor.tsx**

Client component wrapping `@monaco-editor/react`:
- Props: `value: string`, `onChange: (value: string) => void`, `onPaste: () => void`
- Uses `useTheme()` to switch Monaco theme between `vs-dark` and `light`
- Registers `onDidPaste` via `onMount` editor ref to call `onPaste`
- Default language: `mermaid` (Monaco has basic mermaid support), fallback `plaintext`
- Options: `minimap: { enabled: false }`, `fontSize: 14`, `lineNumbers: 'on'`, `wordWrap: 'on'`, `scrollBeyondLastLine: false`, `automaticLayout: true`

- [ ] **Step 2: Verify**

```bash
bun run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add src/components/mermaid-editor.tsx
git commit -m "feat: add Monaco-based mermaid editor component"
```

---

### Task 6: Create MermaidPreview component

**Files:**
- Create: `src/components/mermaid-preview.tsx`

- [ ] **Step 1: Create mermaid-preview.tsx**

Client component with:
- Props: `svgOutput: string`, `asciiOutput: string`, `rawAsciiOutput: string`, `mode: "svg" | "ascii"`, `onModeChange: (mode) => void`, `error: string | null`
- Top toolbar row:
  - shadcn `ToggleGroup` (type="single") with "SVG" and "ASCII" items
  - Copy button (shadcn `Button` ghost+icon with `Tooltip`) — copies raw SVG string (in SVG mode) or `rawAsciiOutput` plain text (in ASCII mode) to clipboard
  - Download button (only visible in SVG mode) — creates Blob and downloads `.svg`
- Content area:
  - SVG mode: `<div dangerouslySetInnerHTML={{ __html: svgOutput }} />` in a scrollable container
  - ASCII mode: `<pre dangerouslySetInnerHTML={{ __html: asciiOutput }} />` (HTML-colored) in a scrollable container
  - Error: red text message
- Use hugeicons for Copy/Download icons

- [ ] **Step 2: Verify**

```bash
bun run typecheck
```

- [ ] **Step 3: Commit**

```bash
git add src/components/mermaid-preview.tsx
git commit -m "feat: add mermaid preview component with SVG/ASCII toggle, copy, download"
```

---

### Task 7: Wire up page.tsx

**Files:**
- Rewrite: `src/app/page.tsx`

- [ ] **Step 1: Rewrite page.tsx**

Client component that:
- State: `mermaidText` (string, default example), `previewMode` ("svg" | "ascii"), `immediateRender` (boolean flag for paste bypass), `error` (string | null)
- Uses `useDebouncedValue(mermaidText, 300, immediateRender)` — when paste detected, set `immediateRender=true` then reset it
- `useMemo` to compute `svgOutput` from debounced text via `renderMermaidSVG(text, { bg: 'var(--background)', fg: 'var(--foreground)', transparent: true })`
- `useMemo` to compute `asciiOutput` from debounced text via `renderMermaidASCII(text, { colorMode: 'html' })`
- `useMemo` to compute `rawAsciiOutput` from debounced text via `renderMermaidASCII(text, { colorMode: 'none' })` (plain text for clipboard copy)
- Wrap renders in try/catch, set error state on failure
- Layout: flex column full height, Navbar on top, then flex row with MermaidEditor (50%) and MermaidPreview (50%)

Default mermaid text:
```
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[End]
    C --> D
```

- [ ] **Step 2: Verify build**

```bash
bun run typecheck && bun run build
```

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire up playground page with live debounced mermaid rendering"
```

---

### Task 8: Visual QA and polish

- [ ] **Step 1: Run dev server and verify**

```bash
bun run dev
```

Check:
- Editor loads with default example, preview shows SVG
- Typing updates preview after 300ms debounce
- Pasting updates immediately
- Toggle between SVG and ASCII works
- Copy button copies raw text to clipboard
- Download button downloads .svg file
- Theme toggle cycles dark/light/system correctly
- Monaco editor theme matches app theme
- Layout fills viewport, no scrollbar issues

- [ ] **Step 2: Fix any issues found**

- [ ] **Step 3: Run linter**

```bash
bun run check:write
```

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "fix: visual polish and lint fixes"
```
