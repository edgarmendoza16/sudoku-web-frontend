import {$, component$, useOnDocument, useSignal, useStore} from "@builder.io/qwik";
import {Cell} from "./cell/cell";
import styles from "./sudoku.module.css";
import {Sudoku} from "~/libs/sudoku";
import {GameStatus} from "./gameStatus";
import {LevelSelector} from "./options/levelSelector/levelSelector";
import {ErrorsLayout} from "./options/errors/errors";
import type {SudokuStore} from "./sudokustore";
import { generateSudokuStore} from "./sudokustore";
import type {Coordinate} from "./coordinate";

interface SudokuProps {
  cellSize: number
  blockBorderWidth: number
  cellBorderWidth: number
}

export const SudokuLayout = component$<SudokuProps>((props) => {
  const maxErrors = 3
  const checkErrors = useSignal<boolean>(true)
  const level = useSignal("facil")
  const gameStatus = useSignal<GameStatus>(GameStatus.PLAYING)
  const errorsCount = useSignal<number>(0)
  const sudokuStore = useStore<SudokuStore>(generateSudokuStore(level.value))
  const duplicates = useStore<{cells: Coordinate[]}>({cells: []})
  const wrongCells = useStore<{cells: Coordinate[]}>({cells: []})
  const selectedCell = useStore<Coordinate>({
    row: -1,
    column: -1,
  });

  useOnDocument("keydown", $((event) => {
    if (gameStatus.value !== GameStatus.PLAYING) {
      return
    }

    if (selectedCell.row >= 0) {
      if (event.key === "ArrowDown") {
        if (selectedCell.row < 8) {
          selectedCell.row += 1
        } else {
          selectedCell.row = 0
        }
      } else if (event.key === "ArrowUp") {
        if (selectedCell.row > 0) {
          selectedCell.row -= 1
        } else {
          selectedCell.row = 8
        }
      } else if (event.key === "ArrowLeft") {
        if (selectedCell.column > 0) {
          selectedCell.column -= 1
        } else {
          selectedCell.column = 8
        }
      } else if (event.key === "ArrowRight") {
        if (selectedCell.column < 8) {
          selectedCell.column += 1
        } else {
          selectedCell.column = 0
        }
      }

      if (event.key === 'Backspace') {
        if (sudokuStore.initial[selectedCell.row][selectedCell.column] === 0) {
          sudokuStore.cells[selectedCell.row][selectedCell.column] = 0
          sudokuStore.missingCellsCount++
          wrongCells.cells = wrongCells.cells.filter((coordinate) => {
            return !(selectedCell.row === coordinate.row && selectedCell.column === coordinate.column)
          })
        }
        return
      }

      const key = parseInt(event.key)
      if (!isNaN(key)) {
        if (sudokuStore.initial[selectedCell.row][selectedCell.column] !== 0) {
          return
        }

        if (Sudoku.isValidNumber(sudokuStore.cells, selectedCell.row, selectedCell.column, key)) {
          if (checkErrors.value) {
            if (sudokuStore.correct[selectedCell.row][selectedCell.column] !== key) {
              wrongCells.cells.push({row: selectedCell.row, column: selectedCell.column})
              errorsCount.value++
            } else {
              wrongCells.cells = wrongCells.cells.filter((coordinate) => {
                return !(selectedCell.row === coordinate.row && selectedCell.column === coordinate.column)
              })
            }
          }

          if (sudokuStore.cells[selectedCell.row][selectedCell.column] === 0) {
            sudokuStore.missingCellsCount--
          }
          sudokuStore.cells[selectedCell.row][selectedCell.column] = key
          duplicates.cells = []
        } else {
          duplicates.cells = Sudoku.getDuplicateNumberCoordinates(sudokuStore.cells, selectedCell.row, selectedCell.column, key)
          sudokuStore.cells[selectedCell.row][selectedCell.column] = key
          wrongCells.cells.push({row: selectedCell.row, column: selectedCell.column})
          errorsCount.value++
        }
      }
    }
  }))

  const reset = $((newGameLevel: string) => {
    level.value = newGameLevel
    errorsCount.value = 0
    gameStatus.value = GameStatus.PLAYING
    duplicates.cells = []
    wrongCells.cells = []
    selectedCell.row = -1
    selectedCell.column = -1
    const newSudoku = generateSudokuStore(level.value)
    sudokuStore.cells = newSudoku.cells
    sudokuStore.missingCellsCount = newSudoku.missingCellsCount
    sudokuStore.correct = newSudoku.correct
    sudokuStore.initial = newSudoku.initial
  })

  if (errorsCount.value === maxErrors) {
    gameStatus.value = GameStatus.LOST
  } else if (sudokuStore.missingCellsCount === 0) {
    gameStatus.value = GameStatus.WON
  }

  if (gameStatus.value === GameStatus.WON) {
    setTimeout(() => {
      alert("You won!")
    }, 100)
  } else if (gameStatus.value === GameStatus.LOST) {
    setTimeout(() => {
      alert("You lost!")
    }, 100)
  }

  const size = props.cellSize * 9

  const topBorderIndexes = [0, 3, 6];
  const leftBorderIndexes = [0, 3, 6];
  const rightBorderIndexes = [2, 5, 8];
  const bottomBorderIndexes = [2, 5, 8];

  return (
    <>
      <div class={styles.options} style={{width: size}}>
        <LevelSelector value={level.value} onSelect$={reset} />
        <ErrorsLayout count={errorsCount.value} max={maxErrors} />
      </div>
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
            const highlightWrongCellError = false
            let isInitialNumber = false

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

            if (sudokuStore.initial[y][x] !== 0) {
              isInitialNumber = true
            } else {
              if (duplicates.cells.length > 0) {
                for (const cell of duplicates.cells) {
                  if (cell.row === y && cell.column === x) {
                    highlightError = true
                  }
                }
              }

              if (!highlightError || wrongCells.cells.length > 0) {
                for (const cell of wrongCells.cells) {
                  if (cell.row === y && cell.column === x) {
                    highlightError = true
                  }
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
                if (gameStatus.value !== GameStatus.PLAYING) {
                  return
                }

                duplicates.cells = []
                selectedCell.row = props.y
                selectedCell.column = props.x
              }}
              highlightBackground={highlightBackground}
              highlightNumber={highlightNumber}
              highlightAsError={highlightError}
              isInitial={isInitialNumber}
              isSelected={isSelected}
            />
          })
        })}
      </div>
    </>
  );
});
