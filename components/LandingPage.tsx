import React, { useState } from 'react';
import { Bot, Code, Layers, Zap, ArrowLeft, Brain, Box, Check, Users, Building, Mail, HelpCircle, FileText, Play, RotateCw, Navigation } from 'lucide-react';
import { PublicView, RobotConfig } from '../types';
import SimulationViewport from './SimulationViewport';
import Simulation3D from './Simulation3D';

interface LandingPageProps {
  onStart: () => void;
}

const DEMO_ROBOT_CONFIG: RobotConfig = {
  name: 'Demo Bot',
  type: 'rover',
  sensors: ['lidar', 'ultrasonic', 'camera'],
  sensorConfig: {
      lidar: { range: 10, sampleRate: 4000 },
      ultrasonic: { range: 200 },
      camera: { resolution: '720p' },
      color: { illumination: true }
  },
  color: '#10b981'
};

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [currentPage, setCurrentPage] = useState<PublicView>(PublicView.HOME);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper for navigation links
  const NavLink = ({ view, label }: { view: PublicView; label: string }) => (
    <button 
      onClick={() => {
        setCurrentPage(view);
        setIsMobileMenuOpen(false);
        window.scrollTo(0, 0);
      }}
      className={`text-sm font-medium transition-colors ${
        currentPage === view ? 'text-emerald-400 font-bold' : 'text-slate-300 hover:text-emerald-400'
      }`}
    >
      {label}
    </button>
  );

  const renderContent = () => {
    switch (currentPage) {
      case PublicView.HOME:
        return <HomeContent onStart={onStart} setPage={setCurrentPage} />;
      case PublicView.ABOUT:
        return <AboutContent />;
      case PublicView.HOW_IT_WORKS:
        return <HowItWorksContent />;
      case PublicView.FEATURES:
        return <FeaturesContent />;
      case PublicView.DEMO:
        return <DemoContent onStart={onStart} />;
      case PublicView.TRACKS:
        return <TracksContent />;
      case PublicView.PRICING:
        return <PricingContent />;
      case PublicView.SCHOOLS:
        return <SchoolsContent />;
      case PublicView.ENTERPRISE:
        return <EnterpriseContent />;
      case PublicView.SUPPORT:
      case PublicView.CONTACT:
        return <ContactContent />;
      case PublicView.FAQ:
        return <FAQContent />;
      case PublicView.PRIVACY:
      case PublicView.TERMS:
        return <LegalContent type={currentPage} />;
      default:
        return <HomeContent onStart={onStart} setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-cairo overflow-x-hidden flex flex-col">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="flex justify-between items-center px-6 lg:px-16 py-4 max-w-7xl mx-auto">
          <div 
            className="flex items-center gap-3 cursor-pointer" 
            onClick={() => setCurrentPage(PublicView.HOME)}
          >
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Bot className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-wide">مُلَقِّن</h1>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden lg:flex gap-6 items-center">
            <NavLink view={PublicView.HOME} label="الرئيسية" />
            <NavLink view={PublicView.ABOUT} label="من نحن" />
            <NavLink view={PublicView.HOW_IT_WORKS} label="كيف يعمل" />
            <NavLink view={PublicView.DEMO} label="جرب المحاكي" />
            <NavLink view={PublicView.PRICING} label="الأسعار" />
            <div className="w-px h-6 bg-slate-700 mx-2"></div>
            <button 
              onClick={onStart}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all"
            >
              دخول المنصة
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden text-slate-300"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="space-y-1.5">
              <span className="block w-6 h-0.5 bg-current"></span>
              <span className="block w-6 h-0.5 bg-current"></span>
              <span className="block w-6 h-0.5 bg-current"></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-t border-slate-800 p-4 space-y-4 flex flex-col items-start animate-fadeIn">
            <NavLink view={PublicView.HOME} label="الرئيسية" />
            <NavLink view={PublicView.ABOUT} label="من نحن" />
            <NavLink view={PublicView.HOW_IT_WORKS} label="كيف يعمل" />
            <NavLink view={PublicView.FEATURES} label="المزايا" />
            <NavLink view={PublicView.DEMO} label="جرب المحاكي" />
            <NavLink view={PublicView.PRICING} label="الأسعار" />
            <NavLink view={PublicView.SCHOOLS} label="للمدارس" />
            <button 
              onClick={onStart}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold mt-4"
            >
              دخول المنصة
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Bot className="text-emerald-500 w-6 h-6" />
                <span className="font-bold text-xl text-white">مُلَقِّن AI</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                المعيار العربي الأول لتعليم الروبوتات وبرمجة الأنظمة الذكية. محاكاة، ذكاء اصطناعي، ومناهج متكاملة.
              </p>
              <div className="flex gap-4">
                 {/* Social placeholders */}
                 <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors cursor-pointer"><Mail size={14}/></div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white mb-6">عن المنصة</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><button onClick={() => setCurrentPage(PublicView.ABOUT)} className="hover:text-emerald-400">من نحن</button></li>
                <li><button onClick={() => setCurrentPage(PublicView.HOW_IT_WORKS)} className="hover:text-emerald-400">كيف يعمل</button></li>
                <li><button onClick={() => setCurrentPage(PublicView.FEATURES)} className="hover:text-emerald-400">المزايا</button></li>
                <li><button onClick={() => setCurrentPage(PublicView.TRACKS)} className="hover:text-emerald-400">المسارات التعليمية</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-6">حلول وخدمات</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><button onClick={() => setCurrentPage(PublicView.SCHOOLS)} className="hover:text-emerald-400">للمدارس</button></li>
                <li><button onClick={() => setCurrentPage(PublicView.ENTERPRISE)} className="hover:text-emerald-400">للشركات والمؤسسات</button></li>
                <li><button onClick={() => setCurrentPage(PublicView.PRICING)} className="hover:text-emerald-400">باقات الأسعار</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-6">الدعم والمساعدة</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><button onClick={() => setCurrentPage(PublicView.FAQ)} className="hover:text-emerald-400">الأسئلة الشائعة</button></li>
                <li><button onClick={() => setCurrentPage(PublicView.CONTACT)} className="hover:text-emerald-400">اتصل بنا</button></li>
                <li><button onClick={() => setCurrentPage(PublicView.PRIVACY)} className="hover:text-emerald-400">سياسة الخصوصية</button></li>
                <li><button onClick={() => setCurrentPage(PublicView.TERMS)} className="hover:text-emerald-400">الشروط والأحكام</button></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
             <p>© 2025 منصة مُلَقِّن التعليمية. جميع الحقوق محفوظة.</p>
             <div className="flex gap-6">
                <span>صنع بكل ❤️ لجيل المستقبل</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- SUB-COMPONENTS FOR PAGES ---

const HomeContent = ({ onStart, setPage }: { onStart: () => void, setPage: (v: PublicView) => void }) => (
  <>
    {/* Hero Section */}
    <div className="relative pt-16 pb-20 lg:pt-32 lg:pb-32 px-6 lg:px-16 max-w-7xl mx-auto text-center lg:text-right flex flex-col lg:flex-row items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
      <div className="lg:w-1/2 z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          الإصدار التجريبي متاح الآن
        </div>
        <h1 className="text-5xl lg:text-7xl font-black mb-6 leading-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-400">
          تعلم برمجة الروبوتات <br />
          <span className="text-emerald-500">بذكاء وبدون أجهزة</span>
        </h1>
        <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
          منصة "مُلَقِّن" تدمج بين المحاكاة ثلاثية الأبعاد والذكاء الاصطناعي لتقديم تجربة تعليمية متكاملة. ابني روبوتك، برمج حركاته، واختبره في بيئة افتراضية، كل ذلك من متصفحك.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
          <button onClick={onStart} className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-600/20 transition-all hover:scale-105">
            ابـدأ التحدي الآن
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <button onClick={() => setPage(PublicView.DEMO)} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-8 py-4 rounded-2xl font-bold text-lg border border-slate-700 transition-all">
            <Play size={20} fill="currentColor" />
            جرب المحاكي
          </button>
        </div>
      </div>
      <div className="lg:w-1/2 mt-16 lg:mt-0 relative">
          <div className="relative z-10 bg-slate-900 border border-slate-700 rounded-3xl p-4 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
             <div className="aspect-video bg-slate-950 rounded-xl overflow-hidden relative flex items-center justify-center border border-slate-800">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]"></div>
                <div className="text-center relative z-10">
                   <Bot size={80} className="text-emerald-500 mx-auto mb-4 animate-bounce" />
                   <p className="text-slate-400 font-mono text-sm">Initializing System...</p>
                </div>
             </div>
          </div>
      </div>
    </div>
    
    {/* Features Teaser */}
    <div className="py-20 bg-slate-900/50 border-y border-slate-800/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold mb-4">لماذا تختار مُلَقِّن؟</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
           {[
             { icon: Box, title: "محاكاة بدون أجهزة", desc: "وفر تكاليف المعدات وتدرب في بيئة افتراضية متكاملة." },
             { icon: Brain, title: "ذكاء اصطناعي مدمج", desc: "مساعد ذكي يصحح الأخطاء ويقترح حلولاً برمجية." },
             { icon: Layers, title: "مناهج تفاعلية", desc: "تدرج من المبتدئ إلى المحترف عبر تحديات ممتعة." }
           ].map((item, i) => (
             <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-emerald-500/50 transition-colors">
               <item.icon className="w-10 h-10 text-emerald-500 mx-auto mb-4" />
               <h3 className="text-xl font-bold mb-2">{item.title}</h3>
               <p className="text-slate-400 text-sm">{item.desc}</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  </>
);

const AboutContent = () => (
  <div className="max-w-4xl mx-auto px-6 py-20">
    <div className="text-center mb-12">
       <span className="text-emerald-500 font-bold tracking-wider text-sm uppercase">قصتنا</span>
       <h2 className="text-4xl font-bold mt-2">لماذا سمي المشروع "مُلَقِّن"؟</h2>
    </div>
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-12 mb-12 relative overflow-hidden">
       <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl"></div>
       <p className="text-lg text-slate-300 leading-relaxed mb-6">
         لأن دوره ليس فقط تعليم البرمجة، بل <strong>"تلقين"</strong> المستخدم طريقة التفكير الروبوتي (منطق، حساسات، حركة، معالجة، تكرار، شرط...). اسم عربي أصيل ومعبّر، ويحمل معنى التوجيه والتأسيس الصحيح.
       </p>
       <p className="text-lg text-slate-300 leading-relaxed">
         مُلَقِّن هو محاكي روبوتات تفاعلي صُمّم لتعليم المتعلمين أساسيات بناء الروبوتات، برمجتها، تشغيلها، والربط بينها داخليًا—كل هذا داخل بيئة محاكاة ثلاثية الأبعاد تعتمد على الذكاء الاصطناعي وتعمل بالكامل عبر المتصفح.
       </p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-3">الرؤية</h3>
          <p className="text-slate-400">تحويل مُـلَقِّن إلى المعيار العربي الأول لتعليم الروبوتات وبرمجة الأنظمة الذكية.</p>
       </div>
       <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-3">الرسالة</h3>
          <p className="text-slate-400">دمج التعليم التطبيقي التقليدي مع أدوات الذكاء الاصطناعي لتقديم تجربة تعلم متاحة للجميع.</p>
       </div>
    </div>
  </div>
);

const HowItWorksContent = () => (
  <div className="max-w-6xl mx-auto px-6 py-20">
    <div className="text-center mb-16">
       <h2 className="text-4xl font-bold">رحلة التعلم في مُلَقِّن</h2>
       <p className="text-slate-400 mt-4">خطوات بسيطة تفصلك عن بناء أول روبوت ذكي</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
      {/* Connector Line */}
      <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-slate-800 -z-10"></div>
      
      {[
        { step: '01', title: 'اختر البيئة', desc: 'حدد نوع التحدي (متاهة، تتبع خط، ذراع آلي...)' },
        { step: '02', title: 'ابنِ الروبوت', desc: 'ركب القطع والحساسات (Blocks) المناسبة للمهمة.' },
        { step: '03', title: 'برمج بذكاء', desc: 'استخدم البلوكات أو Python مع مساعدة AI.' },
        { step: '04', title: 'اختبر وحسن', desc: 'شاهد المحاكاة واحصل على تقرير أداء فوري.' },
      ].map((item, i) => (
        <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative">
           <div className="w-12 h-12 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-xl font-bold text-emerald-500 mb-4 shadow-xl">
             {item.step}
           </div>
           <h3 className="text-xl font-bold mb-2">{item.title}</h3>
           <p className="text-slate-400 text-sm">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
);

const FeaturesContent = () => (
  <div className="max-w-6xl mx-auto px-6 py-20">
    <div className="text-center mb-16">
       <h2 className="text-4xl font-bold">مزايا تقنية متقدمة</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       {[
         "مكتبة روبوتات جاهزة",
         "برمجة مرئية (Blocks) و نصية (Python)",
         "نظام فيزياء واقعي (تصادم، احتكاك)",
         "ذكاء اصطناعي يصحح الأخطاء",
         "لوحة تحكم للمعلم والطالب",
         "تصدير المشاريع ومشاركتها",
         "دعم الحساسات (IR, Ultrasonic, Gyro)",
         "بيئات تدريب متعددة (خط، متاهة...)",
         "نظام إنجازات وتحديات"
       ].map((feat, i) => (
         <div key={i} className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50">
            <div className="mt-1 bg-emerald-500/10 p-1 rounded-full text-emerald-500"><Check size={16} /></div>
            <span className="text-slate-300 font-medium">{feat}</span>
         </div>
       ))}
    </div>
  </div>
);

const DemoContent = ({ onStart }: { onStart: () => void }) => {
  const [activeScenario, setActiveScenario] = useState<'square' | 'zigzag' | 'complex'>('square');
  const [simulationKey, setSimulationKey] = useState(0);
  const [is3D, setIs3D] = useState(false);

  const scenarios = {
    square: [
        {type: 'move_forward', value: 120},
        {type: 'turn_right', value: 90},
        {type: 'move_forward', value: 120},
        {type: 'turn_right', value: 90},
        {type: 'move_forward', value: 120},
        {type: 'turn_right', value: 90},
        {type: 'move_forward', value: 120},
    ],
    zigzag: [
        {type: 'move_forward', value: 60},
        {type: 'turn_left', value: 45},
        {type: 'move_forward', value: 80},
        {type: 'turn_right', value: 90},
        {type: 'move_forward', value: 80},
        {type: 'turn_left', value: 90},
        {type: 'move_forward', value: 80},
    ],
    complex: [
        {type: 'move_forward', value: 100},
        {type: 'turn_right', value: 45},
        {type: 'move_forward', value: 50},
        {type: 'turn_left', value: 90},
        {type: 'move_forward', value: 70},
        {type: 'turn_right', value: 135},
        {type: 'move_forward', value: 150},
    ]
  };

  const handleScenarioChange = (scenario: 'square' | 'zigzag' | 'complex') => {
    setActiveScenario(scenario);
    setSimulationKey(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 h-screen flex flex-col">
       <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">المحاكي التفاعلي</h2>
          <p className="text-slate-400">جرب حركة الروبوت في بيئة افتراضية مباشرة (وضع العرض فقط)</p>
       </div>

       {/* Control Bar */}
       <div className="flex flex-col md:flex-row justify-center gap-4 mb-6 items-center">
          <div className="flex gap-4">
            <button 
                onClick={() => handleScenarioChange('square')}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeScenario === 'square' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
                <Box size={16} /> مسار مربع
            </button>
            <button 
                onClick={() => handleScenarioChange('zigzag')}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeScenario === 'zigzag' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
                <Navigation size={16} /> متعرج
            </button>
            <button 
                onClick={() => handleScenarioChange('complex')}
                className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${activeScenario === 'complex' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
                <RotateCw size={16} /> حر
            </button>
          </div>
          
          <div className="w-px h-6 bg-slate-700 hidden md:block"></div>

          <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700/50">
                <button 
                onClick={() => setIs3D(false)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${!is3D ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                2D
                </button>
                <button 
                onClick={() => setIs3D(true)}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${is3D ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                >
                3D
                </button>
            </div>
       </div>

       <div className="flex-1 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 z-0">
             {is3D ? (
                <Simulation3D 
                  key={`3d-${simulationKey}`}
                  config={DEMO_ROBOT_CONFIG}
                  isRunning={true} 
                  codeOutput={scenarios[activeScenario]} 
                  resetSimulation={() => {}}
                  startPosition={{x: 200, y: 300, angle: 270}}
                />
             ) : (
                <SimulationViewport 
                  key={`2d-${simulationKey}`}
                  config={DEMO_ROBOT_CONFIG}
                  isRunning={true} 
                  codeOutput={scenarios[activeScenario]} 
                  resetSimulation={() => {}}
                  startPosition={{x: 200, y: 300, angle: 270}}
                />
             )}
          </div>
          
          {/* Overlay CTA */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-[90%] md:w-auto bg-slate-900/90 backdrop-blur-md border border-slate-600 px-8 py-6 rounded-2xl text-center shadow-xl">
             <div className="flex flex-col md:flex-row items-center gap-6">
                 <div className="text-right">
                    <p className="text-white font-bold text-lg mb-1">هل أعجبتك التجربة؟</p>
                    <p className="text-slate-400 text-sm">هذا مجرد عرض بسيط. سجل دخولك الآن للتحكم الكامل، كتابة الكود، وبناء الروبوت الخاص بك.</p>
                 </div>
                 <button 
                   onClick={onStart}
                   className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 whitespace-nowrap transition-transform hover:scale-105"
                 >
                   ابدأ مجاناً
                 </button>
             </div>
          </div>

          <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur px-3 py-1 rounded text-xs text-slate-300 border border-white/10">
             وضع العرض التجريبي • Demo Mode
          </div>
       </div>
    </div>
  );
};

const TracksContent = () => (
  <div className="max-w-6xl mx-auto px-6 py-20">
    <h2 className="text-3xl font-bold text-center mb-12">المسارات التعليمية</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
       {[
         { title: 'المبتدئ (Junior)', desc: 'تعلم المنطق البرمجي باستخدام البلوكات.', level: 'سهل', color: 'border-emerald-500' },
         { title: 'المستكشف (Explorer)', desc: 'مقدمة في الحساسات والتحكم الذاتي.', level: 'متوسط', color: 'border-amber-500' },
         { title: 'المحترف (Pro)', desc: 'خوارزميات متقدمة، رؤية حاسوبية، وPython.', level: 'صعب', color: 'border-rose-500' }
       ].map((track, i) => (
         <div key={i} className={`bg-slate-900 p-6 rounded-2xl border-t-4 ${track.color} shadow-lg`}>
            <h3 className="text-xl font-bold mb-2">{track.title}</h3>
            <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300">{track.level}</span>
            <p className="text-slate-400 mt-4">{track.desc}</p>
         </div>
       ))}
    </div>
  </div>
);

const PricingContent = () => (
  <div className="max-w-6xl mx-auto px-6 py-20">
    <div className="text-center mb-16">
       <h2 className="text-4xl font-bold">خطط تناسب الجميع</h2>
       <p className="text-slate-400 mt-4">اختر الباقة المناسبة لاحتياجاتك التعليمية</p>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
       {/* Free */}
       <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <h3 className="text-lg font-bold text-slate-400">مجاني</h3>
          <div className="text-3xl font-bold my-4">0 <span className="text-sm font-normal text-slate-500">ر.س/شهرياً</span></div>
          <ul className="space-y-3 mb-8 text-sm text-slate-300">
             <li className="flex gap-2"><Check size={16} className="text-emerald-500"/> الوصول لـ 3 روبوتات</li>
             <li className="flex gap-2"><Check size={16} className="text-emerald-500"/> 5 تحديات أساسية</li>
             <li className="flex gap-2"><Check size={16} className="text-emerald-500"/> برمجة Blocks فقط</li>
          </ul>
          <button className="w-full border border-slate-700 hover:bg-slate-800 py-3 rounded-xl font-bold transition-colors">ابدأ مجاناً</button>
       </div>
       
       {/* Pro */}
       <div className="bg-slate-800 border-2 border-emerald-500 p-8 rounded-3xl relative shadow-2xl shadow-emerald-900/20 transform md:-translate-y-4">
          <div className="absolute top-0 right-1/2 translate-x-1/2 -translate-y-1/2 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold">الأكثر طلباً</div>
          <h3 className="text-lg font-bold text-white">طالب محترف</h3>
          <div className="text-3xl font-bold my-4">49 <span className="text-sm font-normal text-slate-400">ر.س/شهرياً</span></div>
          <ul className="space-y-3 mb-8 text-sm text-slate-200">
             <li className="flex gap-2"><Check size={16} className="text-emerald-400"/> جميع الروبوتات</li>
             <li className="flex gap-2"><Check size={16} className="text-emerald-400"/> تحديات لا محدودة</li>
             <li className="flex gap-2"><Check size={16} className="text-emerald-400"/> برمجة Python + Blocks</li>
             <li className="flex gap-2"><Check size={16} className="text-emerald-400"/> مساعد AI ذكي</li>
             <li className="flex gap-2"><Check size={16} className="text-emerald-400"/> شهادة إتمام</li>
          </ul>
          <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 rounded-xl font-bold transition-colors">اشترك الآن</button>
       </div>

       {/* School */}
       <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl">
          <h3 className="text-lg font-bold text-slate-400">مدارس</h3>
          <div className="text-3xl font-bold my-4">مخصص <span className="text-sm font-normal text-slate-500">للمؤسسات</span></div>
          <ul className="space-y-3 mb-8 text-sm text-slate-300">
             <li className="flex gap-2"><Check size={16} className="text-emerald-500"/> حسابات طلاب ومعلمين</li>
             <li className="flex gap-2"><Check size={16} className="text-emerald-500"/> لوحة تحكم للإدارة</li>
             <li className="flex gap-2"><Check size={16} className="text-emerald-500"/> مناهج خاصة</li>
             <li className="flex gap-2"><Check size={16} className="text-emerald-500"/> دعم فني مباشر</li>
          </ul>
          <button className="w-full border border-slate-700 hover:bg-slate-800 py-3 rounded-xl font-bold transition-colors">تواصل معنا</button>
       </div>
    </div>
  </div>
);

const SchoolsContent = () => (
  <div className="max-w-5xl mx-auto px-6 py-20">
    <div className="flex flex-col md:flex-row items-center gap-12">
       <div className="flex-1">
          <h2 className="text-4xl font-bold mb-6">مُلَقِّن للمدارس</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-6">
            نقدم للمدارس منصة متكاملة لدمج تعليم الروبوتات في المناهج الدراسية دون الحاجة لتكاليف المعامل الباهظة.
          </p>
          <ul className="space-y-4 mb-8">
             <li className="flex items-center gap-3"><Users className="text-emerald-500"/> إدارة فصول وطلاب سهلة</li>
             <li className="flex items-center gap-3"><FileText className="text-emerald-500"/> تقارير أداء ومتابعة فورية</li>
             <li className="flex items-center gap-3"><Brain className="text-emerald-500"/> مناهج STEM جاهزة ومتوافقة</li>
          </ul>
          <button className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-xl font-bold">طلب عرض تجريبي</button>
       </div>
       <div className="flex-1 bg-slate-800 p-8 rounded-3xl border border-slate-700">
          <h3 className="text-xl font-bold mb-4 text-center">انضم لشركاء النجاح</h3>
          {/* Mock Logos */}
          <div className="grid grid-cols-2 gap-4 opacity-50">
             <div className="h-12 bg-slate-700 rounded flex items-center justify-center">School A</div>
             <div className="h-12 bg-slate-700 rounded flex items-center justify-center">Academy B</div>
             <div className="h-12 bg-slate-700 rounded flex items-center justify-center">Inst C</div>
             <div className="h-12 bg-slate-700 rounded flex items-center justify-center">Edu D</div>
          </div>
       </div>
    </div>
  </div>
);

const EnterpriseContent = () => (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
       <Building size={64} className="mx-auto text-emerald-500 mb-6" />
       <h2 className="text-4xl font-bold mb-6">حلول المؤسسات (Enterprise)</h2>
       <p className="text-slate-400 text-lg mb-12">
         هل تحتاج لتدريب موظفيك على الأنظمة المؤتمتة والروبوتات؟ نقدم بيئات محاكاة مخصصة تحاكي بيئة عملك.
       </p>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-right">
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
             <h4 className="font-bold text-white mb-2">تدريب آمن</h4>
             <p className="text-sm text-slate-400">درب موظفيك على الآلات الخطرة في بيئة افتراضية آمنة 100%.</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
             <h4 className="font-bold text-white mb-2">سيناريوهات مخصصة</h4>
             <p className="text-sm text-slate-400">نقوم ببناء خطوط إنتاج وروبوتات تطابق الموجودة في مصنعك.</p>
          </div>
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
             <h4 className="font-bold text-white mb-2">تقارير كفاءة</h4>
             <p className="text-sm text-slate-400">قياس دقة وسرعة الموظفين في التعامل مع الأعطال والبرمجة.</p>
          </div>
       </div>
    </div>
);

const FAQContent = () => (
  <div className="max-w-3xl mx-auto px-6 py-20">
     <h2 className="text-3xl font-bold text-center mb-12">الأسئلة الشائعة</h2>
     <div className="space-y-4">
        {[
          { q: "هل أحتاج لخبرة سابقة في البرمجة؟", a: "لا، منصة مُلَقِّن مصممة لتبدأ معك من الصفر باستخدام نظام البلوكات المرئي." },
          { q: "هل يعمل المحاكي على الأجهزة اللوحية (iPad)؟", a: "نعم، المنصة تعمل بالكامل عبر المتصفح وتدعم الأجهزة اللوحية وأجهزة الكمبيوتر." },
          { q: "كيف يمكنني الحصول على الشهادة؟", a: "عند إتمام المسارات التدريبية واجتياز التحديات النهائية بنجاح، يتم إصدار شهادة معتمدة رقمياً." },
          { q: "هل يمكنني إضافة الروبوت الخاص بي؟", a: "في النسخة الحالية يمكنك البناء من القطع المتاحة، وقريباً سنفتح باب استيراد النماذج الخاصة." }
        ].map((item, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
             <h3 className="font-bold text-white mb-2 flex items-center gap-2"><HelpCircle size={16} className="text-emerald-500"/> {item.q}</h3>
             <p className="text-slate-400 text-sm leading-relaxed pr-6">{item.a}</p>
          </div>
        ))}
     </div>
  </div>
);

const ContactContent = () => (
  <div className="max-w-4xl mx-auto px-6 py-20">
     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
           <h2 className="text-3xl font-bold mb-6">تواصل معنا</h2>
           <p className="text-slate-400 mb-8">فريقنا جاهز للإجابة على استفساراتك ومساعدتك في البدء.</p>
           <div className="space-y-4 text-slate-300">
              <div className="flex items-center gap-3">
                 <Mail className="text-emerald-500" /> info@mulaqqin.ai
              </div>
              <div className="flex items-center gap-3">
                 <Building className="text-emerald-500" /> الرياض، المملكة العربية السعودية
              </div>
           </div>
        </div>
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
           <form className="space-y-4">
              <div>
                 <label className="block text-sm text-slate-400 mb-1">الاسم</label>
                 <input type="text" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-emerald-500" />
              </div>
              <div>
                 <label className="block text-sm text-slate-400 mb-1">البريد الإلكتروني</label>
                 <input type="email" className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-emerald-500" />
              </div>
              <div>
                 <label className="block text-sm text-slate-400 mb-1">الرسالة</label>
                 <textarea rows={4} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-emerald-500"></textarea>
              </div>
              <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-2 rounded-lg font-bold">إرسال</button>
           </form>
        </div>
     </div>
  </div>
);

const LegalContent = ({ type }: { type: PublicView }) => (
  <div className="max-w-4xl mx-auto px-6 py-20 text-slate-300">
     <h2 className="text-3xl font-bold text-white mb-8">{type === PublicView.PRIVACY ? 'سياسة الخصوصية' : 'الشروط والأحكام'}</h2>
     <div className="space-y-6 text-sm leading-relaxed bg-slate-900 p-8 rounded-2xl border border-slate-800">
        <p>
           هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التى يولدها التطبيق.
        </p>
        <p>
           إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص العربى زيادة عدد الفقرات كما تريد، النص لن يبدو مقسما ولا يحوي أخطاء لغوية، مولد النص العربى مفيد لمصممي المواقع على وجه الخصوص، حيث يحتاج العميل فى كثير من الأحيان أن يطلع على صورة حقيقية لتصميم الموقع.
        </p>
        <h3 className="font-bold text-white text-lg mt-4">1. جمع البيانات</h3>
        <p>نقوم بجمع البيانات اللازمة فقط لتحسين تجربة المستخدم التعليمية.</p>
        <h3 className="font-bold text-white text-lg mt-4">2. الاستخدام</h3>
        <p>نستخدم البيانات لتقديم تقارير الأداء وتخصيص مسار التعلم.</p>
     </div>
  </div>
);

export default LandingPage;