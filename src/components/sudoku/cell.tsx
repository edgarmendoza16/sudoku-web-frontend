import type {QRL} from "@builder.io/qwik";
import {component$} from "@builder.io/qwik";
import styles from "./cell.module.css";

interface CellInfo {
  x: number
  y: number
}

interface CellProps {
  borderTopWidth: number
  borderLeftWidth: number
  borderRightWidth: number
  borderBottomWidth: number
  value: number
  size: number
  x: number
  y: number
  highlightBackground: boolean
  highlightNumber: boolean
  isSelected: boolean
  highlightAsError: boolean
  onSelect$: QRL<(info: CellInfo) => void>
}

export const Cell = component$<CellProps>((props) => {
  const classList = [styles.cell]

  if (props.highlightBackground) {
    classList.push(styles["highlight-background"])
  }

  if (props.highlightNumber) {
    classList.push(styles["highlight-number"])
  }

  if (props.isSelected) {
    classList.push(styles["selected"])
  }

  if (props.highlightAsError) {
    classList.push(styles["highlight-error"])
  }

  return (
    <div
      class={classList}
      onClick$={() => props.onSelect$({x: props.x, y: props.y})}
      style={{
        width: props.size,
        height: props.size,
        borderTopWidth: props.borderTopWidth,
        borderLeftWidth: props.borderLeftWidth,
        borderRightWidth: props.borderRightWidth,
        borderBottomWidth: props.borderBottomWidth,
      }}>
      <span>{props.value === 0 ? "" : props.value}</span>
    </div>
  );
});
