export type Line =
  | { kind: "text"; value: string; dim?: boolean }
  | { kind: "error"; value: string }
  | { kind: "ok"; value: string }
  | { kind: "rule" }
  | { kind: "title"; value: string }
  | { kind: "kv"; key: string; value: string }
  | { kind: "json"; key: string; value: string | string[]; last?: boolean }
  | { kind: "brace"; value: "{" | "}" }
  | { kind: "link"; label: string; href: string; external?: boolean }
  | { kind: "chips"; values: string[] }
  /** Large result line — used by `1sa` for the spelled-out number. */
  | { kind: "result"; value: string; caption?: string };

export type Entry = {
  id: number;
  input: string | null;
  lines: Line[];
};

export type ConsoleCtx = {
  locale: string;
  pathname: string;
  theme: string | undefined;
  /** Root translator — accepts full dotted paths. */
  t: (key: string) => string;
  push: (lines: Line[]) => void;
  clear: () => void;
  close: () => void;
  navigate: (href: string) => void;
  setTheme: (t: string) => void;
  /** Fire a window event (used to trigger the workflow scenario). */
  emit: (event: string) => void;
  /** Open the contact sheet. */
  hire: () => void;
};

export type Command = {
  name: string;
  /** Alternative spellings resolved to this command. */
  aliases?: string[];
  args?: string;
  summary: string;
  hidden?: boolean;
  run: (ctx: ConsoleCtx, args: string[]) => Line[] | void;
};
