import { printLine, printBlank, scrollToBottom } from '../../terminal/engine';

// ─── Typewriter helper ────────────────────────────────────────────────────────
// Creates one line and updates it in place — avoids appending a new div per char.

async function typeWriter(
  text: string,
  style: 'dim' | 'bright' | 'error' = 'bright',
  delay = 60,
): Promise<void> {
  const div = printLine({ text: '', style });
  for (let i = 1; i <= text.length; i++) {
    div.textContent = text.slice(0, i);
    scrollToBottom();
    await new Promise((r) => setTimeout(r, delay + Math.random() * 20));
  }
}

// ─── Matrix rain (canvas) ─────────────────────────────────────────────────────

function startMatrixRain(): () => void {
  const canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed; inset: 0;
    width: 100vw; height: 100vh;
    z-index: 9999;
    background: black;
    cursor: none;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d')!;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const fontSize = 14;
  const cols = Math.floor(canvas.width / fontSize);
  const drops = Array.from({ length: cols }, () => Math.random() * -100);

  const chars =
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
    '0123456789ABCDEF<>|{}[]\\/-+*=~^';

  const tick = () => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const y = (drops[i] ?? 0) * fontSize;
      if (y < 0) {
        drops[i] = (drops[i] ?? 0) + 1;
        continue;
      }

      ctx.fillStyle = '#00ff41';
      for (let j = 1; j < 6; j++) {
        if (Math.random() > 0.3) {
          ctx.fillText(
            chars[Math.floor(Math.random() * chars.length)] ?? '',
            i * fontSize,
            y - j * fontSize,
          );
        }
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)] ?? '', i * fontSize, y);

      if (y > canvas.height && Math.random() > 0.975) drops[i] = Math.random() * -50;
      drops[i] = (drops[i] ?? 0) + 0.5;
    }
  };

  const interval = setInterval(tick, 33);

  return () => {
    clearInterval(interval);
    canvas.style.transition = 'opacity 0.6s ease';
    canvas.style.opacity = '0';
    setTimeout(() => canvas.remove(), 650);
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────
// Note: matrix returns a cleanup function rather than Line[] — it manages its own
// canvas overlay. main.ts handles it as a special case in the executor.

export async function matrix(): Promise<() => void> {
  await printBlank();
  await typeWriter('Wake up, Matthias...', 'dim', 80);
  await new Promise((r) => setTimeout(r, 1200));

  await typeWriter('The Matrix has you...', 'dim', 80);
  await new Promise((r) => setTimeout(r, 1400));

  await typeWriter('Follow the white rabbit.', 'bright', 60);
  await new Promise((r) => setTimeout(r, 2000));

  const hops = [
    '\uD83D\uDC07',
    ' \uD83D\uDC07',
    '  \uD83D\uDC07',
    '   \uD83D\uDC07',
    '    \uD83D\uDC07',
    '     \uD83D\uDC07',
  ];
  for (const hop of hops) {
    await new Promise((r) => setTimeout(r, 180));
    printLine({ text: hop });
  }

  await new Promise((r) => setTimeout(r, 600));
  printLine({ text: 'Knock knock, Neo.', style: 'dim' });
  await new Promise((r) => setTimeout(r, 1400));

  return startMatrixRain();
}
