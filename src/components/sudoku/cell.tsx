import type {QRL} from "@builder.io/qwik";
import {component$} from "@builder.io/qwik";
import styles from "./cell.module.css";

interface CellInfo {
  value: number
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
  onSelect$: QRL<(info: CellInfo) => void>
}

export const Cell = component$<CellProps>((props) => {
  return (
    <div
      class={styles.cell}
      onClick$={() => props.onSelect$({value: props.value, x: props.x, y: props.y})}
      style={{
        width: props.size,
        height: props.size,
        borderTopWidth: props.borderTopWidth,
        borderLeftWidth: props.borderLeftWidth,
        borderRightWidth: props.borderRightWidth,
        borderBottomWidth: props.borderBottomWidth
      }}>
      <span>{props.value === 0 ? "" : props.value}</span>
    </div>
  );
});
