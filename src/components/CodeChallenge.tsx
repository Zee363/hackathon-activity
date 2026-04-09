"use client";

import dynamic from 'next/dynamic';
import { useState } from 'react';

// Require dynamic import to avoid SSR 'document is not defined' error
const CodeEditor = dynamic(
  () => import('@uiw/react-textarea-code-editor').then((mod) => mod.default),
  { ssr: false }
);

interface CodeChallengeProps {
  initialCode: string;
  onChange: (code: string) => void;
}

export default function CodeChallenge({ initialCode, onChange }: CodeChallengeProps) {
  const [code, setCode] = useState(initialCode);

  const handleUpdate = (val: string) => {
    setCode(val);
    onChange(val);
  };

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-white/5 relative backdrop-blur-xl">
      <div className="flex bg-white/5 text-white/55 text-xs px-4 py-3 border-b border-white/10 items-center justify-between">
        <div className="flex space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-white/10"></div>
        </div>
        <span className="font-mono">index.js</span>
      </div>
      <div data-color-mode="dark">
        <CodeEditor
          value={code}
          language="js"
          placeholder="Please enter JS code."
          onChange={(ev) => handleUpdate(ev.target.value)}
          padding={20}
          style={{
            fontSize: 14,
            backgroundColor: "transparent",
            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            minHeight: "240px",
            color: "#FFFFFF"
          }}
        />
      </div>
    </div>
  );
}
