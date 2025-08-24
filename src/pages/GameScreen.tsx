import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '@/hooks/useGameStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pause, Home, RotateCcw } from 'lucide-react';
import { Difficulty, GameState } from '@/types/game';
import { generatePuzzle, isValidMove, isBoardComplete, checkForErrors } from '@/utils/sudoku';

const GameScreen = () => {
  const { difficulty } = useParams<{ difficulty: Difficulty }>();
  const navigate = useNavigate();
  const { stats, updateStats, addExperience, decrementBossCounter } = useGameStore();

  const [gameState, setGameState] = useState<GameState>(() => ({
    board: generatePuzzle(difficulty as Difficulty),
    difficulty: difficulty as Difficulty,
    startTime: Date.now(),
    currentTime: 0,
    isComplete: false,
    isPaused: false,
    selectedCell: null,
  }));

  // Timer effect
  useEffect(() => {
    if (!gameState.isPaused && !gameState.isComplete) {
      const interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          currentTime: Math.floor((Date.now() - prev.startTime) / 1000)
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [gameState.isPaused, gameState.isComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCellClick = useCallback((row: number, col: number) => {
    if (gameState.board[row][col].isFixed || gameState.isPaused) return;

    setGameState(prev => ({
      ...prev,
      selectedCell: { row, col },
      board: prev.board.map((boardRow, r) =>
        boardRow.map((cell, c) => ({
          ...cell,
          isSelected: r === row && c === col,
        }))
      ),
    }));
  }, [gameState.board, gameState.isPaused]);

  const handleNumberInput = useCallback((number: number) => {
    if (!gameState.selectedCell || gameState.isPaused) return;

    const { row, col } = gameState.selectedCell;
    if (gameState.board[row][col].isFixed) return;

    setGameState(prev => {
      const newBoard = [...prev.board];
      newBoard[row][col] = {
        ...newBoard[row][col],
        value: number,
      };

      // Check for errors
      checkForErrors(newBoard);

      // Check if game is complete
      const isComplete = isBoardComplete(newBoard);
      
      if (isComplete) {
        // Game completed!
        const finalTime = Math.floor((Date.now() - prev.startTime) / 1000);
        const experience = calculateExperience(prev.difficulty, finalTime);
        
        addExperience(experience);
        decrementBossCounter();
        
        // Update stats
        const newStats = {
          gamesPlayed: stats.gamesPlayed + 1,
          gamesWon: stats.gamesWon + 1,
          totalTime: stats.totalTime + finalTime,
        };

        // Update best time if applicable
        if (!stats.bestTimes[prev.difficulty] || finalTime < stats.bestTimes[prev.difficulty]) {
          updateStats({
            ...newStats,
            bestTimes: {
              ...stats.bestTimes,
              [prev.difficulty]: finalTime,
            },
          });
        } else {
          updateStats(newStats);
        }

        // Navigate to result screen
        setTimeout(() => {
          navigate('/result', { 
            state: { 
              time: finalTime, 
              difficulty: prev.difficulty,
              isNewRecord: !stats.bestTimes[prev.difficulty] || finalTime < stats.bestTimes[prev.difficulty],
              experience
            } 
          });
        }, 1000);
      }

      return {
        ...prev,
        board: newBoard,
        isComplete,
      };
    });
  }, [gameState.selectedCell, gameState.isPaused, gameState.board, stats, addExperience, decrementBossCounter, updateStats, navigate]);

  const calculateExperience = (difficulty: Difficulty, time: number) => {
    const baseExp = {
      easy: 50,
      medium: 75,
      hard: 100,
      expert: 150,
    };
    
    // Bonus for completing quickly
    const timeBonus = Math.max(0, 300 - time) * 0.5;
    
    return Math.floor(baseExp[difficulty] + timeBonus);
  };

  // Keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '9') {
        handleNumberInput(parseInt(e.key));
      } else if (e.key === 'Backspace' || e.key === '0') {
        handleNumberInput(0);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNumberInput]);

  const togglePause = () => {
    setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
  };

  const resetGame = () => {
    setGameState({
      board: generatePuzzle(difficulty as Difficulty),
      difficulty: difficulty as Difficulty,
      startTime: Date.now(),
      currentTime: 0,
      isComplete: false,
      isPaused: false,
      selectedCell: null,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="btn-secondary-gaming"
          >
            <Home className="w-4 h-4 mr-2" />
            Ana Menü
          </Button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground capitalize">
              {difficulty} Seviye
            </h2>
            <p className="text-muted-foreground">Seviye {stats.currentLevel}</p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={togglePause}
              className="btn-secondary-gaming"
            >
              <Pause className="w-4 h-4" />
            </Button>
            <Button 
              variant="outline" 
              onClick={resetGame}
              className="btn-secondary-gaming"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Game Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 text-center bg-card/80 backdrop-blur-sm">
            <div className="text-2xl font-bold text-foreground">
              {formatTime(gameState.currentTime)}
            </div>
            <div className="text-sm text-muted-foreground">Süre</div>
          </Card>
          
          <Card className="p-4 text-center bg-card/80 backdrop-blur-sm">
            <div className="text-2xl font-bold text-foreground">
              {stats.bestTimes[difficulty as Difficulty] 
                ? formatTime(stats.bestTimes[difficulty as Difficulty])
                : '--:--'
              }
            </div>
            <div className="text-sm text-muted-foreground">Rekor</div>
          </Card>

          <Card className="p-4 text-center bg-card/80 backdrop-blur-sm">
            <div className="text-2xl font-bold text-foreground">
              {stats.experience}/{stats.currentLevel * 100}
            </div>
            <div className="text-sm text-muted-foreground">Deneyim</div>
          </Card>

          <Card className="p-4 text-center bg-card/80 backdrop-blur-sm">
            <div className="text-2xl font-bold text-foreground">
              {stats.gamesUntilBoss}
            </div>
            <div className="text-sm text-muted-foreground">Boss'a</div>
          </Card>
        </div>

        {/* Sudoku Board */}
        <Card className="p-6 mb-6 bg-card/90 backdrop-blur-sm">
          <div className="sudoku-grid mx-auto max-w-lg">
            {gameState.board.map((row, rowIndex) =>
              row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`sudoku-cell ${
                    cell.isSelected ? 'selected' : ''
                  } ${
                    cell.isError ? 'error' : ''
                  } ${
                    cell.isFixed ? 'font-black' : 'font-normal'
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  style={{
                    borderRight: colIndex % 3 === 2 && colIndex !== 8 ? '3px solid hsl(var(--sudoku-border))' : undefined,
                    borderBottom: rowIndex % 3 === 2 && rowIndex !== 8 ? '3px solid hsl(var(--sudoku-border))' : undefined,
                  }}
                >
                  {cell.value !== 0 ? cell.value : ''}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Number Input */}
        <Card className="p-6 bg-card/80 backdrop-blur-sm">
          <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <Button
                key={number}
                onClick={() => handleNumberInput(number)}
                className="btn-gaming aspect-square text-xl"
                disabled={gameState.isPaused}
              >
                {number}
              </Button>
            ))}
            <Button
              onClick={() => handleNumberInput(0)}
              className="btn-secondary-gaming aspect-square text-xl"
              disabled={gameState.isPaused}
            >
              ×
            </Button>
          </div>
        </Card>

        {/* Pause Overlay */}
        {gameState.isPaused && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <Card className="p-8 text-center bg-card/95 backdrop-blur-sm">
              <h3 className="text-3xl font-bold mb-4 text-foreground">DURDURULDU</h3>
              <Button onClick={togglePause} className="btn-gaming">
                Devam Et
              </Button>
            </Card>
          </div>
        )}

        {/* Completion Animation */}
        {gameState.isComplete && (
          <div className="fixed inset-0 bg-gradient-gaming/80 flex items-center justify-center z-50">
            <Card className="p-8 text-center bg-card/95 backdrop-blur-sm level-up">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold mb-4 text-foreground">TEBRİKLER!</h3>
              <p className="text-xl text-muted-foreground">
                Puzzle {formatTime(gameState.currentTime)} sürede tamamlandı!
              </p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameScreen;