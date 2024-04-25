import {Sudoku} from "~/libs/sudoku"

export interface SudokuStore {
  correct: number[][]
  initial: number[][]
  cells: number[][]
  missingCellsCount: number
}

export function generateSudokuStore(level: string): SudokuStore {
  const correctCells = Sudoku.generate()
  const initialCells = Sudoku.removeNumbers(correctCells, level)
  const cells = initialCells.map((row) => row.map((column) => column))

  let missingCellsCount = 0
  for (const row of initialCells) {
    for (const col of row) {
      if (col === 0) {
        missingCellsCount++
      }
    }
  }

  return {
    correct: correctCells,
    initial: initialCells,
    cells,
    missingCellsCount,
  }
}
