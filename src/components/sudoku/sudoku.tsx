import {component$, useStore} from "@builder.io/qwik";
import {Cell} from "./cell";
import styles from "./sudoku.module.css";

interface SudokuProps {
  rows: number[][]
  cellSize: number
  blockBorderWidth: number
  cellBorderWidth: number
}

interface Cell {
  row: number
  column: number
}

export const Sudoku = component$<SudokuProps>((props) => {
  const selectedCell = useStore<Cell>({
    row: -1,
    column: -1,
  });
    
  const size = (props.cellSize * 9) + (props.blockBorderWidth * 3 - 10) + (props.cellBorderWidth * 9);

  const topBorderIndexes = [0, 3, 6];
  const leftBorderIndexes = [0, 3, 6];
  const rightBorderIndexes = [2, 5, 8];
  const bottomBorderIndexes = [2, 5, 8];

  return (
    <div class={styles.sudoku} style={{width: size, height: size}}>
      {props.rows.map((row, y) => {
        return row.map((value, x) => {
          return <Cell
            key={`y-${y}-x-${x}`}
            x={x}
            y={y}
            value={value}
            size={props.cellSize}
            borderTopWidth={topBorderIndexes.includes(y) ? props.blockBorderWidth : props.cellBorderWidth}
            borderLeftWidth={leftBorderIndexes.includes(x) ? props.blockBorderWidth : props.cellBorderWidth}
            borderRightWidth={rightBorderIndexes.includes(x) ? props.blockBorderWidth : props.cellBorderWidth}
            borderBottomWidth={bottomBorderIndexes.includes(y) ? props.blockBorderWidth : props.cellBorderWidth}
          />
        })
      })}
    </div>
  );
});
