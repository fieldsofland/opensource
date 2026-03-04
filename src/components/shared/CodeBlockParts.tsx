import { useState, useSyncExternalStore } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { Copy, Check } from "lucide-react";

function useIsDark() {
  return useSyncExternalStore(
    (cb) => {
      const observer = new MutationObserver(cb);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      return () => observer.disconnect();
    },
    () => document.documentElement.getAttribute('data-theme') !== 'light',
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button className="code-copy" onClick={copy} type="button" data-copied={copied || undefined}>
      <span className="code-copied-label">Copied</span>
      <span className="code-copy-icon-box">
        <span className="copy-icon copy-icon-default"><Copy size={14} /></span>
        <span className="copy-icon copy-icon-check"><Check size={14} /></span>
      </span>
    </button>
  );
}

export function Block({
  title,
  code,
  language,
}: {
  title: string;
  code: string;
  language: string;
}) {
  const isDark = useIsDark();

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-lang">{title}</span>
        <CopyButton text={code} />
      </div>
      <Highlight theme={isDark ? themes.nightOwl : themes.github} code={code} language={language}>
        {({ tokens, getLineProps, getTokenProps }) => (
          <pre className="code-pre">
            <code>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </div>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}

export function InstallButton({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  const copyInstall = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button className="install-btn" onClick={copyInstall} type="button" data-copied={copied || undefined}>
      <code>{command}</code>
      <span className="install-copy-wrap">
        <span className="install-copied-label">Copied</span>
        <span className="install-copy-icon-box">
          <span className="copy-icon copy-icon-default"><Copy size={16} /></span>
          <span className="copy-icon copy-icon-check"><Check size={16} /></span>
        </span>
      </span>
    </button>
  );
}
