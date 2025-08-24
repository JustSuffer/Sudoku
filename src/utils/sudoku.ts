import { SudokuBoard, SudokuCell, Difficulty } from '@/types/game';

// Generate empty 9x9 Sudoku board
export const createEmptyBoard = (): SudokuBoard => {
  return Array(9).fill(null).map(() =>
    Array(9).fill(null).map(() => ({
        value: 0,
        isFixed: false,
        isSelected: false,
        isError: false,
        hints: [],
        isHighlighted: false,
    }))
  );
};

// Check if a number is valid in the given position
export const isValidMove = (board: SudokuBoard, row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (x !== col && board[row][x].value === num) {
      return false;
    }
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (x !== row && board[x][col].value === num) {
      return false;
    }
  }

  // Check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const currentRow = startRow + i;
      const currentCol = startCol + j;
      if (currentRow !== row && currentCol !== col && board[currentRow][currentCol].value === num) {
        return false;
      }
    }
  }

  return true;
};

// Solve Sudoku using backtracking
const solveSudoku = (board: number[][]): boolean => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0) {
        for (let num = 1; num <= 9; num++) {
          if (isValidNumber(board, i, j, num)) {
            board[i][j] = num;
            if (solveSudoku(board)) {
              return true;
            }
            board[i][j] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
};

const isValidNumber = (board: number[][], row: number, col: number, num: number): boolean => {
  // Check row
  for (let x = 0; x < 9; x++) {
    if (board[row][x] === num) return false;
  }

  // Check column
  for (let x = 0; x < 9; x++) {
    if (board[x][col] === num) return false;
  }

  // Check 3x3 box
  const startRow = row - (row % 3);
  const startCol = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[startRow + i][startCol + j] === num) return false;
    }
  }

  return true;
};

// Generate a complete Sudoku board
export const generateCompleteBoard = (): number[][] => {
  const board = Array(9).fill(null).map(() => Array(9).fill(0));
  
  // Fill diagonal 3x3 boxes first
  for (let i = 0; i < 9; i += 3) {
    fillBox(board, i, i);
  }
  
  // Fill remaining cells
  solveSudoku(board);
  
  return board;
};

const fillBox = (board: number[][], row: number, col: number): void => {
  const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  // Shuffle array
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }

  let idx = 0;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      board[row + i][col + j] = nums[idx++];
    }
  }
};

// Remove numbers from complete board based on difficulty
export const generatePuzzle = (difficulty: Difficulty): SudokuBoard => {
  const completeBoard = generateCompleteBoard();
  const board = createEmptyBoard();

  // Copy complete board to our structure
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      board[i][j].value = completeBoard[i][j];
      board[i][j].isFixed = true;
    }
  }

  // Remove numbers based on difficulty
  const cellsToRemove = getDifficultySettings(difficulty).cellsToRemove;
  const positions = [];
  
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      positions.push([i, j]);
    }
  }

  // Shuffle positions
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  // Remove cells
  for (let i = 0; i < cellsToRemove && i < positions.length; i++) {
    const [row, col] = positions[i];
    board[row][col].value = 0;
    board[row][col].isFixed = false;
  }

  return board;
};

const getDifficultySettings = (difficulty: Difficulty) => {
  switch (difficulty) {
    case 'easy':
      return { cellsToRemove: 35 };
    case 'medium':
      return { cellsToRemove: 45 };
    case 'hard':
      return { cellsToRemove: 55 };
    case 'expert':
      return { cellsToRemove: 65 };
    default:
      return { cellsToRemove: 35 };
  }
};

// Check if board is complete and valid
export const isBoardComplete = (board: SudokuBoard): boolean => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j].value === 0) {
        return false;
      }
    }
  }
  return true;
};

// Check for errors on the board
export const checkForErrors = (board: SudokuBoard): void => {
  // Reset all error states
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      board[i][j].isError = false;
    }
  }

  // Check for duplicates and mark errors
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j].value !== 0) {
        if (!isValidMove(board, i, j, board[i][j].value)) {
          board[i][j].isError = true;
        }
      }
    }
  }
};