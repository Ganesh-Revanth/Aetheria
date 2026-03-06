import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface SandboxProps {
  particleCount: number;
  gravity: number;
  friction: number;
  interactionMode: 'attract' | 'repel' | 'orbit' | 'vortex';
  colorPalette: string[];
  showConnections: boolean;
  connectionDistance: number;
}

export const Simulation: React.FC<SandboxProps> = ({
  particleCount,
  gravity,
  friction,
  interactionMode,
  colorPalette,
  showConnections,
  connectionDistance,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const mouse = useRef({ x: -1000, y: -1000, active: false });
  const animationFrameId = useRef<number>(0);

  const initParticles = (width: number, height: number, count: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 2 + 1,
        color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
        alpha: Math.random() * 0.5 + 0.2,
        life: Math.random() * 100,
        maxLife: 100 + Math.random() * 100,
      });
    }
    particles.current = newParticles;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height, particleCount);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const render = () => {
      ctx.fillStyle = 'rgba(5, 5, 10, 0.15)'; // Trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const pCount = particles.current.length;
      
      // Adjust particle count if changed
      if (pCount < particleCount) {
        for (let i = 0; i < particleCount - pCount; i++) {
          particles.current.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 2 + 1,
            color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
            alpha: Math.random() * 0.5 + 0.2,
            life: 0,
            maxLife: 100 + Math.random() * 100,
          });
        }
      } else if (pCount > particleCount) {
        particles.current.splice(particleCount);
      }

      for (let i = 0; i < particles.current.length; i++) {
        const p = particles.current[i];

        // Mouse interaction
        if (mouse.current.active) {
          const dx = mouse.current.x - p.x;
          const dy = mouse.current.y - p.y;
          const distSq = dx * dx + dy * dy;
          
          if (distSq < 160000) { // 400 * 400
            const dist = Math.sqrt(distSq);
            const force = (400 - dist) / 400 * gravity;
            
            if (interactionMode === 'attract') {
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            } else if (interactionMode === 'repel') {
              p.vx -= (dx / dist) * force;
              p.vy -= (dy / dist) * force;
            } else if (interactionMode === 'orbit') {
              p.vx += (dy / dist) * force;
              p.vy -= (dx / dist) * force;
            } else if (interactionMode === 'vortex') {
              p.vx += (dy / dist) * force + (dx / dist) * (force * 0.1);
              p.vy -= (dx / dist) * force + (dy / dist) * (force * 0.1);
            }
          }
        }

        // Physics
        p.vx *= friction;
        p.vy *= friction;
        p.x += p.vx;
        p.y += p.vy;

        // Boundary check
        if (p.x < 0) p.x = canvas.width;
        else if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        else if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);

        // Connections - Optimized: Only check a limited number of neighbors or use a stride
        if (showConnections && i % 2 === 0) { // Only check every 2nd particle for connections to save perf
          for (let j = i + 1; j < particles.current.length; j += 2) {
            const p2 = particles.current[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const distSq = dx * dx + dy * dy;
            
            if (distSq < connectionDistance * connectionDistance) {
              const dist = Math.sqrt(distSq);
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.strokeStyle = p.color;
              ctx.globalAlpha = (1 - dist / connectionDistance) * 0.15;
              ctx.stroke();
            }
          }
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [particleCount, gravity, friction, interactionMode, colorPalette, showConnections, connectionDistance]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;
    mouse.current.active = true;
  };

  const handleMouseLeave = () => {
    mouse.current.active = false;
  };

  const handleMouseDown = () => {
    // Boost gravity on click
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 cursor-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
    />
  );
};
