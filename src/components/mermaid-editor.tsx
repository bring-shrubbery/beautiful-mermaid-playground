"use client";

import Editor from "@monaco-editor/react";
import type { OnMount } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface MermaidEditorProps {
  value: string;
  onChange: (value: string) => void;
  onPaste: () => void;
}

export function MermaidEditor({ value, onChange, onPaste }: MermaidEditorProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMount: OnMount = (editor) => {
    editor.onDidPaste(() => {
      onPaste();
    });
  };

  const monacoTheme = resolvedTheme === "dark" ? "vs-dark" : "light";

  if (!mounted) {
    return null;
  }

  return (
    <Editor
      height="100%"
      language="plaintext"
      theme={monacoTheme}
      value={value}
      onChange={(val) => onChange(val ?? "")}
      onMount={handleMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        wordWrap: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  );
}
