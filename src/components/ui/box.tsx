import type { ReactNode } from "react";

interface BoxProps {
  children?: ReactNode;
  flexDirection?: "row" | "column";
  flexGrow?: number;
  height?: number;
  width?: number;
  gap?: number;
  justifyContent?: "center" | "flex-start" | "flex-end" | "space-between";
  alignItems?: "center" | "flex-start" | "flex-end";
  padding?: number;
  paddingLeft?: number;
  paddingRight?: number;
  borderStyle?: "single" | "double" | "round" | "bold";
  borderColor?: string;
  onPress?: () => void;
}

export function Box({ children, ...props }: BoxProps) {
  // biome-ignore lint/suspicious/noExplicitAny: OpenTUI box props
  return <box {...(props as any)}>{children}</box>;
}
