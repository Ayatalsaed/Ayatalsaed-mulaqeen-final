
import React, { useState, Suspense, lazy, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import { View, Challenge, RobotConfig } from './types';
import { Bot, Cpu, Sliders, Box, Layers, Loader2 } from 'lucide-react';
import { db } from './services/db';

// Lazy Load Components
const Sidebar = lazy(() => import('./components/Sidebar'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const CodeEditor = lazy(() => import('./components/CodeEditor'));
const SimulationViewport = lazy(() => import('./components/SimulationViewport'));
const Simulation3D = lazy(() => import('./components/Simulation3D'));
const BotChat = lazy(() => import('./components/BotChat'));
const RobotBuilder = lazy(() => import('./components/RobotBuilder'));
const TrainerDashboard = lazy(() => import('./components/TrainerDashboard'));

const INITIAL_CODE = `# برمجة حركة الروبوت
# المهمة: تحرك للأمام ثم انعطف لليمين

def run_robot():
    robot.move_forward(100)
    robot.turn_right(90)
    robot.move_forward(50)
    
run_robot()
`;

const LoadingScreen = () => (
  <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 text-slate-300">
    <Loader2 className="h-10 w-10 animate-spin text-emerald-500 mb-4" />
    <p className="text-sm font-mono animate-pulse">جاري تحميل المعمل...</p>
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [code, setCode] = useState(INITIAL_CODE);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [simCommands, setSimCommands] = useState<any[]>([]);
  const [is3DMode, setIs3DMode] = useState(false);
  
  // State loaded from DB
  const [robotConfig, setRobotConfig] = useState<RobotConfig | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);

  // Load data on mount
  useEffect(() => {
    const config = db.getRobotConfig();
    const loadedChallenges = db.getChallenges();
    setRobotConfig(config);
    setChallenges(loadedChallenges);
  }, []);

  const handleSaveConfig = () => {
    if (robotConfig) {
      db.saveRobotConfig(robotConfig);
      // Create a JSON blob from the configuration
      const jsonString = JSON.stringify(robotConfig, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `${robotConfig.name.replace(/\s+/g, '_')}_config.json`;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Show confirmation and navigate
      alert(`تم حفظ التكوين في قاعدة البيانات المحلية وتحميل الملف: ${link.download}`);
      setCurrentView(View.EDITOR);
    }
  };

  const handleRunCode = () => {
    if (!robotConfig) return;
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

  // If on Landing Page, render only LandingPage component (Eager Load)
  if (currentView === View.LANDING) {
    return <LandingPage onStart={() => setCurrentView(View.DASHBOARD)} />;
  }

  // Wait for DB load
  if (!robotConfig) {
    return <LoadingScreen />;
  }

  const renderContent = () => {
    switch (currentView) {
      case View.DASHBOARD:
        return <Dashboard challenges={challenges} />;
      
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
             onSave={handleSaveConfig} 
           />
         );

      default:
        return <div>View not found</div>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 font-cairo overflow-hidden">
      <Suspense fallback={<LoadingScreen />}>
        <Sidebar currentView={currentView} setView={setCurrentView} />
        
        <main className="flex-1 relative overflow-y-auto overflow-x-hidden">
          {renderContent()}
        </main>
        
        <BotChat />
      </Suspense>
    </div>
  );
}
