import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore } from '@/hooks/useGameStore';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Pause, Home, RotateCcw, HelpCircle, LogIn } from 'lucide-react';
import WritingModeButton from '@/components/WritingModeButton';
import SocialFooter from '@/components/SocialFooter';
import { useLanguage } from '@/hooks/useLanguage';
import { Difficulty, GameState } from '@/types/game';
import { generatePuzzle, isValidMove, isBoardComplete, checkForErrors } from '@/utils/sudoku';
import CoinIcon from '@/components/CoinIcon';
import LivesDisplay from '@/components/LivesDisplay';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const GameScreen = () => {
  const { difficulty } = useParams<{ difficulty: Difficulty }>();
  const navigate = useNavigate();
  const { stats, updateStats, addExperience, decrementBossCounter, updateCoins, userStats } = useGameStore();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [gameState, setGameState] = useState<GameState>(() => ({
    board: generatePuzzle(difficulty as Difficulty),
    difficulty: difficulty as Difficulty,
    startTime: Date.now(),
    currentTime: 0,
    isComplete: false,
    isPaused: false,
    selectedCell: null,
    livesRemaining: 3,
    hintsUsed: 0,
    selectedNumber: null,
    sessionId: null,
    isWritingMode: false,
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
    if (gameState.isPaused) return;

    setGameState(prev => {
      const clickedCell = prev.board[row][col];
      const clickedValue = clickedCell.value;

      return {
        ...prev,
        selectedCell: { row, col },
        selectedNumber: clickedValue !== 0 ? clickedValue : null,
        board: prev.board.map((boardRow, r) =>
          boardRow.map((cell, c) => ({
            ...cell,
            isSelected: r === row && c === col,
            isHighlighted: clickedValue !== 0 && cell.value === clickedValue,
          }))
        ),
      };
    });
  }, [gameState.isPaused]);

  const handleNumberInput = useCallback((number: number) => {
    if (!gameState.selectedCell || gameState.isPaused || gameState.livesRemaining <= 0) return;

    const { row, col } = gameState.selectedCell;
    if (gameState.board[row][col].isFixed) return;

    setGameState(prev => {
      const newBoard = [...prev.board];
      const previousValue = newBoard[row][col].value;
      
      if (prev.isWritingMode) {
        // Writing mode: add/remove notes
        const currentNotes = [...newBoard[row][col].notes];
        if (number === 0) {
          // Clear all notes
          newBoard[row][col] = {
            ...newBoard[row][col],
            notes: [],
          };
        } else {
          // Toggle note
          const noteIndex = currentNotes.indexOf(number);
          if (noteIndex > -1) {
            currentNotes.splice(noteIndex, 1);
          } else {
            currentNotes.push(number);
            currentNotes.sort();
          }
          newBoard[row][col] = {
            ...newBoard[row][col],
            notes: currentNotes,
          };
        }
        
        return {
          ...prev,
          board: newBoard,
        };
      } else {
        // Normal mode: clear notes and set value
        newBoard[row][col] = {
          ...newBoard[row][col],
          value: number,
          notes: [], // Clear notes when placing number
        };
      }

      // Clear highlights first
      newBoard.forEach(boardRow => 
        boardRow.forEach(cell => {
          cell.isHighlighted = false;
        })
      );

      // Highlight same numbers if not 0
      if (number !== 0) {
        newBoard.forEach(boardRow => 
          boardRow.forEach(cell => {
            if (cell.value === number) {
              cell.isHighlighted = true;
            }
          })
        );
      }

      // Check for errors
      checkForErrors(newBoard);
      
      // Check if move is valid (life system)
      let newLivesRemaining = prev.livesRemaining;
      if (number !== 0 && !isValidMove(newBoard, row, col, number)) {
        newLivesRemaining = Math.max(0, prev.livesRemaining - 1);
        
        // Show life lost feedback
        setTimeout(() => {
          toast({
            title: "Yanlış Hamle!",
            description: `${newLivesRemaining > 0 ? `${newLivesRemaining} canınız kaldı` : 'Tüm canlarınızı kaybettiniz!'}`,
            variant: "destructive",
          });
        }, 100);
      }

      // Check if game is complete and valid
      const isComplete = isBoardComplete(newBoard) && !newBoard.some(row => row.some(cell => cell.isError));
      
      if (isComplete) {
        // Game completed successfully!
        const finalTime = Math.floor((Date.now() - prev.startTime) / 1000);
        const experience = calculateExperience(prev.difficulty, finalTime);
        const coinsEarned = calculateCoinsEarned(prev.difficulty);
        
        addExperience(experience);
        updateCoins(coinsEarned);
        decrementBossCounter(prev.difficulty);
        
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

        // Save to Supabase if authenticated
        if (isAuthenticated && user) {
          saveGameSession({
            user_id: user.id,
            difficulty: prev.difficulty,
            completion_time: finalTime,
            coins_earned: coinsEarned,
            hints_used: prev.hintsUsed,
            lives_lost: 3 - newLivesRemaining,
            is_completed: true,
          });
        }

        // Navigate to result screen
        setTimeout(() => {
          navigate('/result', { 
            state: { 
              time: finalTime, 
              difficulty: prev.difficulty,
              isNewRecord: !stats.bestTimes[prev.difficulty] || finalTime < stats.bestTimes[prev.difficulty],
              experience,
              coinsEarned
            } 
          });
        }, 1000);
      }

      return {
        ...prev,
        board: newBoard,
        isComplete,
        livesRemaining: newLivesRemaining,
        selectedNumber: number === 0 ? null : number,
      };
    });
  }, [gameState.selectedCell, gameState.isPaused, gameState.board, gameState.livesRemaining, stats, addExperience, decrementBossCounter, updateStats, updateCoins, navigate, isAuthenticated, user, toast]);

  const saveGameSession = async (sessionData: any) => {
    try {
      await supabase.from('game_sessions').insert(sessionData);
    } catch (error) {
      console.error('Error saving game session:', error);
    }
  };

  const calculateCoinsEarned = (difficulty: Difficulty) => {
    const coinRewards = {
      easy: 10,
      medium: 20,
      hard: 35,
      expert: 50,
    };
    return coinRewards[difficulty];
  };

  const useHint = useCallback(async () => {
    if (gameState.isPaused || gameState.livesRemaining <= 0) return;
    
    const coinCost = 80;
    const currentCoins = isAuthenticated ? userStats?.coin_balance || 0 : stats.coinBalance;
    
    if (currentCoins < coinCost) {
      toast({
        title: "Yetersiz Coin",
        description: "İpucu için 80 coin gerekli.",
        variant: "destructive",
      });
      return;
    }

    // Find an empty cell that can be filled
    const emptyCells = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (gameState.board[i][j].value === 0) {
          // Try each number to find the correct one
          for (let num = 1; num <= 9; num++) {
            if (isValidMove(gameState.board, i, j, num)) {
              emptyCells.push({ row: i, col: j, value: num });
              break;
            }
          }
        }
      }
    }

    if (emptyCells.length === 0) {
      toast({
        title: "İpucu Kullanılamaz",
        description: "Verilecek ipucu bulunamadı.",
        variant: "destructive",
      });
      return;
    }

    // Select random empty cell
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    
    setGameState(prev => {
      const newBoard = [...prev.board];
      newBoard[randomCell.row][randomCell.col] = {
        ...newBoard[randomCell.row][randomCell.col],
        value: randomCell.value,
        isFixed: true, // Make it fixed so it can't be changed
      };

      checkForErrors(newBoard);

      return {
        ...prev,
        board: newBoard,
        hintsUsed: prev.hintsUsed + 1,
      };
    });

    // Deduct coins
    updateCoins(-coinCost);

    // Update Supabase if authenticated
    if (isAuthenticated && user) {
      try {
        await supabase
          .from('user_stats')
          .update({ coin_balance: currentCoins - coinCost })
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error updating coins in database:', error);
      }
    }

    toast({
      title: "İpucu Kullanıldı",
      description: "80 coin karşılığında bir hücre dolduruldu.",
    });
  }, [gameState, stats.coinBalance, userStats?.coin_balance, isAuthenticated, user, updateCoins, toast]);

  // Get available numbers (hide completed ones)
  const getAvailableNumbers = () => {
    const numberCounts = Array(10).fill(0); // Index 0 won't be used, 1-9 for numbers
    
    gameState.board.forEach(row => {
      row.forEach(cell => {
        if (cell.value > 0) {
          numberCounts[cell.value]++;
        }
      });
    });

    return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(num => numberCounts[num] < 9);
  };

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
      livesRemaining: 3,
      hintsUsed: 0,
      selectedNumber: null,
      sessionId: null,
      isWritingMode: false,
    });
  };

  return (
    <div className={`min-h-screen p-4 transition-all duration-500 ${
      gameState.livesRemaining <= 1 ? 'lives-danger' : 
      gameState.livesRemaining <= 2 ? `lives-warning ${useGameStore.getState().theme === 'light' ? 'theme-light' : 'theme-dark'}` : 
      'bg-gradient-hero'
    }`}>
      {/* Floating skulls for danger mode */}
      {gameState.livesRemaining <= 1 && (
        <div className="danger-skulls">
          <div className="floating-skull">💀</div>
          <div className="floating-skull">💀</div>
          <div className="floating-skull">💀</div>
          <div className="floating-skull">💀</div>
          <div className="floating-skull">💀</div>
        </div>
      )}
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

          <div className="flex items-center gap-3">
            {/* Coins */}
            <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2">
              <CoinIcon className="w-5 h-5" />
              <span className="font-bold text-foreground">
                {isAuthenticated ? userStats?.coin_balance || 0 : stats.coinBalance}
              </span>
            </div>

            {/* Lives */}
            <div className="bg-card/80 backdrop-blur-sm rounded-lg px-3 py-2">
              <LivesDisplay lives={gameState.livesRemaining} />
            </div>

            {!isAuthenticated && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth')}
                className="btn-secondary-gaming"
              >
                <LogIn className="w-4 h-4" />
              </Button>
            )}

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
                      cell.isHighlighted ? 'highlighted' : ''
                    } ${
                      cell.isFixed ? 'font-black fixed-number' : 'font-normal user-number'
                    }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  style={{
                    borderRight: colIndex % 3 === 2 && colIndex !== 8 ? '3px solid hsl(var(--sudoku-border))' : undefined,
                    borderBottom: rowIndex % 3 === 2 && rowIndex !== 8 ? '3px solid hsl(var(--sudoku-border))' : undefined,
                  }}
                 >
                   {cell.value !== 0 ? cell.value : ''}
                   {cell.notes.length > 0 && cell.value === 0 && (
                     <div className="notes-container">
                       {cell.notes.map(note => (
                         <span key={note} className="note-number">
                           {note}
                         </span>
                       ))}
                     </div>
                   )}
                 </div>
              ))
            )}
          </div>
        </Card>

        {/* Controls */}
        <div className="flex flex-col gap-4">
          {/* Hint and Writing Mode Buttons */}
          <Card className="p-4 bg-card/80 backdrop-blur-sm">
            <div className="flex flex-row justify-center items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={useHint}
                  className="btn-secondary-gaming rounded-full px-8 py-4 flex items-center gap-2 hover:scale-110 transition-all duration-300"
                  style={{ animation: 'pulseGlow 2s infinite' }}
                  disabled={gameState.isPaused || gameState.livesRemaining <= 0 || (isAuthenticated ? (userStats?.coin_balance || 0) < 80 : stats.coinBalance < 80)}
                >
                  ✨ {t('hint')}
                </Button>
                <div className="flex items-center gap-1 text-sm font-bold text-muted-foreground">
                  80 <CoinIcon className="w-4 h-4" />
                </div>
              </div>
              <WritingModeButton 
                isWritingMode={gameState.isWritingMode}
                onToggle={() => setGameState(prev => ({ ...prev, isWritingMode: !prev.isWritingMode }))}
              />
            </div>
          </Card>

          {/* Number Input */}
          <Card className="p-6 bg-card/80 backdrop-blur-sm">
            <div className="grid grid-cols-5 gap-3 max-w-md mx-auto">
              {getAvailableNumbers().map((number) => (
                <Button
                  key={number}
                  onClick={() => handleNumberInput(number)}
                  className={`btn-gaming aspect-square text-xl ${
                    gameState.selectedNumber === number ? 'ring-2 ring-primary' : ''
                  }`}
                  disabled={gameState.isPaused || gameState.livesRemaining <= 0}
                >
                  {number}
                </Button>
              ))}
              <Button
                onClick={() => handleNumberInput(0)}
                className="btn-secondary-gaming aspect-square text-xl"
                disabled={gameState.isPaused || gameState.livesRemaining <= 0}
              >
                ×
              </Button>
            </div>
          </Card>
        </div>

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

        {/* Game Over Screen */}
        {gameState.livesRemaining <= 0 && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <Card className="p-8 text-center bg-card/95 backdrop-blur-sm">
              <div className="text-6xl mb-4">💀</div>
              <h3 className="text-3xl font-bold mb-4 text-foreground">OYUN BİTTİ!</h3>
              <p className="text-xl text-muted-foreground mb-6">
                Tüm canlarınızı kaybettiniz!
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={resetGame} className="btn-gaming">
                  Tekrar Dene
                </Button>
                <Button onClick={() => navigate('/')} className="btn-secondary-gaming">
                  Ana Menü
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Completion Animation */}
        {gameState.isComplete && (
          <div className="fixed inset-0 bg-gradient-gaming/80 flex items-center justify-center z-50">
            <Card className="p-8 text-center bg-card/95 backdrop-blur-sm level-up">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-3xl font-bold mb-4 text-foreground">TEBRİKLER!</h3>
              <p className="text-xl text-muted-foreground mb-4">
                Puzzle {formatTime(gameState.currentTime)} sürede tamamlandı!
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                +{calculateCoinsEarned(gameState.difficulty)} <CoinIcon className="w-4 h-4 inline" /> kazandınız!
              </p>
              <Button onClick={() => navigate('/result', { 
                state: { 
                  time: gameState.currentTime, 
                  difficulty: gameState.difficulty,
                  isNewRecord: !stats.bestTimes[gameState.difficulty] || gameState.currentTime < stats.bestTimes[gameState.difficulty],
                  experience: calculateExperience(gameState.difficulty, gameState.currentTime),
                  coinsEarned: calculateCoinsEarned(gameState.difficulty)
                } 
              })} className="btn-gaming">
                Devam Et
              </Button>
            </Card>
          </div>
        )}
      </div>
      <SocialFooter />
    </div>
  );
};

export default GameScreen;