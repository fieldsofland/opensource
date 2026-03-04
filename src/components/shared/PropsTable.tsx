interface PropRow {
  name: string;
  type: string;
  default?: string;
  description?: string;
}

interface PropGroup {
  heading: string;
  rows: PropRow[];
}

interface PropsTableProps {
  title?: string;
  groups: PropGroup[];
}

export function PropsTable({ title, groups }: PropsTableProps) {
  return (
    <div className="props-table">
      <style>{`
        .props-table {
          margin-top: 24px;
        }
        .props-table-title {
          font-size: 15px;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 20px;
        }
        .props-group {
          margin-bottom: 40px;
          display: grid;
          grid-template-columns: minmax(120px, 1fr) minmax(100px, 1.2fr) auto;
        }
        .props-group:last-child {
          margin-bottom: 0;
        }
        .props-group-heading {
          grid-column: 1 / -1;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: lowercase;
          color: var(--text-muted);
          padding: 8px 14px;
          margin-bottom: 0;
          position: relative;
        }
        .props-group-heading::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 14px;
          right: 14px;
          height: 1px;
          background: var(--border);
        }
        .props-row {
          grid-column: 1 / -1;
          position: relative;
          display: grid;
          grid-template-columns: subgrid;
          gap: 4px 12px;
          align-items: baseline;
          padding: 22px 14px;
          border-radius: 8px;
          font-size: 13px;
          line-height: 1.5;
          transition: background-color 150ms var(--ease-in-default);
        }
        .props-row::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 14px;
          right: 14px;
          height: 1px;
          background: var(--border);
          transition: opacity 150ms var(--ease-in-default);
        }
        .props-row:last-child::after {
          display: none;
        }
        .props-row:hover {
          padding: 22px 14px;
          background: var(--bg-hover);
        }
        .props-row:hover::after {
          opacity: 0;
        }
        .props-row:has(+ .props-row:hover)::after {
          opacity: 0;
        }
        .props-name {
          font-weight: 600;
          color: var(--text);
          font-family: "SF Mono", "Fira Code", "Cascadia Code", Menlo, monospace;
          font-size: 12px;
        }
        .props-description {
          grid-column: 1 / -1;
          font-weight: 400;
          color: var(--text-muted);
          font-size: 12px;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .props-type {
          font-family: "SF Mono", "Fira Code", "Cascadia Code", Menlo, monospace;
          font-size: 12px;
          color: var(--text-muted);
          background: var(--bg-hover);
          padding: 2px 6px;
          border-radius: 4px;
          border: 1px solid var(--border);
          width: fit-content;
          transition: background-color 150ms var(--ease-in-default),
                      border-color 150ms var(--ease-in-default);
        }
        .props-row:hover .props-type {
          background: var(--bg-hover);
          border-color: transparent;
        }
        .props-default {
          font-family: "SF Mono", "Fira Code", "Cascadia Code", Menlo, monospace;
          font-size: 12px;
          color: var(--text-muted);
          text-align: right;
        }
        .props-required {
          color: var(--text-secondary);
          font-style: italic;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 11px;
        }
        @media (max-width: 600px) {
          .props-group {
            grid-template-columns: 1fr;
          }
          .props-row {
            gap: 4px;
          }
          .props-default {
            text-align: left;
          }
        }
      `}</style>

      {title && <div className="props-table-title">{title}</div>}

      {groups.map((group) => (
        <div className="props-group" key={group.heading}>
          <div className="props-group-heading">{group.heading}</div>
          {group.rows.map((row) => (
            <div className="props-row" key={row.name}>
              <span className="props-name">{row.name}</span>
              <span className="props-type">{row.type}</span>
              <span className="props-default">
                {row.default ? (
                  row.default
                ) : (
                  <span className="props-required">required</span>
                )}
              </span>
              {row.description && (
                <span className="props-description">{row.description}</span>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
