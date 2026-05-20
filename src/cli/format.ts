const ESC = "\x1b[";

export const c = {
  reset: `${ESC}0m`,
  bold: `${ESC}1m`,
  dim: `${ESC}2m`,
  italic: `${ESC}3m`,
  cyan: `${ESC}36m`,
  green: `${ESC}32m`,
  yellow: `${ESC}33m`,
  red: `${ESC}31m`,
  magenta: `${ESC}35m`,
  gray: `${ESC}90m`,
  white: `${ESC}37m`,
  bgCyan: `${ESC}46m`,
  bgRed: `${ESC}41m`,
} as const;

export function styled(text: string, ...codes: string[]): string {
  return `${codes.join("")}${text}${c.reset}`;
}

export function truncate(text: string, max = 200): string {
  const oneLine = text.replace(/\n/g, "\\n");
  if (oneLine.length <= max) return oneLine;
  return `${oneLine.slice(0, max)}…`;
}
