import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import CodeEditor from './components/CodeEditor';
import SimulationViewport from './components/SimulationViewport';
import Simulation3D from './components/Simulation3D';
import BotChat from './components/BotChat';
import RobotBuilder from './components/RobotBuilder';
import LandingPage from './components/LandingPage';
import TrainerDashboard from './components/TrainerDashboard';
import { View, Challenge, RobotConfig } from './types';
import { Bot, Cpu, Sliders, Box, Layers } from 'lucide-react';

const INITIAL_CODE = `# برمجة حركة الروبوت
# المهمة: تحرك للأمام ثم انعطف لليمين

def run_robot():
    robot.move_forward(100)
    robot.turn_right(90)
    robot.move_forward(50)
    
run_robot()
`;

const INITIAL_CHALLENGES: Challenge[] = [
  { id: 1, title: 'التحرك في المربع', description: 'برمج الروبوت ليتحرك في مسار مربع الشكل.', difficulty: 'Easy', completed: true },
  { id: 2, title: 'تفادي العقبات', description: 'استخدم حساس المسافة لتجنب الجدار.', difficulty: 'Medium', completed: false },
  { id: 3, title: 'اتباع الخط الأسود', description: 'استخدم حساسات الأشعة تحت الحمراء.', difficulty: 'Hard', completed: false },
];

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [code, setCode] = useState(INITIAL_CODE);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [simCommands, setSimCommands] = useState<any[]>([]);
  const [is3DMode, setIs3DMode] = useState(false);
  
  const [robotConfig, setRobotConfig] = useState<RobotConfig>({
    name: 'المستكشف 1',
    type: 'rover',
    sensors: ['ultrasonic'],
    sensorConfig: {
      ultrasonic: { range: 200 },
      infrared: { sensitivity: 50 },
      color: { illumination: true },
      gyro: { axis: '3-axis' },
      camera: { resolution: '720p' },
      lidar: { range: 8, sampleRate: 4000 },
      imu: { accelRange: '4g', gyroRange: '500dps' }
    },
    color: '#10b981'
  });

  const handleRunCode = () => {
    setIsRunning(true);
    setLogs([]);
    setSimCommands([]);
    
    // Simple parser simulation to extract commands for visualization
    const commands: any[] = [];
    const lines = code.split('\n');
    const newLogs: string[] = [
      'Compiling script...', 
      `Loading config: ${robotConfig.name} (${robotConfig.type})...`,
      'Uploading to Robot Virtual Controller...'
    ];

    setTimeout(() => {
        lines.forEach(line => {
            if (line.includes('move_forward')) {
                const val = line.match(/\d+/);
                if (val) {
                    commands.push({ type: 'move_forward', value: parseInt(val[0]) });
                    newLogs.push(`[EXEC] Motor A/B Speed 100 duration ${val[0]}ms`);
                }
            } else if (line.includes('turn_right')) {
                const val = line.match(/\d+/);
                if (val) {
                    commands.push({ type: 'turn_right', value: parseInt(val[0]) });
                    newLogs.push(`[EXEC] Gyro Target ${val[0]} deg`);
                }
            } else if (line.includes('turn_left')) {
                const val = line.match(/\d+/);
                if (val) {
                    commands.push({ type: 'turn_left', value: parseInt(val[0]) });
                    newLogs.push(`[EXEC] Gyro Target -${val[0]} deg`);
                }
            }
        });

        if (commands.length === 0) {
            newLogs.push('[WARN] No valid movement commands found.');
        } else {
            newLogs.push('[SUCCESS] Execution complete.');
        }

        setSimCommands(commands);
        setLogs(newLogs);
        
        // Stop running state after animation duration (simulated)
        setTimeout(() => {
            setIsRunning(false);
        }, commands.length * 1000 + 500);

    }, 800);
  };

  // If on Landing Page, render only LandingPage component
  if (currentView === View.LANDING) {
    return <LandingPage onStart={() => setCurrentView(View.DASHBOARD)} />;
  }

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard challenges={INITIAL_CHALLENGES} />;
      
      case View.TRAINER_DASHBOARD:
        return <TrainerDashboard />;

      case View.EDITOR:
      case View.SIMULATION:
        // Combined view for editing and simulation
        return (
          <div className="h-screen p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fadeIn">
            <div className="h-full flex flex-col gap-4">
               {/* Editor Section */}
               <div className="flex-1">
                 <CodeEditor 
                    code={code} 
                    setCode={setCode} 
                    onRun={handleRunCode} 
                    isRunning={isRunning} 
                    logs={logs}
                 />
               </div>
            </div>
            <div className="h-full flex flex-col gap-4">
                {/* Simulation Header with Toggle */}
                <div className="flex items-center justify-between bg-slate-900 p-2 rounded-xl border border-slate-700">
                   <h3 className="text-sm font-bold text-white px-2 flex items-center gap-2">
                     {is3DMode ? <Box size={16} className="text-emerald-500" /> : <Layers size={16} className="text-emerald-500" />}
                     {is3DMode ? 'المحاكاة ثلاثية الأبعاد (3D)' : 'المحاكاة ثنائية الأبعاد (2D)'}
                   </h3>
                   <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700/50">
                      <button 
                        onClick={() => setIs3DMode(false)}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${!is3DMode ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                      >
                        2D
                      </button>
                      <button 
                        onClick={() => setIs3DMode(true)}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${is3DMode ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                      >
                        3D
                      </button>
                   </div>
                </div>

                {/* Simulation Section */}
                <div className="flex-1 min-h-[400px]">
                   {is3DMode ? (
                      <Simulation3D
                        config={robotConfig}
                        isRunning={isRunning} 
                        codeOutput={simCommands} 
                        resetSimulation={() => setSimCommands([])}
                        startPosition={{ x: 200, y: 200, angle: 0 }}
                      />
                   ) : (
                      <SimulationViewport 
                        config={robotConfig}
                        isRunning={isRunning} 
                        codeOutput={simCommands} 
                        resetSimulation={() => setSimCommands([])}
                        startPosition={{ x: 100, y: 100, angle: 0 }}
                      />
                   )}
                </div>

                {/* Hardware Status (Simulated) */}
                <div className="h-48 bg-slate-900 border border-slate-700 rounded-2xl p-4 flex gap-4 overflow-x-auto">
                    <div className="min-w-[150px] bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Cpu size={16} className="text-emerald-400" />
                            <span className="text-xs font-bold text-slate-300">المعالج</span>
                        </div>
                        <div className="text-2xl font-mono text-white">42<span className="text-xs text-slate-500">%</span></div>
                    </div>
                    <div className="min-w-[150px] bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Sliders size={16} className="text-cyan-400" />
                            <span className="text-xs font-bold text-slate-300">البطارية</span>
                        </div>
                        <div className="text-2xl font-mono text-white">88<span className="text-xs text-slate-500">%</span></div>
                        <div className="w-full h-1 bg-slate-700 mt-2 rounded-full overflow-hidden">
                            <div className="w-[88%] h-full bg-cyan-500"></div>
                        </div>
                    </div>
                    <div className="min-w-[150px] bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                        <div className="flex items-center gap-2 mb-2">
                            <Bot size={16} className="text-amber-400" />
                            <span className="text-xs font-bold text-slate-300">المحركات</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>L: {isRunning ? '100' : '0'}</span>
                            <span>R: {isRunning ? '100' : '0'}</span>
                        </div>
                    </div>
                    {/* Active Sensors Status */}
                    {robotConfig.sensors.length > 0 && (
                      <div className="min-w-[150px] bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
                          <div className="flex items-center gap-2 mb-2">
                              <Cpu size={16} className="text-indigo-400" />
                              <span className="text-xs font-bold text-slate-300">الحساسات</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-1">
                              {robotConfig.sensors.map(s => (
                                <span key={s} className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">{s}</span>
                              ))}
                          </div>
                      </div>
                    )}
                </div>
            </div>
          </div>
        );

      case View.BUILDER:
         return (
           <RobotBuilder 
             config={robotConfig} 
             setConfig={setRobotConfig} 
             onSave={() => {
               alert('تم حفظ تكوين الروبوت بنجاح!');
               setCurrentView(View.EDITOR);
             }} 
           />
         );

      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-cairo overflow-hidden">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 relative overflow-y-auto overflow-x-hidden">
        {renderContent()}
      </main>
      
      <BotChat />
    </div>
  );
}