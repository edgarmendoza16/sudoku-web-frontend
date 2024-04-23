import {$, component$, useOnDocument, useStore} from "@builder.io/qwik";
import {Cell as Coordinate} from "./cell";
import styles from "./sudoku.module.css";
import {Sudoku} from "~/libs/sudoku";

interface SudokuProps {
  level: string
  checkErrors: boolean
  cellSize: number
  blockBorderWidth: number
  cellBorderWidth: number
}

interface Coordinate {
  row: number
  column: number
}

interface SudokuStore {
  correct: number[][], initial: number[][], cells: number[][]
}

function generateSudokuStore(level: string): SudokuStore {
  const correctCells = Sudoku.generate()
  const initialCells = Sudoku.removeNumbers(correctCells, level)
  const cells = initialCells.map((row)=>row.map((column) => column))

  return {
    correct: correctCells,
    initial: initialCells,
    cells,
  }
}

export const SudokuLayout = component$<SudokuProps>((props) => {
  const sudokuStore = useStore<SudokuStore>(generateSudokuStore(props.level))
  const duplicates = useStore<{cells: Coordinate[]}>({cells: []})
  const wrongCells = useStore<{cells: Coordinate[]}>({cells: []})
  const selectedCell = useStore<Coordinate>({
    row: -1,
    column: -1,
  });

  useOnDocument("keypress", $((event) => {
    if (selectedCell.row >= 0) {
      const key = parseInt(event.key)
      if (!isNaN(key)) {
        if (sudokuStore.initial[selectedCell.row][selectedCell.column] !== 0) {
          return
        }

        if (Sudoku.isValidNumber(sudokuStore.cells, selectedCell.row, selectedCell.column, key)) {
          if (props.checkErrors) {
            if (sudokuStore.correct[selectedCell.row][selectedCell.column] !== key) {
              wrongCells.cells.push({row: selectedCell.row, column: selectedCell.column})
            } else {
              wrongCells.cells = wrongCells.cells.filter((coordinate) => {
                return selectedCell.row !== coordinate.row && selectedCell.column !== coordinate.column
              })
            }
          }

          sudokuStore.cells[selectedCell.row][selectedCell.column] = key
          duplicates.cells = []
        } else {
          duplicates.cells = Sudoku.getDuplicateNumberCoordinates(sudokuStore.cells, selectedCell.row, selectedCell.column, key)
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
      {sudokuStore.cells.map((row, y) => {
        return row.map((value, x) => {
          let isSelected = false
          let highlightNumber = false
          let highlightBackground = false
          let highlightError = false
          let highlightWrongCellError = false

          if (selectedCell.row >= 0) {
            const selectedValue = sudokuStore.cells[selectedCell.row][selectedCell.column]
            const currentValue = sudokuStore.cells[y][x]
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

          if (wrongCells.cells.length > 0) {
            for (const cell of wrongCells.cells) {
              if (cell.row === y && cell.column === x) {
                highlightWrongCellError = true
              }
            }
          }

          return <Coordinate
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
              duplicates.cells = []
              selectedCell.row = props.y
              selectedCell.column = props.x
            }}
            highlightBackground={highlightBackground}
            highlightNumber={highlightNumber}
            highlightAsError={highlightError}
            highlightAsWrongCellError={highlightWrongCellError}
            isSelected={isSelected}
          />
        })
      })}
    </div>
  );
});
