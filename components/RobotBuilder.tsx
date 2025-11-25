import React, { useState } from 'react';
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
  Scan,
  ChevronDown,
  ChevronUp,
  Palette,
  Upload,
  X
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
  details: string;
  icon: any; 
  power: number; 
  weight: number;
  category: SensorCategory;
}[] = [
  { 
    id: 'ultrasonic', 
    name: 'حساس موجات فوق صوتية', 
    desc: 'لقياس المسافة وتجنب العقبات.', 
    details: 'يستخدم الأمواج الصوتية لقياس المسافة بدقة. مثالي لاكتشاف الجدران وتجنب الاصطدام في المتاهات والبيئات المغلقة.',
    icon: Wifi, 
    power: 5, 
    weight: 10,
    category: 'distance'
  },
  { 
    id: 'lidar', 
    name: 'LiDAR ماسح ضوئي', 
    desc: 'لرسم الخرائط وبناء بيئة ثلاثية الأبعاد (SLAM).', 
    details: 'يرسل نبضات ليزر سريعة لرسم خريطة نقطية للمحيط 360 درجة. يستخدم في القيادة الذاتية والملاحة المتقدمة (SLAM).',
    icon: Radar, 
    power: 45, 
    weight: 160,
    category: 'distance'
  },
  { 
    id: 'infrared', 
    name: 'حساس تتبع الخط', 
    desc: 'للتعرف على الخطوط الأرضية (أسود/أبيض).', 
    details: 'يكتشف الفرق في الانعكاس بين الألوان الفاتحة والداكنة على الأرض. أساسي لروبوتات تتبع المسار والخطوط.',
    icon: Activity, 
    power: 3, 
    weight: 5,
    category: 'distance'
  },
  { 
    id: 'camera', 
    name: 'كاميرا AI', 
    desc: 'للتعرف على الأشكال والوجوه (متقدم).', 
    details: 'تمنح الروبوت حاسة البصر. تستخدم مع الذكاء الاصطناعي للتعرف على الكائنات، قراءة العلامات، وتحديد الألوان المعقدة.',
    icon: Video, 
    power: 15, 
    weight: 25,
    category: 'vision'
  },
  { 
    id: 'color', 
    name: 'حساس ألوان', 
    desc: 'للتعرف على ألوان الأجسام والأسطح.', 
    details: 'يحلل مكونات الضوء (RGB) للأسطح القريبة. يستخدم لفرز المنتجات حسب اللون أو اتخاذ قرارات بناءً على لون الأرضية.',
    icon: Eye, 
    power: 4, 
    weight: 8,
    category: 'vision'
  },
  { 
    id: 'imu', 
    name: 'وحدة IMU (القصور الذاتي)', 
    desc: 'دمج التسارع والجيروسكوب لتحديد الحركة والتوجه بدقة عالية.', 
    details: 'تجمع بين مقياس التسارع والجيروسكوب. توفر بيانات دقيقة عن ميلان الروبوت، اهتزازه، وتسارعه الخطي.',
    icon: Crosshair, 
    power: 8, 
    weight: 5,
    category: 'navigation'
  },
  { 
    id: 'gyro', 
    name: 'جيروسكوب', 
    desc: 'لتحديد الاتجاه وزوايا الدوران بدقة.', 
    details: 'يقيس سرعة الدوران الزاوي. ضروري للحفاظ على استقامة حركة الروبوت وضمان انعطافات دقيقة بزوايا محددة.',
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
  camera: { resolution: '720p', illumination: false },
  lidar: { range: 8, sampleRate: 4000 },
  imu: { accelRange: '4g', gyroRange: '500dps' }
};

// --- Helper UI Components ---

const Tooltip = ({ text }: { text: string }) => (
  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-800 text-slate-200 text-xs rounded-lg border border-slate-700 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none text-center leading-relaxed font-medium">
    {text}
    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
  </div>
);

const ConfigSlider = ({ label, value, min, max, step = 1, unit, onChange, leftLabel, rightLabel, description }: any) => (
  <div className="space-y-3 bg-slate-900/30 p-3 rounded-xl border border-slate-800/50 hover:border-slate-700/50 transition-colors">
    <div className="flex justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 group relative">
            <span className="font-medium">{label}</span>
            {description && (
                <>
                    <Info size={12} className="text-slate-500 cursor-help hover:text-emerald-400 transition-colors" />
                    <Tooltip text={description} />
                </>
            )}
        </div>
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
        <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-1" dir="ltr">
            <span>{leftLabel || `${min}${unit}`}</span>
            <span>{rightLabel || `${max}${unit}`}</span>
        </div>
    </div>
  </div>
);

const ConfigSelect = ({ label, options, value, onChange, description, onReset }: any) => (
  <div className="space-y-2 bg-slate-900/30 p-3 rounded-xl border border-slate-800/50 hover:border-slate-700/50 transition-colors">
    <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5 group relative">
            <span className="text-xs text-slate-400 font-medium">{label}</span>
            {description && (
                <>
                    <Info size={12} className="text-slate-500 cursor-help hover:text-emerald-400 transition-colors" />
                    <Tooltip text={description} />
                </>
            )}
        </div>
        {onReset && (
             <button 
                onClick={(e) => { e.stopPropagation(); onReset(); }}
                className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-slate-700/50 rounded"
                title="إعادة تعيين القيمة"
             >
                <RotateCcw size={12} />
             </button>
        )}
    </div>
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

const ConfigDropdown = ({ label, options, value, onChange, description }: any) => (
  <div className="space-y-2 bg-slate-900/30 p-3 rounded-xl border border-slate-800/50 hover:border-slate-700/50 transition-colors">
    <div className="flex items-center gap-1.5 group relative mb-1">
        <span className="text-xs text-slate-400 font-medium">{label}</span>
        {description && (
            <>
                <Info size={12} className="text-slate-500 cursor-help hover:text-emerald-400 transition-colors" />
                <Tooltip text={description} />
            </>
        )}
    </div>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-900 text-slate-200 text-xs rounded-lg border border-slate-700/50 pl-8 pr-3 py-2.5 appearance-none focus:border-emerald-500 focus:outline-none transition-colors cursor-pointer"
      >
        {options.map((opt: string) => (
          <option key={opt} value={opt} className="bg-slate-900">{opt}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
    </div>
  </div>
);

const ConfigToggle = ({ label, value, onChange, description }: any) => (
  <div className="flex items-center justify-between p-3 bg-slate-900/30 rounded-xl border border-slate-800/50 hover:border-slate-700 transition-colors">
    <div className="flex items-center gap-2 group relative">
        <div className={`w-2 h-2 rounded-full transition-colors ${value ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}></div>
        <span className="text-xs text-slate-300 font-medium">{label}</span>
        {description && (
            <>
                <Info size={12} className="text-slate-500 cursor-help hover:text-emerald-400 transition-colors" />
                <Tooltip text={description} />
            </>
        )}
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
  
  const [expandedSensors, setExpandedSensors] = useState<SensorType[]>(config.sensors);

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
      // Auto expand on add
      setExpandedSensors(prev => [...prev, id]);
    } else {
      // Collapse on remove (optional, but cleaner)
      setExpandedSensors(prev => prev.filter(i => i !== id));
    }

    setConfig({ ...config, sensors: newSensors, sensorConfig: newSensorConfig });
  };

  const toggleAccordion = (id: SensorType, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedSensors(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
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
              [id]: { ...DEFAULT_CONFIGS[id] }
          }
        });
    }
  };

  const loadDefaults = () => {
    const typeDefaults: Record<string, SensorType[]> = {
        rover: ['ultrasonic', 'infrared', 'color'], 
        drone: ['lidar', 'gyro', 'imu', 'camera'],
        arm: ['camera', 'color', 'gyro'] 
    };

    const defaultSensors = typeDefaults[config.type] || ['ultrasonic'];

    // Deep copy default configs to avoid reference issues
    const newSensorConfig = { ...config.sensorConfig };
    
    // Reset active sensors to their defaults
    defaultSensors.forEach(s => {
        // @ts-ignore
        if (DEFAULT_CONFIGS[s]) {
             // @ts-ignore
             newSensorConfig[s] = { ...DEFAULT_CONFIGS[s] };
        }
    });

    setConfig({
        ...config,
        sensors: defaultSensors,
        sensorConfig: newSensorConfig
    });

    setExpandedSensors(defaultSensors);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setConfig({
          ...config,
          branding: {
            ...(config.branding || { primaryColor: config.color, secondaryColor: '#475569' }),
            logo: reader.result as string
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate stats
  const totalPower = SENSORS.filter(s => config.sensors.includes(s.id)).reduce((acc, curr) => acc + curr.power, 20); 
  const totalWeight = SENSORS.filter(s => config.sensors.includes(s.id)).reduce((acc, curr) => acc + curr.weight, 500); 

  const primaryColor = config.branding?.primaryColor || config.color || '#1e293b';
  const secondaryColor = config.branding?.secondaryColor || '#475569';

  return (
    <div className="h-full p-4 lg:p-8 animate-fadeIn overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">ورشة بناء الروبوت</h2>
            <p className="text-slate-400">صمم الروبوت الخاص بك، اختر الهيكل والحساسات المناسبة للمهمة.</p>
          </div>
          <div className="flex gap-3">
             <button 
                onClick={loadDefaults}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 px-4 py-3 rounded-xl font-bold transition-all hover:text-white hover:border-slate-500"
                title="إعادة تعيين للتكوين الافتراضي لنوع الهيكل الحالي"
              >
                <RotateCcw size={18} />
                <span className="hidden sm:inline">تحميل الافتراضي</span>
              </button>
              <button 
                onClick={onSave}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <Save size={20} />
                <span>حفظ التكوين</span>
              </button>
          </div>
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
               
               <div 
                 className="w-48 h-48 rounded-3xl border-2 border-slate-700 relative flex items-center justify-center shadow-2xl z-10 transition-transform duration-500 group-hover:scale-105"
                 style={{ backgroundColor: primaryColor }}
               >
                  {/* Wheels */}
                  <div className="absolute -left-4 top-4 w-4 h-12 rounded-l-lg border-l border-t border-b border-slate-600" style={{ backgroundColor: secondaryColor }}></div>
                  <div className="absolute -left-4 bottom-4 w-4 h-12 rounded-l-lg border-l border-t border-b border-slate-600" style={{ backgroundColor: secondaryColor }}></div>
                  <div className="absolute -right-4 top-4 w-4 h-12 rounded-r-lg border-r border-t border-b border-slate-600" style={{ backgroundColor: secondaryColor }}></div>
                  <div className="absolute -right-4 bottom-4 w-4 h-12 rounded-r-lg border-r border-t border-b border-slate-600" style={{ backgroundColor: secondaryColor }}></div>
                  
                  {/* Logo Overlay */}
                  {config.branding?.logo && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 opacity-60 mix-blend-overlay pointer-events-none">
                        <img src={config.branding.logo} alt="logo" className="w-full h-full object-contain" />
                    </div>
                  )}

                  {/* Body */}
                  <div className="text-slate-100/80 font-mono text-xs text-center relative z-10 mix-blend-overlay">
                     <Cpu size={48} className="mx-auto mb-2 opacity-50" />
                     <span className="tracking-widest uppercase font-bold shadow-black drop-shadow-md">{config.name || 'ROBOT'}</span>
                  </div>

                  {/* Mounted Sensors Visualization */}
                  {config.sensors.includes('ultrasonic') && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-indigo-500/20 border border-indigo-500 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20" title="Ultrasonic">
                      <Wifi size={16} className="text-indigo-400" />
                    </div>
                  )}

                  {config.sensors.includes('camera') && (
                    <div className="absolute -top-5 left-[20%] -translate-x-1/2 bg-slate-900 border border-slate-600 p-1 rounded-lg shadow-xl z-20" title="AI Camera">
                       <div className="relative w-8 h-8 bg-slate-800 rounded-full border-4 border-slate-700 overflow-hidden flex items-center justify-center shadow-inner">
                          {/* Lens */}
                          <div className="w-full h-full bg-slate-950 rounded-full relative overflow-hidden group-hover:scale-110 transition-transform duration-700">
                             {/* Lens Reflection (Glint) */}
                             <div className="absolute top-1.5 right-1.5 w-2 h-1 bg-white/70 rounded-full blur-[1px] -rotate-45"></div>
                             <div className="absolute bottom-2 left-2 w-1 h-1 bg-blue-400/40 rounded-full blur-[0.5px]"></div>
                             {/* Dynamic Flare */}
                             <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 via-sky-400/10 to-transparent"></div>
                          </div>
                       </div>
                       {/* Flash */}
                       {config.sensorConfig.camera?.illumination && (
                         <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,1)] border-2 border-slate-200 z-30"></div>
                       )}
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

            {/* Branding Card */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
                <h4 className="text-white font-bold mb-4 flex items-center gap-2 border-b border-slate-700/50 pb-3">
                    <Palette size={18} className="text-emerald-500" />
                    الهوية والمظهر
                </h4>
                
                <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                        <label className="text-xs text-slate-400 block mb-2 font-medium">اللون الأساسي</label>
                        <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-700">
                            <input 
                                type="color" 
                                value={primaryColor}
                                onChange={(e) => setConfig({
                                    ...config, 
                                    color: e.target.value,
                                    branding: { ...config.branding, primaryColor: e.target.value, secondaryColor: secondaryColor }
                                })}
                                className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                            />
                            <span className="text-[10px] text-slate-500 font-mono uppercase">{primaryColor}</span>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs text-slate-400 block mb-2 font-medium">اللون الثانوي</label>
                        <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-700">
                            <input 
                                type="color" 
                                value={secondaryColor}
                                onChange={(e) => setConfig({
                                    ...config, 
                                    branding: { ...config.branding, primaryColor: primaryColor, secondaryColor: e.target.value }
                                })}
                                className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                            />
                            <span className="text-[10px] text-slate-500 font-mono uppercase">{secondaryColor}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-xs text-slate-400 block mb-2 font-medium">شعار الروبوت (Logo)</label>
                    <div className="flex items-center gap-4">
                        <label className="flex-1 cursor-pointer bg-slate-900 border border-dashed border-slate-600 hover:border-emerald-500 rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition-colors group h-20">
                            <Upload size={16} className="text-slate-500 group-hover:text-emerald-500" />
                            <span className="text-xs text-slate-500 group-hover:text-emerald-400">رفع صورة</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                        </label>
                        {config.branding?.logo && (
                            <div className="relative w-20 h-20 bg-slate-900 rounded-xl border border-slate-700 overflow-hidden group shrink-0">
                                <img src={config.branding.logo} className="w-full h-full object-contain p-1" alt="Uploaded Logo" />
                                <button 
                                    onClick={() => setConfig({
                                      ...config, 
                                      branding: { ...config.branding!, logo: undefined }
                                    })}
                                    className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center text-white transition-all"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        )}
                    </div>
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

          {/* Right Column: Sensor Selection with Accordions */}
          <div className="lg:col-span-2">
            {/* ... existing sensor code ... */}
            <div className="flex items-center justify-between mb-6">
               <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Cpu className="text-emerald-500" />
                  تكوين الحساسات والمستشعرات
               </h3>
            </div>

            <div className="space-y-6">
               {(Object.keys(CATEGORY_LABELS) as SensorCategory[]).map((category) => (
                  <div key={category} className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 md:p-6 shadow-sm">
                      <div className="flex items-center gap-2 mb-4 text-emerald-400 font-bold text-sm uppercase tracking-wide border-b border-slate-800/50 pb-2">
                         {React.createElement(CATEGORY_LABELS[category].icon, { size: 16 })}
                         {CATEGORY_LABELS[category].label}
                      </div>

                      <div className="space-y-3">
                        {SENSORS.filter(s => s.category === category).map((sensor) => {
                            const isSelected = config.sensors.includes(sensor.id);
                            const isExpanded = expandedSensors.includes(sensor.id);
                            
                            return (
                            <div 
                                key={sensor.id}
                                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                                isSelected 
                                    ? 'bg-slate-800 border-slate-600' 
                                    : 'bg-slate-900 border-slate-700 hover:border-slate-600'
                                }`}
                            >
                                {/* Accordion Header */}
                                <div 
                                    className="p-4 flex items-center justify-between cursor-pointer"
                                    onClick={() => toggleSensor(sensor.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                                            isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}>
                                            <sensor.icon size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className={`font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>{sensor.name}</h4>
                                                <div 
                                                    className="group relative" 
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Info size={14} className="text-slate-500 hover:text-emerald-400 cursor-help transition-colors" />
                                                    <Tooltip text={sensor.details} />
                                                </div>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1">
                                                <p className="text-xs text-slate-500">{sensor.desc}</p>
                                                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
                                                    <span className="flex items-center gap-0.5"><Zap size={10} className="text-yellow-600"/>{sensor.power}mA</span>
                                                    <span className="flex items-center gap-0.5"><Scale size={10} className="text-blue-600"/>{sensor.weight}g</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3">
                                        {/* Status / Toggle */}
                                        <div className={`hidden sm:flex px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                                            {isSelected ? 'نشط' : 'غير مفعل'}
                                        </div>

                                        {/* Expand Button (Only if selected) */}
                                        {isSelected && (
                                            <button 
                                                onClick={(e) => toggleAccordion(sensor.id, e)}
                                                className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors"
                                            >
                                                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Accordion Body */}
                                {isSelected && isExpanded && (
                                    <div className="px-4 pb-4 pt-0 animate-slideDown">
                                        <div className="pt-4 border-t border-slate-700/50">
                                            {/* Existing Config Controls */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                                    <Settings2 size={12} />
                                                    تخصيص الإعدادات
                                                </div>
                                                <button 
                                                    onClick={(e) => resetSensorConfig(sensor.id, e)} 
                                                    className="text-slate-500 hover:text-white transition-colors bg-slate-700/50 p-1.5 rounded-lg hover:bg-slate-600" 
                                                    title="إعادة تعيين للافتراضي"
                                                >
                                                    <RotateCcw size={14} />
                                                </button>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {sensor.id === 'ultrasonic' && (
                                                    <ConfigSlider 
                                                        label="أقصى مدى قياس"
                                                        description="أقصى مسافة يمكن للحساس قياسها بدقة. زيادة المدى قد تقلل الدقة قليلاً في البيئات المزدحمة."
                                                        value={config.sensorConfig.ultrasonic?.range || 200}
                                                        min={50} max={400} step={10} unit="cm"
                                                        onChange={(v: number) => updateSensorConfig('ultrasonic', 'range', v)}
                                                    />
                                                )}

                                                {sensor.id === 'infrared' && (
                                                    <ConfigSlider 
                                                        label="حساسية الاستشعار"
                                                        description="درجة استجابة الحساس للتباين بين اللونين الأسود والأبيض. القيم الأعلى تعني استجابة أسرع ولكن قد تتأثر بالضوضاء."
                                                        value={config.sensorConfig.infrared?.sensitivity || 50}
                                                        min={0} max={100} unit="%"
                                                        onChange={(v: number) => updateSensorConfig('infrared', 'sensitivity', v)}
                                                        leftLabel="منخفض" rightLabel="عالي"
                                                    />
                                                )}

                                                {sensor.id === 'color' && (
                                                    <ConfigToggle 
                                                        label="تشغيل إضاءة LED مساعدة"
                                                        description="تشغيل مصباح صغير بجانب الحساس لتحسين دقة قراءة الألوان في البيئات المظلمة أو ذات الظلال."
                                                        value={config.sensorConfig.color?.illumination}
                                                        onChange={(v: boolean) => updateSensorConfig('color', 'illumination', v)}
                                                    />
                                                )}

                                                {sensor.id === 'gyro' && (
                                                    <ConfigSelect 
                                                        label="عدد المحاور"
                                                        description="3 محاور تقيس الدوران فقط. 6 محاور تضيف مقياس تسارع لزيادة الدقة في المنحدرات والحركات المعقدة."
                                                        options={['3-axis', '6-axis']}
                                                        value={config.sensorConfig.gyro?.axis}
                                                        onChange={(v: any) => updateSensorConfig('gyro', 'axis', v)}
                                                    />
                                                )}

                                                {sensor.id === 'camera' && (
                                                    <>
                                                        <ConfigSelect 
                                                            label="دقة الصورة"
                                                            description="دقة 1080p توفر تفاصيل أكثر للذكاء الاصطناعي ولكنها تستهلك طاقة ومعالجة أكبر من 720p."
                                                            options={['720p', '1080p']}
                                                            value={config.sensorConfig.camera?.resolution || '720p'}
                                                            onChange={(v: any) => updateSensorConfig('camera', 'resolution', v)}
                                                            onReset={() => updateSensorConfig('camera', 'resolution', '720p')}
                                                        />
                                                        <ConfigToggle
                                                            label="إضاءة مساعدة (Flash)"
                                                            description="تشغيل كشاف LED بجانب الكاميرا لتحسين الرؤية في البيئات المظلمة."
                                                            value={config.sensorConfig.camera?.illumination || false}
                                                            onChange={(v: boolean) => updateSensorConfig('camera', 'illumination', v)}
                                                        />
                                                    </>
                                                )}

                                                {sensor.id === 'lidar' && (
                                                    <>
                                                        <ConfigSlider 
                                                            label="مدى المسح"
                                                            description="نصف قطر المنطقة التي يغطيها الليزر لرسم الخريطة. المدى الأكبر يستهلك طاقة أكثر."
                                                            value={config.sensorConfig.lidar?.range || 8}
                                                            min={4} max={20} unit="m"
                                                            onChange={(v: number) => updateSensorConfig('lidar', 'range', v)}
                                                        />
                                                        <ConfigSlider 
                                                            label="معدل العينات"
                                                            description="عدد النقاط الممسوحة في الثانية. معدل أعلى يعني خريطة أدق وأوضح للعقبات الصغيرة."
                                                            value={config.sensorConfig.lidar?.sampleRate || 4000}
                                                            min={2000} max={8000} step={1000} unit="Hz"
                                                            onChange={(v: number) => updateSensorConfig('lidar', 'sampleRate', v)}
                                                        />
                                                    </>
                                                )}

                                                {sensor.id === 'imu' && (
                                                    <>
                                                        <ConfigDropdown 
                                                            label="مدى التسارع (Accelerometer)"
                                                            description="حساسية قياس التسارع. 8g مناسبة للحركات السريعة جداً والصدمات، بينما 2g أدق للحركة العادية."
                                                            options={['2g', '4g', '8g']}
                                                            value={config.sensorConfig.imu?.accelRange}
                                                            onChange={(v: any) => updateSensorConfig('imu', 'accelRange', v)}
                                                        />
                                                        <ConfigDropdown 
                                                            label="مدى الجيروسكوب (Gyroscope)"
                                                            description="أقصى سرعة دوران يمكن قياسها. 250dps للحركات الدقيقة والبطيئة، و 500dps للمناورات السريعة."
                                                            options={['250dps', '500dps']}
                                                            value={config.sensorConfig.imu?.gyroRange}
                                                            onChange={(v: any) => updateSensorConfig('imu', 'gyroRange', v)}
                                                        />
                                                    </>
                                                )}
                                            </div>
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