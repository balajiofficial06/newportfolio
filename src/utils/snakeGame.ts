// Snake game logic — all state is sealed inside an IIFE, nothing leaks to global scope.

export interface SnakeGameHandle {
  handleKey: (e: KeyboardEvent) => void;
  handleDpad: (direction: 'up' | 'down' | 'left' | 'right') => void;
  startOrRestart: () => void;
  destroy: () => void;
}

export function initSnakeGame(
  canvas: HTMLCanvasElement,
  onScore: (score: number) => void,
  onBest: (best: number) => void,
): SnakeGameHandle {
  // IIFE — every variable is local to this closure
  return (() => {
    const GRID = 20;
    const CELL = canvas.width / GRID; // 300 / 20 = 15px
    const TICK_MS = 120;
    const ACCENT = '#00f3ff';
    const DEAD_COLOR = '#ff00c1';
    const BG = '#050505';

    type Pt = { x: number; y: number };

    let snake: Pt[] = [];
    let dir: Pt = { x: 1, y: 0 };
    let nextDir: Pt = { x: 1, y: 0 };
    let food: Pt = { x: 0, y: 0 };
    let score = 0;
    let best = parseInt(localStorage.getItem('snake-best') ?? '0', 10);
    let dead = false;
    let started = false;
    let ticker: ReturnType<typeof setInterval> | null = null;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      const noop = () => {};
      return { handleKey: noop, handleDpad: noop, startOrRestart: noop, destroy: noop };
    }

    // ── helpers ───────────────────────────────────────────────────────────

    function placeFood(): Pt {
      const occupied = new Set(snake.map((p) => `${p.x},${p.y}`));
      let p: Pt;
      do {
        p = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
      } while (occupied.has(`${p.x},${p.y}`));
      return p;
    }

    /** Draw a filled rounded rectangle without using the newer roundRect() API */
    function fillRoundRect(x: number, y: number, w: number, h: number, r: number) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.arcTo(x + w, y, x + w, y + r, r);
      ctx.lineTo(x + w, y + h - r);
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
      ctx.lineTo(x + r, y + h);
      ctx.arcTo(x, y + h, x, y + h - r, r);
      ctx.lineTo(x, y + r);
      ctx.arcTo(x, y, x + r, y, r);
      ctx.closePath();
      ctx.fill();
    }

    // ── draw ──────────────────────────────────────────────────────────────

    function drawGrid() {
      ctx.strokeStyle = 'rgba(255,255,255,0.04)';
      ctx.lineWidth = 0.5;
      for (let i = 1; i < GRID; i++) {
        ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(canvas.width, i * CELL); ctx.stroke();
      }
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawGrid();

      // Food — filled circle with glow
      ctx.save();
      ctx.shadowColor = ACCENT;
      ctx.shadowBlur = 12;
      ctx.fillStyle = ACCENT;
      ctx.beginPath();
      ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Snake — opacity fades toward the tail
      const len = snake.length;
      snake.forEach((seg, i) => {
        const alpha = i === 0 ? 1 : Math.max(0.1, 1 - (i / len) * 0.9);
        const pad = 1.5;
        const size = CELL - pad * 2;

        ctx.save();
        if (i === 0) {
          ctx.shadowColor = ACCENT;
          ctx.shadowBlur = 8;
          ctx.fillStyle = ACCENT;
        } else {
          ctx.fillStyle = `rgba(0,243,255,${alpha.toFixed(2)})`;
        }
        fillRoundRect(seg.x * CELL + pad, seg.y * CELL + pad, size, size, i === 0 ? 4 : 2);
        ctx.restore();
      });

      // Game-over overlay
      if (dead) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.textAlign = 'center';
        ctx.font = 'bold 15px "JetBrains Mono", monospace';
        ctx.fillStyle = DEAD_COLOR;
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

        ctx.font = '11px "JetBrains Mono", monospace';
        ctx.fillStyle = 'rgba(0,243,255,0.75)';
        ctx.fillText(`score  ${score}`, canvas.width / 2, canvas.height / 2 + 4);
        ctx.fillText('tap · click · press any arrow to restart', canvas.width / 2, canvas.height / 2 + 22);
      }
    }

    function drawIdle() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      ctx.textAlign = 'center';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillStyle = 'rgba(0,243,255,0.4)';
      ctx.fillText('tap  ·  press any arrow key  to start', canvas.width / 2, canvas.height / 2);
    }

    // ── game loop ─────────────────────────────────────────────────────────

    function tick() {
      if (dead) return;

      dir = nextDir;
      const head = snake[0];
      const newHead: Pt = {
        x: (head.x + dir.x + GRID) % GRID,
        y: (head.y + dir.y + GRID) % GRID,
      };

      // Self-collision → game over
      if (snake.some((s) => s.x === newHead.x && s.y === newHead.y)) {
        dead = true;
        draw();
        return;
      }

      snake.unshift(newHead);

      if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        onScore(score);
        if (score > best) {
          best = score;
          localStorage.setItem('snake-best', String(best));
          onBest(best);
        }
        food = placeFood();
      } else {
        snake.pop();
      }

      draw();
    }

    function resetState() {
      const mid = Math.floor(GRID / 2);
      snake = [
        { x: mid,     y: mid },
        { x: mid - 1, y: mid },
        { x: mid - 2, y: mid },
      ];
      dir = { x: 1, y: 0 };
      nextDir = { x: 1, y: 0 };
      food = placeFood();
      score = 0;
      dead = false;
      onScore(0);
    }

    // ── public API ────────────────────────────────────────────────────────

    function startOrRestart() {
      if (ticker) clearInterval(ticker);
      resetState();
      started = true;
      draw();
      ticker = setInterval(tick, TICK_MS);
    }

    function applyDir(dx: number, dy: number) {
      // Prevent 180° reversal
      if (dx !== 0 && dir.x !== 0) return;
      if (dy !== 0 && dir.y !== 0) return;
      nextDir = { x: dx, y: dy };
    }

    function handleKey(e: KeyboardEvent) {
      const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (arrows.includes(e.key)) e.preventDefault();

      if (!started || dead) {
        if ([...arrows, 'Enter', ' '].includes(e.key)) startOrRestart();
        return;
      }
      switch (e.key) {
        case 'ArrowUp':    applyDir(0, -1); break;
        case 'ArrowDown':  applyDir(0,  1); break;
        case 'ArrowLeft':  applyDir(-1, 0); break;
        case 'ArrowRight': applyDir(1,  0); break;
      }
    }

    function handleDpad(direction: 'up' | 'down' | 'left' | 'right') {
      if (!started || dead) { startOrRestart(); return; }
      switch (direction) {
        case 'up':    applyDir(0, -1); break;
        case 'down':  applyDir(0,  1); break;
        case 'left':  applyDir(-1, 0); break;
        case 'right': applyDir(1,  0); break;
      }
    }

    function destroy() {
      if (ticker) { clearInterval(ticker); ticker = null; }
    }

    // Bootstrap — read persisted best and paint idle screen
    onBest(best);
    drawIdle();

    return { handleKey, handleDpad, startOrRestart, destroy };
  })();
}
