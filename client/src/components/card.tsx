import type { Component } from "solid-js";

export const Card: Component<{
  value?: number;
  selected?: boolean;
  size?: 1 | 2;
  onClick?: () => void;
}> = (props) => {
  return (
    <button
      onClick={() => props.onClick?.()}
      classList={{
        "flex items-center justify-center rounded-lg font-semibold": true,
        "delay-75 transition-colors": true,
        "h-10 w-8 text-sm": props.size === 1,
        "h-16 w-12 text-md": props.size === 2,
        "bg-black/40 hover:bg-black/50": !props.selected,
        "bg-indigo-300/20 hover:bg-indigo-300/30": props.selected,
      }}
    >
      {props.value > 0 ? props.value : ""}
    </button>
  );
};
