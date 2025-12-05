import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';
import { vscodeDark } from '@uiw/codemirror-theme-vscode'; // Import Dark Theme

export default function JsonEditor({ value, onChange, readOnly = false, isDark }) {
  return (
    <div className={`text-sm h-full border rounded overflow-hidden ${isDark ? 'border-slate-700' : 'border-gray-300'}`}>
      <CodeMirror
        value={value}
        height="100%"
        extensions={[json()]}
        onChange={(val) => {
            if (!readOnly && onChange) onChange(val);
        }}
        readOnly={readOnly}
        editable={!readOnly}
        // Switch theme based on isDark prop
        theme={isDark ? vscodeDark : 'light'} 
        basicSetup={{
            lineNumbers: true,
            foldGutter: true,
            highlightActiveLine: !readOnly,
        }}
      />
    </div>
  );
}