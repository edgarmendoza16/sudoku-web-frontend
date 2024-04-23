import {$, component$, useOnDocument, useStore} from "@builder.io/qwik";
import {Cell} from "./cell";
import styles from "./sudoku.module.css";
import {Sudoku} from "~/libs/sudoku";

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

export const SudokuLayout = component$<SudokuProps>((props) => {
  const board = useStore<number[][]>(props.rows)
  const duplicates = useStore<{cells: Cell[]}>({cells: []})
  const selectedCell = useStore<Cell>({
    row: -1,
    column: -1,
  });

  useOnDocument("keypress", $((event) => {
    if (selectedCell.row >= 0) {
      const key = parseInt(event.key)
      if (!isNaN(key)) {
        if (Sudoku.isValidNumber(board, selectedCell.row, selectedCell.column, key)) {
          board[selectedCell.row][selectedCell.column] = key
          duplicates.cells = []
        } else {
          duplicates.cells = Sudoku.getDuplicateNumberCoordinates(board, selectedCell.row, selectedCell.column, key)
        }
      }
    }
  }))

  const size = (props.cellSize * 9) + (props.blockBorderWidth * 3 - 10) + (props.cellBorderWidth * 9);

  const topBorderIndexes = [0, 3, 6];
  const leftBorderIndexes = [0, 3, 6];
  const rightBorderIndexes = [2, 5, 8];
  const bottomBorderIndexes = [2, 5, 8];

  return (
    <div
      class={styles.sudoku}
      style={{width: size, height: size}}
    >
      {board.map((row, y) => {
        return row.map((value, x) => {
          let isSelected = false
          let highlightNumber = false
          let highlightBackground = false
          let highlightError = false

          if (selectedCell.row >= 0) {
            const selectedValue = board[selectedCell.row][selectedCell.column]
            const currentValue = board[y][x]
            if (selectedValue === currentValue) {
              highlightNumber = true
            }

            if (selectedCell.column === x && (selectedCell.row > y || selectedCell.row < y)) {
              highlightBackground = true
            }

            if (selectedCell.row === y && (selectedCell.column > x || selectedCell.column < x)) {
              highlightBackground = true
            }

            isSelected = selectedCell.row === y && selectedCell.column === x
          }

          if (duplicates.cells.length > 0) {
            for (const cell of duplicates.cells) {
              if (cell.row === y && cell.column === x) {
                highlightError = true
              }
            }
          }

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
            onSelect$={(props) => {
              selectedCell.row = props.y
              selectedCell.column = props.x
            }}
            highlightBackground={highlightBackground}
            highlightNumber={highlightNumber}
            highlightAsError={highlightError}
            isSelected={isSelected}
          />
        })
      })}
    </div>
  );
});
