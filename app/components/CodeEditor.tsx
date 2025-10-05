import { useEffect, useRef, useState, useCallback } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';

type CodeEditorProps = {
  code: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
  readOnly?: boolean;
  className?: string;
};

// Copy to clipboard utility
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
};

// Default editor options
const EDITOR_OPTIONS = {
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  fontSize: 14,
  lineHeight: 20,
  wordWrap: 'on' as const,
  automaticLayout: true,
  fontFamily: 'Fira Code, monospace',
  lineNumbers: 'on' as const,
  renderLineHighlight: 'all' as const,
  padding: { top: 16, bottom: 16 },
  scrollBeyondLastColumn: 5,
  renderWhitespace: 'none' as const,
  folding: true,
  glyphMargin: false,
  cursorStyle: 'line' as const,
};

export function CodeEditor({
  code,
  language = 'typescript',
  onChange,
  readOnly = false,
  className = '',
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const monaco = useMonaco();
  const [isHovered, setIsHovered] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  // Set dark theme on mount
  useEffect(() => {
    if (!monaco) return;
    monaco.editor.setTheme('vs-dark');
  }, [monaco]);

  // Auto-resize editor height based on content
  const handleEditorDidMount = useCallback((editor: any) => {
    if (!monaco) return;
    
    editorRef.current = editor;
    let resizeObserver: ResizeObserver | null = null;

    const resizeEditor = () => {
      try {
        const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight);
        const lineCount = editor.getModel()?.getLineCount() || 1;
        const contentHeight = Math.max(lineCount * lineHeight + 32, 40); // min height of 40px
        const container = editor.getContainerDomNode();
        container.style.height = `${contentHeight}px`;
        editor.layout({ width: container.offsetWidth, height: contentHeight });
      } catch (error) {
        console.error('Error resizing editor:', error);
      }
    };

    // Initial resize
    const timeoutId = setTimeout(resizeEditor, 100);
    
    // Handle container resize
    const container = editor.getContainerDomNode()?.parentElement;
    if (container) {
      resizeObserver = new ResizeObserver(() => {
        editor.layout();
      });
      resizeObserver.observe(container);
    }

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      const disposable = editor.onDidChangeModelContent?.(resizeEditor);
      if (disposable) {
        disposable.dispose();
      }
    };
  }, [monaco]);

  // Copy to clipboard
  const handleCopy = useCallback(async () => {
    await copyToClipboard(code);
    setShowCopied(true);
    const timer = setTimeout(() => setShowCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [code]);

  return (
    <div
      className={`relative w-full rounded-lg overflow-hidden border border-gray-700 bg-[#1E1E1E] ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={handleCopy}
        className={`absolute right-2 top-2 z-10 p-2 rounded-md bg-gray-800/80 text-gray-300 hover:bg-gray-700/90 transition-opacity ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        title={showCopied ? 'Copied!' : 'Copy to clipboard'}
        aria-label={showCopied ? 'Copied!' : 'Copy to clipboard'}
      >
        {showCopied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </button>

      <div className="w-full min-h-[40px] rounded-lg overflow-hidden bg-[#1E1E1E] border border-[#303030] text-sm">
        <Editor
          height="100%"
          width="100%"
          language={language}
          value={code}
          onChange={onChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            ...EDITOR_OPTIONS,
            readOnly,
            autoIndent: 'full',
            formatOnPaste: true,
            formatOnType: true,
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            lineNumbers: 'off',
            renderLineHighlight: 'none',
            overviewRulerLanes: 0,
            hideCursorInOverviewRuler: true,
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'hidden',
              alwaysConsumeMouseWheel: false
            },
            glyphMargin: false,
            folding: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0,
            matchBrackets: 'never',
            renderWhitespace: 'none',
            wordWrap: 'on',
            wrappingIndent: 'indent',
            wordWrapColumn: 80,
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            autoSurround: 'languageDefined',
            fontFamily: 'Fira Code, monospace',
            fontSize: 14,
            lineHeight: 20,
            padding: {
              top: 16,
              bottom: 16
            },
            // @ts-ignore - This is a valid Monaco option
            'bracketPairColorization.enabled': false,
          }}
          className="[&>.monaco-editor-background]:!bg-[#1E1E1E] [&>.monaco-editor>.margin]:!bg-[#1E1E1E]"
        />
      </div>
    </div>
  );
}

export default CodeEditor;
