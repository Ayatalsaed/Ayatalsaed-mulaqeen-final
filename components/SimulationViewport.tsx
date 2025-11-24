import React, { useEffect, useRef } from 'react';
import { RefreshCw, Play } from 'lucide-react';
import { RobotConfig } from '../types';

interface SimulationViewportProps {
  config?: RobotConfig;
  isRunning: boolean;
  codeOutput: any[]; // Simulated commands
  resetSimulation: () => void;
  startPosition?: { x: number; y: number; angle: number };
  gridSize?: number;
}

const SimulationViewport: React.FC<SimulationViewportProps> = ({ 
  config, 
  isRunning, 
  codeOutput, 
  resetSimulation,
  startPosition = { x: 50, y: 50, angle: 0 },
  gridSize = 40
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const robotState = useRef({ ...startPosition }); 
  const animationFrameId = useRef<number>(0);
  const lidarAngle = useRef(0);

  // Draw the grid and robot
  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const time = performance.now();

    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Grid Background
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw Obstacles (Simulated)
    ctx.fillStyle = '#334155';
    ctx.fillRect(200, 100, 40, 120);
    ctx.fillRect(350, 250, 120, 40);

    // Draw Robot
    ctx.save();
    ctx.translate(robotState.current.x, robotState.current.y);
    ctx.rotate((robotState.current.angle * Math.PI) / 180);

    const robotColor = config?.color || '#10b981';

    // Robot Body
    ctx.fillStyle = robotColor;
    ctx.shadowColor = robotColor;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.rect(-15, -15, 30, 30);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Direction Indicator (White Arrow)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-5, -5);
    ctx.lineTo(-5, 5);
    ctx.fill();

    // Wheels
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-18, -18, 36, 6); // Top
    ctx.fillRect(-18, 12, 36, 6);  // Bottom

    // --- SENSOR VISUALIZATION ---
    if (config) {
        // Ultrasonic Sensor (Front Waves)
        if (config.sensors.includes('ultrasonic')) {
            ctx.fillStyle = '#a5b4fc'; // Indigo-300
            ctx.fillRect(12, -8, 4, 16); // Sensor Bar
            
            if (isRunning) {
                // Pulsing Waves Animation
                ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)'; // Indigo-500
                ctx.lineWidth = 1.5;
                
                const maxRadius = config.sensorConfig.ultrasonic?.range ? config.sensorConfig.ultrasonic.range / 2 : 50; // Scale down visual range
                const waveCount = 3;
                const speed = 0.05;

                for(let i=0; i<waveCount; i++) {
                    const offset = (time * speed + (i * (maxRadius / waveCount))) % maxRadius;
                    const opacity = 1 - (offset / maxRadius);
                    
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
                    ctx.beginPath();
                    ctx.arc(15, 0, 10 + offset, -0.5, 0.5);
                    ctx.stroke();
                }
            }
        }

        // Camera (Front Lens & FOV)
        if (config.sensors.includes('camera')) {
            ctx.fillStyle = '#000000';
            ctx.beginPath();
            ctx.moveTo(10, -5);
            ctx.lineTo(16, -8);
            ctx.lineTo(16, 8);
            ctx.lineTo(10, 5);
            ctx.fill();
            // Lens glint
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath();
            ctx.arc(14, 0, 2, 0, Math.PI * 2);
            ctx.fill();

            if (isRunning) {
                // FOV Cone
                const fovLength = 100;
                const fovWidth = 50;
                
                // Fill
                const gradient = ctx.createLinearGradient(16, 0, 16 + fovLength, 0);
                gradient.addColorStop(0, 'rgba(56, 189, 248, 0.2)');
                gradient.addColorStop(1, 'rgba(56, 189, 248, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(16, 0);
                ctx.lineTo(16 + fovLength, -fovWidth);
                ctx.lineTo(16 + fovLength, fovWidth);
                ctx.fill();

                // Outline
                ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(16, 0);
                ctx.lineTo(16 + fovLength, -fovWidth);
                ctx.moveTo(16, 0);
                ctx.lineTo(16 + fovLength, fovWidth);
                ctx.stroke();
            }
        }

        // Color Sensor (Bottom Front LED)
        if (config.sensors.includes('color')) {
             ctx.fillStyle = '#fbbf24'; // Amber
             ctx.beginPath();
             ctx.arc(8, 8, 3, 0, Math.PI * 2);
             ctx.fill();
             // Light cone
             if (isRunning && config.sensorConfig.color?.illumination) {
                 ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
                 ctx.beginPath();
                 ctx.moveTo(8, 8);
                 ctx.lineTo(25, 20);
                 ctx.lineTo(25, -4);
                 ctx.fill();
             }
        }

        // LiDAR (Top Rotating Scanner)
        if (config.sensors.includes('lidar')) {
            ctx.fillStyle = '#ef4444'; // Red-500
            ctx.beginPath();
            ctx.arc(0, 0, 8, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#fee2e2'; // Red-100 center
            ctx.beginPath();
            ctx.arc(0, 0, 3, 0, Math.PI * 2);
            ctx.fill();

            // Rotating head
            if (isRunning) {
                lidarAngle.current += 0.15;
                ctx.save();
                ctx.rotate(lidarAngle.current);
                ctx.fillStyle = '#b91c1c';
                ctx.fillRect(-2, -8, 4, 4);
                // Scan Ray
                ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(0, -8);
                ctx.lineTo(0, -80);
                ctx.stroke();

                // Simulated Points
                ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
                ctx.beginPath();
                ctx.arc(0, -80, 2, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        }

        // Infrared (Bottom Line Trackers)
        if (config.sensors.includes('infrared')) {
            ctx.fillStyle = '#f43f5e'; // Rose
            ctx.fillRect(8, 12, 4, 4); // Right
            ctx.fillRect(8, -16, 4, 4); // Left

            if (isRunning) {
                ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
                ctx.beginPath();
                ctx.arc(10, 14, 4, 0, Math.PI * 2);
                ctx.arc(10, -14, 4, 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }

    ctx.restore();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize handling
    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        draw(ctx, canvas.width, canvas.height);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Animation Loop
    let commandIndex = 0;
    let progress = 0;
    let currentCommand = null;
    let startX = robotState.current.x;
    let startY = robotState.current.y;
    let startAngle = robotState.current.angle;

    const animate = () => {
      if (isRunning && commandIndex < codeOutput.length) {
         currentCommand = codeOutput[commandIndex];
         
         // Simple linear interpolation for movement
         if (progress < 1) {
             progress += 0.05; // Speed
             
             if (currentCommand.type === 'move_forward') {
                 const dist = currentCommand.value;
                 const rad = (startAngle * Math.PI) / 180;
                 robotState.current.x = startX + (Math.cos(rad) * dist * progress);
                 robotState.current.y = startY + (Math.sin(rad) * dist * progress);
             } else if (currentCommand.type === 'turn_right') {
                 robotState.current.angle = startAngle + (currentCommand.value * progress);
             } else if (currentCommand.type === 'turn_left') {
                 robotState.current.angle = startAngle - (currentCommand.value * progress);
             }
         } else {
             // Command finished, setup next
             startX = robotState.current.x;
             startY = robotState.current.y;
             startAngle = robotState.current.angle;
             progress = 0;
             commandIndex++;
         }
      }

      draw(ctx, canvas.width, canvas.height);
      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [isRunning, codeOutput, config, gridSize]);

  // Reset Logic
  useEffect(() => {
    if (!isRunning && codeOutput.length === 0) {
      robotState.current = { ...startPosition };
      const canvas = canvasRef.current;
      if (canvas) {
          const ctx = canvas.getContext('2d');
          if(ctx) draw(ctx, canvas.width, canvas.height);
      }
    }
  }, [isRunning, codeOutput, startPosition, config]);

  return (
    <div className="relative w-full h-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <div className="px-3 py-1 bg-slate-900/80 backdrop-blur rounded text-xs text-slate-400 font-mono border border-slate-700">
           X: {Math.round(robotState.current.x)} Y: {Math.round(robotState.current.y)} {config?.name ? `| ${config.name}` : ''}
        </div>
      </div>

      <div className="absolute top-4 right-4 z-10 flex gap-2">
         <button onClick={resetSimulation} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors border border-slate-600">
            <RefreshCw size={18} />
         </button>
      </div>
      
      {/* Overlay when not running */}
      {!isRunning && codeOutput.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
             <div className="bg-slate-900/80 backdrop-blur border border-slate-600 px-6 py-3 rounded-xl flex items-center gap-3">
                 <Play className="text-emerald-500 animate-pulse" size={20} />
                 <span className="text-slate-200">الروبوت جاهز للتشغيل</span>
             </div>
          </div>
      )}

      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default SimulationViewport;