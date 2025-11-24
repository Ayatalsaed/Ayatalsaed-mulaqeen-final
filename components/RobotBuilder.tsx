import React from 'react';
import { 
  Wifi, 
  Eye, 
  Activity, 
  Compass, 
  Video, 
  Cpu, 
  Zap, 
  Scale, 
  Save, 
  Box, 
  Disc,
  Settings2,
  Radar,
  Crosshair,
  RotateCcw,
  Info,
  CheckCircle2,
  Map,
  Scan
} from 'lucide-react';
import { RobotConfig, SensorType } from '../types';

interface RobotBuilderProps {
  config: RobotConfig;
  setConfig: (config: RobotConfig) => void;
  onSave: () => void;
}

type SensorCategory = 'distance' | 'vision' | 'navigation';

const SENSORS: { 
  id: SensorType; 
  name: string; 
  desc: string; 
  icon: any; 
  power: number; 
  weight: number;
  category: SensorCategory;
}[] = [
  { 
    id: 'ultrasonic', 
    name: 'حساس موجات فوق صوتية', 
    desc: 'لقياس المسافة وتجنب العقبات.', 
    icon: Wifi, 
    power: 5, 
    weight: 10,
    category: 'distance'
  },
  { 
    id: 'lidar', 
    name: 'LiDAR ماسح ضوئي', 
    desc: 'لرسم الخرائط وبناء بيئة ثلاثية الأبعاد (SLAM).', 
    icon: Radar, 
    power: 45, 
    weight: 160,
    category: 'distance'
  },
  { 
    id: 'infrared', 
    name: 'حساس تتبع الخط', 
    desc: 'للتعرف على الخطوط الأرضية (أسود/أبيض).', 
    icon: Activity, 
    power: 3, 
    weight: 5,
    category: 'distance'
  },
  { 
    id: 'camera', 
    name: 'كاميرا AI', 
    desc: 'للتعرف على الأشكال والوجوه (متقدم).', 
    icon: Video, 
    power: 15, 
    weight: 25,
    category: 'vision'
  },
  { 
    id: 'color', 
    name: 'حساس ألوان', 
    desc: 'للتعرف على ألوان الأجسام والأسطح.', 
    icon: Eye, 
    power: 4, 
    weight: 8,
    category: 'vision'
  },
  { 
    id: 'imu', 
    name: 'وحدة IMU (القصور الذاتي)', 
    desc: 'دمج التسارع والجيروسكوب لتحديد الحركة والتوجه بدقة عالية.', 
    icon: Crosshair, 
    power: 8, 
    weight: 5,
    category: 'navigation'
  },
  { 
    id: 'gyro', 
    name: 'جيروسكوب', 
    desc: 'لتحديد الاتجاه وزوايا الدوران بدقة.', 
    icon: Compass, 
    power: 2, 
    weight: 5,
    category: 'navigation'
  }
];

const CATEGORY_LABELS: Record<SensorCategory, { label: string; icon: any }> = {
  distance: { label: 'المسافة والاستشعار', icon: Scan },
  vision: { label: 'الرؤية والذكاء', icon: Eye },
  navigation: { label: 'الملاحة والحركة', icon: Map },
};

const DEFAULT_CONFIGS: Partial<Record<SensorType, any>> = {
  ultrasonic: { range: 200 },
  infrared: { sensitivity: 50 },
  color: { illumination: true },
  gyro: { axis: '3-axis' },
  camera: { resolution: '720p' },
  lidar: { range: 8, sampleRate: 4000 },
  imu: { accelRange: '4g', gyroRange: '500dps' }
};

// --- Helper UI Components ---

const ConfigSlider = ({ label, value, min, max, step = 1, unit, onChange, leftLabel, rightLabel }: any) => (
  <div className="space-y-3 bg-slate-900/30 p-3 rounded-xl border border-slate-800/50">
    <div className="flex justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1 font-medium">{label}</span>
        <span className="text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            {value} {unit}
        </span>
    </div>
    <div className="relative pt-1">
        <input 
            type="range" 
            min={min} max={max} step={step}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 hover:accent-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
        />
        <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-1">
            <span>{leftLabel || `${min}${unit}`}</span>
            <span>{rightLabel || `${max}${unit}`}</span>
        </div>
    </div>
  </div>
);

const ConfigSelect = ({ label, options, value, onChange }: any) => (
  <div className="space-y-2 bg-slate-900/30 p-3 rounded-xl border border-slate-800/50">
    <span className="text-xs text-slate-400 font-medium block">{label}</span>
    <div className="bg-slate-900 rounded-lg p-1 flex gap-1 border border-slate-700/50">
        {options.map((opt: string) => (
            <button
                key={opt}
                onClick={() => onChange(opt)}
                className={`flex-1 py-1.5 text-xs rounded font-medium transition-all focus:outline-none ${
                    value === opt 
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
            >
                {opt}
            </button>
        ))}
    </div>
  </div>
);

const ConfigToggle = ({ label, value, onChange }: any) => (
  <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-xl border border-slate-800/50 hover:border-slate-700 transition-colors">
    <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full transition-colors ${value ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}></div>
        <span className="text-xs text-slate-300 font-medium">{label}</span>
    </div>
    <button 
        onClick={() => onChange(!value)}
        className={`w-9 h-5 rounded-full flex items-center p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${value ? 'bg-emerald-600' : 'bg-slate-700'}`}
    >
        <div className={`w-3 h-3 bg-white rounded-full transition-transform duration-300 shadow-sm ${value ? 'translate-x-4' : 'translate-x-0'}`}></div>
    </button>
  </div>
);

const RobotBuilder: React.FC<RobotBuilderProps> = ({ config, setConfig, onSave }) => {
  
  const toggleSensor = (id: SensorType) => {
    const isAdding = !config.sensors.includes(id);
    const newSensors = isAdding
      ? [...config.sensors, id]
      : config.sensors.filter(s => s !== id);
    
    // Initialize default config if not present when selecting
    let newSensorConfig = { ...config.sensorConfig };
    
    if (isAdding) {
      const key = id as keyof typeof config.sensorConfig;
      if (!newSensorConfig[key] && DEFAULT_CONFIGS[id]) {
         // @ts-ignore
         newSensorConfig[key] = DEFAULT_CONFIGS[id];
      }
    }

    setConfig({ ...config, sensors: newSensors, sensorConfig: newSensorConfig });
  };

  const updateSensorConfig = (id: SensorType, key: string, value: any) => {
    setConfig({
        ...config,
        sensorConfig: {
            ...config.sensorConfig,
            [id]: {
                ...config.sensorConfig[id as keyof typeof config.sensorConfig],
                [key]: value
            }
        }
    });
  };

  const resetSensorConfig = (id: SensorType, e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (DEFAULT_CONFIGS[id]) {
        setConfig({
          ...config,
          sensorConfig: {
              ...config.sensorConfig,
              [id]: DEFAULT_CONFIGS[id]
          }
        });
    }
  };

  // Calculate stats
  const totalPower = SENSORS.filter(s => config.sensors.includes(s.id)).reduce((acc, curr) => acc + curr.power, 20); 
  const totalWeight = SENSORS.filter(s => config.sensors.includes(s.id)).reduce((acc, curr) => acc + curr.weight, 500); 

  return (
    <div className="h-full p-4 lg:p-8 animate-fadeIn overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">ورشة بناء الروبوت</h2>
            <p className="text-slate-400">صمم الروبوت الخاص بك، اختر الهيكل والحساسات المناسبة للمهمة.</p>
          </div>
          <button 
            onClick={onSave}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
          >
            <Save size={20} />
            <span>حفظ التكوين</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Robot Preview & Base Config */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Name & Type Card */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
               <div className="mb-4">
                 <label className="block text-slate-400 text-sm mb-2 font-medium">اسم الروبوت</label>
                 <input 
                    type="text" 
                    value={config.name}
                    onChange={(e) => setConfig({...config, name: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-600"
                    placeholder="أدخل اسماً مميزاً..."
                 />
               </div>

               <div>
                 <label className="block text-slate-400 text-sm mb-2 font-medium">نوع الهيكل</label>
                 <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'rover', label: 'عربة', icon: Box },
                      { id: 'arm', label: 'ذراع', icon: Zap },
                      { id: 'drone', label: 'طائرة', icon: Disc },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setConfig({...config, type: type.id as any})}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                          config.type === type.id 
                            ? 'bg-emerald-600/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)] scale-[1.02]' 
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <type.icon size={22} className="mb-1" />
                        <span className="text-xs font-bold">{type.label}</span>
                      </button>
                    ))}
                 </div>
               </div>
            </div>

            {/* Visual Preview (Abstract) */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 flex items-center justify-center relative min-h-[300px] overflow-hidden group">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
               
               <div className="w-48 h-48 bg-slate-800 rounded-3xl border-2 border-slate-700 relative flex items-center justify-center shadow-2xl z-10 transition-transform duration-500 group-hover:scale-105">
                  {/* Wheels */}
                  <div className="absolute -left-4 top-4 w-4 h-12 bg-slate-700 rounded-l-lg border-l border-t border-b border-slate-600"></div>
                  <div className="absolute -left-4 bottom-4 w-4 h-12 bg-slate-700 rounded-l-lg border-l border-t border-b border-slate-600"></div>
                  <div className="absolute -right-4 top-4 w-4 h-12 bg-slate-700 rounded-r-lg border-r border-t border-b border-slate-600"></div>
                  <div className="absolute -right-4 bottom-4 w-4 h-12 bg-slate-700 rounded-r-lg border-r border-t border-b border-slate-600"></div>
                  
                  {/* Body */}
                  <div className="text-slate-500 font-mono text-xs text-center">
                     <Cpu size={48} className="mx-auto mb-2 opacity-30 text-emerald-500" />
                     <span className="opacity-70 tracking-widest uppercase">{config.name || 'ROBOT'}</span>
                  </div>

                  {/* Mounted Sensors Visualization */}
                  {config.sensors.includes('ultrasonic') && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-500/20 border border-indigo-500 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20" title="Ultrasonic">
                      <Wifi size={16} className="text-indigo-400" />
                    </div>
                  )}

                  {config.sensors.includes('lidar') && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-500/20 border border-red-500 p-2 rounded-full z-10 animate-pulse shadow-lg shadow-red-500/20" title="LiDAR">
                      <Radar size={20} className="text-red-400" />
                    </div>
                  )}
                  
                  {config.sensors.includes('infrared') && (
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                       <div className="bg-rose-500/20 border border-rose-500 p-1.5 rounded-lg shadow-lg shadow-rose-500/20">
                         <Activity size={16} className="text-rose-400" />
                       </div>
                    </div>
                  )}

                  {config.sensors.includes('color') && (
                    <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-amber-500/20 border border-amber-500 p-1.5 rounded-lg shadow-lg shadow-amber-500/20">
                      <Eye size={16} className="text-amber-400" />
                    </div>
                  )}

                  {config.sensors.includes('imu') && (
                    <div className="absolute bottom-2 right-2 bg-blue-500/20 border border-blue-500 p-1 rounded shadow-lg shadow-blue-500/20" title="IMU">
                      <Crosshair size={12} className="text-blue-400" />
                    </div>
                  )}
               </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-500 shadow-sm shadow-yellow-500/10">
                    <Zap size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">الطاقة</div>
                    <div className="font-bold text-slate-200">{totalPower} <span className="text-[10px] text-slate-500">mAh</span></div>
                  </div>
               </div>
               <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm shadow-blue-500/10">
                    <Scale size={20} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-medium">الوزن</div>
                    <div className="font-bold text-slate-200">{totalWeight} <span className="text-[10px] text-slate-500">g</span></div>
                  </div>
               </div>
            </div>

          </div>

          {/* Right Column: Sensor Selection */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Cpu className="text-emerald-500" />
                  تكوين الحساسات والمستشعرات
               </h3>
            </div>

            <div className="space-y-8">
               {(Object.keys(CATEGORY_LABELS) as SensorCategory[]).map((category) => (
                  <div key={category} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-sm uppercase tracking-wide border-b border-slate-800/50 pb-2">
                         {React.createElement(CATEGORY_LABELS[category].icon, { size: 16 })}
                         {CATEGORY_LABELS[category].label}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {SENSORS.filter(s => s.category === category).map((sensor) => {
                            const isSelected = config.sensors.includes(sensor.id);
                            return (
                            <div 
                                key={sensor.id}
                                className={`relative rounded-2xl border-2 transition-all duration-300 flex flex-col ${
                                isSelected 
                                    ? 'bg-slate-800 border-emerald-500 shadow-xl shadow-emerald-900/10 scale-[1.01]' 
                                    : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                                }`}
                            >
                                <div className="p-5 pb-2 cursor-pointer flex-1" onClick={() => toggleSensor(sensor.id)}>
                                    <div className="flex items-start justify-between mb-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                                        isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                                    }`}>
                                        <sensor.icon size={24} />
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                        isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-600 bg-transparent'
                                    }`}>
                                        {isSelected && <CheckCircle2 size={14} className="text-white" />}
                                    </div>
                                    </div>
                                    
                                    <h4 className={`text-lg font-bold mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                    {sensor.name}
                                    </h4>
                                    <p className="text-sm text-slate-400 leading-relaxed min-h-[2.5em]">
                                    {sensor.desc}
                                    </p>
                                    
                                    <div className="flex items-center gap-3 text-xs font-mono text-slate-500 mt-4 mb-2">
                                        <span className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded">
                                            <Zap size={10} className="text-yellow-500" /> {sensor.power}mA
                                        </span>
                                        <span className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded">
                                            <Scale size={10} className="text-blue-400" /> {sensor.weight}g
                                        </span>
                                    </div>
                                </div>

                                {/* Sensor Specific Configurations Panel */}
                                {isSelected && (
                                    <div onClick={(e) => e.stopPropagation()} className="mt-2 pt-4 px-5 pb-5 bg-slate-950/40 rounded-b-2xl border-t border-slate-700/50 animate-fadeIn cursor-default">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                                <Settings2 size={12} />
                                                تخصيص {sensor.name}
                                            </div>
                                            <button 
                                                onClick={(e) => resetSensorConfig(sensor.id, e)} 
                                                className="text-slate-500 hover:text-white transition-colors bg-slate-800 p-1 rounded hover:bg-slate-700" 
                                                title="إعادة تعيين للافتراضي"
                                            >
                                                <RotateCcw size={12} />
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-4">
                                            {sensor.id === 'ultrasonic' && (
                                                <ConfigSlider 
                                                    label="أقصى مدى قياس"
                                                    value={config.sensorConfig.ultrasonic?.range || 200}
                                                    min={50} max={400} step={10} unit="cm"
                                                    onChange={(v: number) => updateSensorConfig('ultrasonic', 'range', v)}
                                                />
                                            )}

                                            {sensor.id === 'infrared' && (
                                                <ConfigSlider 
                                                    label="حساسية الاستشعار"
                                                    value={config.sensorConfig.infrared?.sensitivity || 50}
                                                    min={0} max={100} unit="%"
                                                    onChange={(v: number) => updateSensorConfig('infrared', 'sensitivity', v)}
                                                    leftLabel="منخفض" rightLabel="عالي"
                                                />
                                            )}

                                            {sensor.id === 'color' && (
                                                <ConfigToggle 
                                                    label="تشغيل إضاءة LED مساعدة"
                                                    value={config.sensorConfig.color?.illumination}
                                                    onChange={(v: boolean) => updateSensorConfig('color', 'illumination', v)}
                                                />
                                            )}

                                            {sensor.id === 'gyro' && (
                                                <ConfigSelect 
                                                    label="عدد المحاور"
                                                    options={['3-axis', '6-axis']}
                                                    value={config.sensorConfig.gyro?.axis}
                                                    onChange={(v: any) => updateSensorConfig('gyro', 'axis', v)}
                                                />
                                            )}

                                            {sensor.id === 'camera' && (
                                                <ConfigSelect 
                                                    label="دقة الصورة"
                                                    options={['720p', '1080p']}
                                                    value={config.sensorConfig.camera?.resolution}
                                                    onChange={(v: any) => updateSensorConfig('camera', 'resolution', v)}
                                                />
                                            )}

                                            {sensor.id === 'lidar' && (
                                                <>
                                                    <ConfigSlider 
                                                        label="مدى المسح"
                                                        value={config.sensorConfig.lidar?.range || 8}
                                                        min={4} max={20} unit="m"
                                                        onChange={(v: number) => updateSensorConfig('lidar', 'range', v)}
                                                    />
                                                    <ConfigSlider 
                                                        label="معدل العينات"
                                                        value={config.sensorConfig.lidar?.sampleRate || 4000}
                                                        min={2000} max={8000} step={1000} unit="Hz"
                                                        onChange={(v: number) => updateSensorConfig('lidar', 'sampleRate', v)}
                                                    />
                                                </>
                                            )}

                                            {sensor.id === 'imu' && (
                                                <>
                                                    <ConfigSelect 
                                                        label="مدى التسارع (Accelerometer)"
                                                        options={['2g', '4g', '8g']}
                                                        value={config.sensorConfig.imu?.accelRange}
                                                        onChange={(v: any) => updateSensorConfig('imu', 'accelRange', v)}
                                                    />
                                                    <ConfigSelect 
                                                        label="مدى الجيروسكوب (Gyroscope)"
                                                        options={['250dps', '500dps']}
                                                        value={config.sensorConfig.imu?.gyroRange}
                                                        onChange={(v: any) => updateSensorConfig('imu', 'gyroRange', v)}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            );
                        })}
                      </div>
                  </div>
               ))}
            </div>
            
            <div className="mt-6 bg-indigo-900/20 border border-indigo-500/30 p-4 rounded-xl flex items-start gap-3 shadow-lg shadow-indigo-900/10">
               <div className="mt-1 text-indigo-400"><Video size={20} /></div>
               <div>
                 <h4 className="font-bold text-indigo-200 text-sm">نصيحة المعلم الذكي</h4>
                 <p className="text-xs text-indigo-300/80 mt-1 leading-relaxed">
                   إضافة الكاميرا أو LiDAR تستهلك طاقة عالية وتزيد وزن الروبوت، مما قد يؤثر على سرعة الحركة. إذا كانت مهمتك بسيطة، اكتفِ بالحساسات الأساسية لتوفير الموارد.
                 </p>
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RobotBuilder;