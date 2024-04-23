export class Sudoku {
  public static generate() {
    const sudoku = Array.from({length: 9}, () => Array.from({length: 9}, () => 0));
    this.isSolvable(sudoku);
    return sudoku;
  }

  private static isSolvable(sudoku: number[][]) {
    const nextEmpty = Sudoku.findEmptyCell(sudoku);
    const row = nextEmpty[0];
    const col = nextEmpty[1];

    if (row === -1) {
      return true;
    }

    for (let num = 1; num <= 9; num++) {
      if (Sudoku.isValidNumber(sudoku, row, col, num)) {
        sudoku[row][col] = num;

        if (Sudoku.isSolvable(sudoku)) {
          return true;
        }

        sudoku[row][col] = 0;
      }
    }

    return false;
  }

  public static isValidNumber(sudoku: number[][], row: number, col: number, num: number) {
    for (let i = 0; i < 9; i++) {
      if (sudoku[row][i] === num) {
        return false;
      }
    }

    for (let i = 0; i < 9; i++) {
      if (sudoku[i][col] === num) {
        return false;
      }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (sudoku[i][j] === num) {
          return false;
        }
      }
    }

    return true;
  }

  public static getDuplicateNumberCoordinates(sudoku: number[][], row: number, col: number, num: number): {row: number, column: number}[] {
    const cells:{row: number, column: number}[]=[]
    for (let i = 0; i < 9; i++) {
      if (sudoku[row][i] === num) {
        cells.push({row, column: i})
      }
    }

    for (let i = 0; i < 9; i++) {
      if (sudoku[i][col] === num) {
        cells.push({row: i, column: col})
      }
    }

    const startRow = Math.floor(row / 3) * 3;
    const startCol = Math.floor(col / 3) * 3;
    for (let i = startRow; i < startRow + 3; i++) {
      for (let j = startCol; j < startCol + 3; j++) {
        if (sudoku[i][j] === num) {
          cells.push({row: i, column: j})
        }
      }
    }

    return cells
  }

  private static findEmptyCell(sudoku: number[][]) {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (sudoku[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return [-1, -1];
  }

  public static removeNumbers(sudoku: number[][], level: string): number[][] {
    const cells = sudoku.map((row) => row.map((column) => column))

    const numToRemove = {
      'facil': 1,
      'medio': 45,
      'dificil': 50,
      'experto': 55,
      'maestro': 60,
      'extremo': 65
    }[level.toLowerCase()];

    if (!numToRemove) {
      return cells
    }

    let cellsToRemove = [];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        cellsToRemove.push([row, col]);
      }
    }

    cellsToRemove = Sudoku.shuffle(cellsToRemove);

    for (let i = 0; i < numToRemove; i++) {
      const cell = cellsToRemove[i];
      cells[cell[0]][cell[1]] = 0
    }

    return cells
  }

  private static shuffle(array: number[][]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
