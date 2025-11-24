import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { RobotConfig } from '../types';
import { RefreshCw, Play } from 'lucide-react';

// Augment JSX namespace to include React Three Fiber elements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      cylinderGeometry: any;
      ringGeometry: any;
      meshBasicMaterial: any;
      sphereGeometry: any;
      ambientLight: any;
      directionalLight: any;
    }
  }
}

// Augment React.JSX namespace for React 18+ compatibility
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      boxGeometry: any;
      meshStandardMaterial: any;
      cylinderGeometry: any;
      ringGeometry: any;
      meshBasicMaterial: any;
      sphereGeometry: any;
      ambientLight: any;
      directionalLight: any;
    }
  }
}

interface Simulation3DProps {
  config?: RobotConfig;
  isRunning: boolean;
  codeOutput: any[]; // Simulated commands
  resetSimulation: () => void;
  startPosition?: { x: number; y: number; angle: number };
  gridSize?: number;
}

const Robot3D = ({ config, isRunning, codeOutput, startPosition }: any) => {
  const groupRef = useRef<THREE.Group>(null);
  const [commandIndex, setCommandIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // State to track current position between commands
  const positionRef = useRef({ x: 0, z: 0, angle: 0 });

  // Initialize position
  useEffect(() => {
    if (groupRef.current && startPosition) {
        // Convert 2D (x, y) to 3D (x, z). In 3D, Y is up.
        // Also scale down: 100px = 5 units in 3D
        const scale = 0.05;
        positionRef.current = {
            x: (startPosition.x - 200) * scale, // Center offset
            z: (startPosition.y - 200) * scale,
            angle: -startPosition.angle * (Math.PI / 180) // Invert angle for 3D coord system
        };
        groupRef.current.position.set(positionRef.current.x, 0.5, positionRef.current.z);
        groupRef.current.rotation.y = positionRef.current.angle;
        setCommandIndex(0);
        setProgress(0);
    }
  }, [startPosition, isRunning]);

  useFrame((state, delta) => {
    if (!isRunning || !groupRef.current) return;
    if (commandIndex >= codeOutput.length) return;

    const currentCommand = codeOutput[commandIndex];
    const speed = delta * 2; // Animation speed

    if (currentCommand.type === 'move_forward') {
        const dist = currentCommand.value * 0.05; // Scale
        const step = dist * speed; 
        
        // Accumulate progress
        const nextProgress = progress + speed;
        
        // Simple kinematic update
        const moveDist = (dist * speed); 
        groupRef.current.position.x += Math.cos(positionRef.current.angle) * moveDist;
        groupRef.current.position.z += Math.sin(positionRef.current.angle) * moveDist;
        
        positionRef.current.x = groupRef.current.position.x;
        positionRef.current.z = groupRef.current.position.z;

    } else if (currentCommand.type === 'turn_right') {
        const angleRad = currentCommand.value * (Math.PI / 180);
        const rotateStep = angleRad * speed;
        
        groupRef.current.rotation.y -= rotateStep;
        positionRef.current.angle -= rotateStep;

    } else if (currentCommand.type === 'turn_left') {
        const angleRad = currentCommand.value * (Math.PI / 180);
        const rotateStep = angleRad * speed;
        
        groupRef.current.rotation.y += rotateStep;
        positionRef.current.angle += rotateStep;
    }

    setProgress(prev => prev + speed);

    if (progress >= 1) {
        setCommandIndex(prev => prev + 1);
        setProgress(0);
    }
  });

  const robotColor = config?.color || '#10b981';

  return (
    <group ref={groupRef} position={[0, 0.5, 0]}>
      {/* Chassis */}
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.5, 2]} />
        <meshStandardMaterial color={robotColor} />
      </mesh>
      
      {/* Wheels */}
      <mesh position={[0.8, 0, 0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-0.8, 0, 0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0.8, 0, -0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-0.8, 0, -0.6]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {/* Direction Indicator */}
      <mesh position={[0.4, 0.46, 0]} rotation={[0,0,0]}>
         <boxGeometry args={[0.5, 0.1, 0.2]} />
         <meshStandardMaterial color="white" />
      </mesh>

      {/* Sensors */}
      {config?.sensors.includes('lidar') && (
         <group position={[0, 0.6, 0]}>
            <mesh castShadow>
                <cylinderGeometry args={[0.2, 0.2, 0.4, 16]} />
                <meshStandardMaterial color="#ef4444" />
            </mesh>
            {isRunning && (
                <mesh rotation={[0, 0, Math.PI / 2]}>
                   <ringGeometry args={[0.3, 8, 32, 1, 0, 0.5]} />
                   <meshBasicMaterial color="#ef4444" opacity={0.2} transparent side={THREE.DoubleSide} />
                </mesh>
            )}
         </group>
      )}

      {config?.sensors.includes('camera') && (
         <mesh position={[0.8, 0.3, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <boxGeometry args={[0.2, 0.2, 0.1]} />
            <meshStandardMaterial color="#000" />
            <mesh position={[0, 0.1, 0]}>
                <sphereGeometry args={[0.08]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.2} metalness={0.8} />
            </mesh>
         </mesh>
      )}
    </group>
  );
};

const SceneContent = ({ config, isRunning, codeOutput, startPosition }: any) => {
    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[1024, 1024]} />
            <Grid infiniteGrid sectionColor="#475569" cellColor="#334155" fadeDistance={30} sectionThickness={1} cellThickness={0.5} />
            
            <Robot3D 
                config={config} 
                isRunning={isRunning} 
                codeOutput={codeOutput} 
                startPosition={startPosition} 
            />

            {/* Obstacles */}
            <mesh position={[0, 1, 5]} castShadow receiveShadow>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial color="#64748b" />
            </mesh>
            <mesh position={[5, 1, 0]} castShadow receiveShadow>
                <boxGeometry args={[2, 2, 6]} />
                <meshStandardMaterial color="#64748b" />
            </mesh>

            <ContactShadows resolution={1024} scale={50} blur={2} opacity={0.5} far={10} color="#000000" />
            <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 2.2} />
        </>
    );
};

const Simulation3D: React.FC<Simulation3DProps> = ({ 
  config, 
  isRunning, 
  codeOutput, 
  resetSimulation, 
  startPosition = { x: 50, y: 50, angle: 0 } 
}) => {
  return (
    <div className="relative w-full h-full bg-slate-950 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
       <div className="absolute top-4 left-4 z-10 flex gap-2">
         <div className="px-3 py-1 bg-slate-900/80 backdrop-blur rounded text-xs text-slate-400 font-mono border border-slate-700">
             3D Environment
         </div>
       </div>

       <div className="absolute top-4 right-4 z-10 flex gap-2">
         <button onClick={resetSimulation} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white transition-colors border border-slate-600">
            <RefreshCw size={18} />
         </button>
       </div>

       {!isRunning && codeOutput.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
             <div className="bg-slate-900/80 backdrop-blur border border-slate-600 px-6 py-3 rounded-xl flex items-center gap-3">
                 <Play className="text-emerald-500 animate-pulse" size={20} />
                 <span className="text-slate-200">الروبوت جاهز (3D)</span>
             </div>
          </div>
       )}

      <Canvas shadows camera={{ position: [10, 8, 10], fov: 45 }}>
        <SceneContent 
            config={config} 
            isRunning={isRunning} 
            codeOutput={codeOutput} 
            startPosition={startPosition} 
        />
      </Canvas>
    </div>
  );
};

export default Simulation3D;