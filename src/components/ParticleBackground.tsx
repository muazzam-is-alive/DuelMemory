import React, { useEffect, useRef } from 'react';
import { ColorScheme } from '../types';

interface ParticleBackgroundProps {
  enabled?: boolean;
  colorScheme?: ColorScheme;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  enabled = true,
  colorScheme = 'BRIGHT',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const isBright = colorScheme === 'BRIGHT';
    const isPink = colorScheme === 'NEON_PINK';

    // Particle pool
    const particleCount = Math.min(35, Math.floor((width * height) / 28000));
    const palette = isBright
      ? ['#f59e0b', '#fbbf24', '#10b981', '#06b6d4', '#f43f5e']
      : isPink
      ? ['#f472b6', '#f43f5e', '#fb7185', '#fda4af', '#e879f9']
      : ['#a855f7', '#3b82f6', '#06b6d4', '#ec4899'];

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.5 + 1,
      color: palette[Math.floor(Math.random() * palette.length)],
      alpha: Math.random() * 0.4 + 0.2,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
    }));

    let t = 0;

    const render = () => {
      t += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Draw background gradient
      const bgGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.8
      );

      if (isBright) {
        bgGrad.addColorStop(0, '#fffdf5');
        bgGrad.addColorStop(0.6, '#fef9c3');
        bgGrad.addColorStop(1, '#fef08a');
      } else if (isPink) {
        bgGrad.addColorStop(0, '#ffffff');
        bgGrad.addColorStop(0.5, '#fdf2f8');
        bgGrad.addColorStop(1, '#fce7f3');
      } else {
        bgGrad.addColorStop(0, '#131320');
        bgGrad.addColorStop(0.5, '#0b0b14');
        bgGrad.addColorStop(1, '#05050a');
      }

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw floating particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const pulseAlpha = p.alpha + Math.sin(t * 2 + p.x) * 0.12;

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(0.8, pulseAlpha));
        ctx.fillStyle = p.color;
        if (!isBright) {
          ctx.shadowColor = p.color;
          ctx.shadowBlur = p.radius * 5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Connecting lines
      if (!isBright) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 100) {
              ctx.save();
              ctx.globalAlpha = (1 - dist / 100) * 0.12;
              ctx.strokeStyle = isPink ? '#f472b6' : '#8b5cf6';
              ctx.lineWidth = 0.8;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
              ctx.restore();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, colorScheme]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
};
