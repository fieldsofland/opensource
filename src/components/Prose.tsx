interface ProseProps {
  children: React.ReactNode;
}

export function Prose({ children }: ProseProps) {
  return <div className="prose">{children}</div>;
}
