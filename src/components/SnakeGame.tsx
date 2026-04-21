import { useState, useEffect, useCallback, useRef } from 'react';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighscore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const directionRef = useRef(direction);
  const snakeRef = useRef(snake);
  const foodRef = useRef(food);

  // Sync refs
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && isGameOver) {
        startGame();
        return;
      }

      if (!isPlaying || isGameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver, generateFood]);

  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        if (!prevSnake || prevSnake.length === 0) return prevSnake;

        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y
        };

        // Check bounds collision
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          setIsPlaying(false);
          setHighscore(h => Math.max(score, h));
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setIsGameOver(true);
          setIsPlaying(false);
          setHighscore(h => Math.max(score, h));
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        const currentFood = foodRef.current;
        if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    const speed = Math.max(50, 150 - Math.floor(score / 30) * 10);
    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [isPlaying, isGameOver, score, highScore, generateFood]);

  return (
    <section className="flex-1 bg-black rounded-2xl border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(0,243,255,0.1)] flex flex-col items-center justify-center relative overflow-hidden h-full max-h-full">
      
      {/* Absolute Score Board inside game */}
      <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-20 pointer-events-none">
        
        <div className="flex items-center gap-4 sm:gap-8 bg-black/60 backdrop-blur-md px-4 sm:px-6 py-2 rounded-xl border border-white/5 w-full justify-between shadow-lg">
          <div className="flex flex-col shrink-0">
            <span className="text-[10px] uppercase tracking-widest text-cyan-400 opacity-70 font-mono">Current Score</span>
            <span className="text-xl sm:text-3xl font-mono leading-none text-white">{score.toString().padStart(5, '0')}</span>
          </div>
          <div className="flex flex-col items-end border-l border-white/10 pl-4 sm:pl-8 shrink-0">
            <span className="text-[10px] uppercase tracking-widest text-purple-400 opacity-70 font-mono">High Score</span>
            <span className="text-xl sm:text-3xl font-mono leading-none text-white">{highScore.toString().padStart(5, '0')}</span>
          </div>
        </div>
      </div>

      {/* Game Grid Structure */}
      <div 
        className="relative z-10 w-full shrink-0 flex items-center justify-center mt-[60px]"
      >
        <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px] max-w-[90vw] max-h-[70vh]">
          <div className="absolute inset-0 grid gap-[2px] opacity-20 pointer-events-none"
               style={{ 
                 gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                 gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
               }}>
             {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
               <div key={`grid-${i}`} className="w-full h-full border border-white/5" />
             ))}
          </div>

          <div className="absolute inset-0 grid gap-[2px]"
               style={{ 
                 gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
                 gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
               }}>
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              
              const isFood = food.x === x && food.y === y;
              const isSnakeHead = snake.length > 0 && snake[0].x === x && snake[0].y === y;
              const isSnakeBody = !isSnakeHead && snake.some(segment => segment.x === x && segment.y === y);

              return (
                <div 
                  key={`cell-${i}`} 
                  className={`w-full h-full flex items-center justify-center ${
                    isSnakeHead ? 'bg-cyan-400 rounded-sm shadow-[0_0_20px_rgba(34,211,238,0.9)] z-10' :
                    isSnakeBody ? 'bg-cyan-600/80 rounded-sm' :
                    isFood ? 'bg-purple-500 rounded-sm shadow-[0_0_15px_rgba(168,85,247,0.8)] z-10 scale-[0.7]' :
                    ''
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Overlay Block for Game Over / Start */}
      {isGameOver && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-30 backdrop-blur-sm px-4 text-center">
          <h2 className="text-3xl sm:text-5xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-purple-500 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] mb-2">
            {score > 0 ? 'SYSTEM HALTED' : 'NEON SNAKE'}
          </h2>
          <p className="text-gray-400 font-mono text-xs sm:text-sm mb-8 uppercase tracking-widest">
            {score > 0 ? `Final Score: ${score}` : 'System Ready'}
          </p>
          <button 
            onClick={startGame}
            className="px-6 py-3 sm:px-8 sm:py-3 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all rounded-xl font-bold tracking-widest uppercase cursor-pointer text-sm pointer-events-auto"
          >
            {score > 0 ? 'Retry Run' : 'Initialize()'}
          </button>
        </div>
      )}

      {/* Border Glow for Game Container */}
      <div className="absolute inset-0 ring-1 ring-cyan-500/50 shadow-[inset_0_0_30px_rgba(0,243,255,0.2)] pointer-events-none z-40"></div>
    </section>
  );
}
