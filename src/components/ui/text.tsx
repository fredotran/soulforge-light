import type { ReactNode } from "react";

interface TextProps {
  children?: ReactNode;
  color?: string;
  dimColor?: boolean;
  bold?: boolean;
  italic?: boolean;
  wrap?: "wrap" | "end" | "truncate";
  onPress?: () => void;
}

export function Text({ children, color, dimColor, bold, italic, wrap, onPress }: TextProps) {
  const props: Record<string, unknown> = {};
  if (color) props.color = color;
  if (dimColor) props.dimColor = true;
  if (bold) props.bold = true;
  if (italic) props.italic = true;
  if (wrap) props.wrap = wrap;
  if (onPress) props.onPress = onPress;
  // biome-ignore lint/suspicious/noExplicitAny: OpenTUI text props
  return <text {...(props as any)}>{children}</text>;
}
