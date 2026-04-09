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
    <div className="w-full rounded-xl overflow-hidden border border-gray-700 shadow-xl bg-[#0d1117] relative">
      <div className="flex bg-gray-800 text-gray-400 text-xs px-4 py-2 border-b border-gray-700 items-center justify-between">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span>index.js</span>
      </div>
      <div data-color-mode="dark">
        <CodeEditor
          value={code}
          language="js"
          placeholder="Please enter JS code."
          onChange={(ev) => handleUpdate(ev.target.value)}
          padding={15}
          style={{
            fontSize: 14,
            backgroundColor: "#0d1117",
            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
            minHeight: "200px"
          }}
        />
      </div>
    </div>
  );
}
