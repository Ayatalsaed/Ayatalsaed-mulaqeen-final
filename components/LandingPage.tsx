import React, { useState } from 'react';
import { Bot, Code, Layers, Zap, ArrowLeft, Brain, Box, Check, Users, Building, Mail, HelpCircle, FileText, Play, RotateCw, Navigation, Shield, Lock, Eye, TrendingUp, Award, Smartphone, Globe, BookOpen } from 'lucide-react';
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
  <div className="max-w-5xl mx-auto px-6 py-20">
    {/* Hero Section of About */}
    <div className="text-center mb-16">
       <span className="text-emerald-500 font-bold tracking-wider text-sm uppercase bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">قصتنا ورؤيتنا</span>
       <h2 className="text-4xl md:text-5xl font-bold mt-6 mb-6">بناء جيل من المبتكرين</h2>
       <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
         في عالم يتسارع فيه التطور التقني، نؤمن بأن تعليم الروبوتات والبرمجة حق للجميع، وليس حكراً على من يملك المعامل المجهزة.
       </p>
    </div>

    {/* Story Section */}
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 lg:p-12 mb-20 relative overflow-hidden">
       <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10"></div>
       <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl -z-10"></div>
       
       <h3 className="text-2xl font-bold text-white mb-6">قصة البداية</h3>
       <div className="space-y-6 text-lg text-slate-300 leading-relaxed">
         <p>
           انطلقت منصة <strong>مُلَقِّن</strong> في عام 2024 بمبادرة من مجموعة مهندسين ومبرمجين عرب لاحظوا الصعوبات التي تواجه المدارس والطلاب في الوصول إلى أدوات تعليم الروبوتات الحديثة. كانت التكاليف المرتفعة لمجموعات الروبوت (Hardware Kits) وصعوبة صيانتها عائقاً كبيراً أمام انتشار هذه المعرفة.
         </p>
         <p>
           لذا قررنا بناء حل جذري: منصة سحابية متكاملة (Cloud-based Robotics Lab) تتيح للطالب تصميم وبناء وبرمجة الروبوتات في بيئة افتراضية تحاكي القوانين الفيزيائية بدقة عالية. لم نكتفِ بذلك، بل أضفنا "المُلَقِّن الذكي"، وهو مساعد مبني على الذكاء الاصطناعي التوليدي يقوم بدور المعلم الخصوصي، يصحح الأكواد ويشرح المفاهيم المعقدة بأسلوب مبسط.
         </p>
         <p>
           نطمح اليوم لأن نكون البنية التحتية الرقمية لتعليم تقنيات المستقبل في كل مدرسة ومنزل عربي، مساهمين في تحقيق رؤى المنطقة نحو الاقتصاد الرقمي والصناعي.
         </p>
       </div>
    </div>

    {/* Vision & Mission Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
       <div className="bg-slate-800/40 border border-slate-700 p-8 rounded-2xl hover:bg-slate-800/60 transition-colors">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 mb-6">
            <Eye size={24} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">رؤيتنا</h3>
          <p className="text-slate-400 leading-relaxed">
            أن نكون المنصة المرجعية الأولى في الشرق الأوسط وشمال أفريقيا لتعليم تقنيات الثورة الصناعية الرابعة، وتمكين مليون طالب عربي من مهارات المستقبل بحلول 2030.
          </p>
       </div>
       <div className="bg-slate-800/40 border border-slate-700 p-8 rounded-2xl hover:bg-slate-800/60 transition-colors">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 mb-6">
            <TrendingUp size={24} />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">رسالتنا</h3>
          <p className="text-slate-400 leading-relaxed">
            توفير بيئة تعليمية تفاعلية، ممتعة، ومنخفضة التكلفة، تكسر حواجز الدخول لمجال الروبوتات، وتوفر أدوات تقييم ذكية للمعلمين والمدارس.
          </p>
       </div>
    </div>

    {/* Values Grid */}
    <h3 className="text-2xl font-bold text-center mb-10">قيمنا الجوهرية</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
            { t: 'الابتكار المستمر', d: 'نحدث مناهجنا وأدواتنا أسبوعياً لتواكب التكنولوجيا.', i: Zap },
            { t: 'الوصول للجميع', d: 'نعمل لتعمل المنصة على أبسط الأجهزة المدرسية.', i: Globe },
            { t: 'المجتمع أولاً', d: 'ندعم المصادر المفتوحة ونشارك المعرفة مع المجتمع التقني.', i: Users }
        ].map((v, i) => (
            <div key={i} className="text-center p-6 bg-slate-900 rounded-xl border border-slate-800 hover:border-emerald-500/30 transition-colors">
                <div className="w-12 h-12 mx-auto bg-slate-800 rounded-full flex items-center justify-center text-emerald-500 mb-4">
                    <v.i size={20} />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{v.t}</h4>
                <p className="text-sm text-slate-400">{v.d}</p>
            </div>
        ))}
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
        { step: '01', title: 'اختر البيئة', desc: 'حدد نوع التحدي (متاهة، تتبع خط، ذراع آلي...) ومستوى الصعوبة.' },
        { step: '02', title: 'ابنِ الروبوت', desc: 'ركب القطع والحساسات (Blocks) المناسبة للمهمة من ورشة العمل.' },
        { step: '03', title: 'برمج بذكاء', desc: 'استخدم البلوكات للمبتدئين أو Python للمتقدمين مع مساعدة AI.' },
        { step: '04', title: 'اختبر وحسن', desc: 'شاهد المحاكاة ثلاثية الأبعاد واحصل على تقرير أداء فوري من المُلَقِّن.' },
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
    
    <div className="mt-20 bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-4">ماذا تحتاج لتبدأ؟</h3>
            <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-300">
                    <Check className="text-emerald-500" size={20} />
                    <span>جهاز كمبيوتر أو جهاز لوحي (متصفح Chrome/Edge)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                    <Check className="text-emerald-500" size={20} />
                    <span>اتصال بالإنترنت (المنصة سحابية بالكامل)</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                    <Check className="text-emerald-500" size={20} />
                    <span>شغف للتعلم (لا يتطلب خبرة برمجية مسبقة)</span>
                </li>
            </ul>
        </div>
        <div className="flex-1 flex justify-center">
            <Smartphone size={120} className="text-slate-700 opacity-50" />
        </div>
    </div>
  </div>
);

const FeaturesContent = () => {
  const colorClasses: Record<string, {bg: string, text: string}> = {
      emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
      amber: { bg: 'bg-amber-500/10', text: 'text-amber-500' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
      cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500' },
      rose: { bg: 'bg-rose-500/10', text: 'text-rose-500' },
  };

  return (
  <div className="max-w-7xl mx-auto px-6 py-20">
    <div className="text-center mb-16">
       <span className="text-emerald-500 font-bold tracking-wider text-sm uppercase">مميزات المنصة</span>
       <h2 className="text-4xl font-bold mt-2">تقنيات متقدمة لتعليم المستقبل</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {[
            { icon: Layers, color: 'emerald', title: "فيزياء واقعية", desc: "محرك محاكاة يحاكي الجاذبية، الاحتكاك، وتصادم الأجسام، مما يجعل تجربة البرمجة مطابقة للواقع." },
            { icon: Code, color: 'blue', title: "محرر متعدد المستويات", desc: "ابدأ بالسحب والإفلات (Blocks) وانتقل تدريجياً لكتابة كود Python الاحترافي في نفس البيئة." },
            { icon: Award, color: 'amber', title: "نظام التلعيب (Gamification)", desc: "احصل على نقاط، أوسمة، وتصدر قوائم المتصدرين مع كل تحدٍ تنجزه لزيادة الحماس." },
            { icon: Brain, color: 'purple', title: "المعلم الذكي AI", desc: "مساعد شخصي متاح 24/7 يحلل الكود، يشرح الأخطاء، ويقترح تحسينات بناءً على أسلوبك." },
            { icon: Globe, color: 'cyan', title: "ثنائي اللغة", desc: "واجهة ومحتوى يدعمان اللغة العربية والإنجليزية بالكامل، مع إمكانية التبديل الفوري." },
            { icon: Smartphone, color: 'rose', title: "يعمل على أي جهاز", desc: "لا حاجة لأجهزة كمبيوتر باهظة. المنصة تعمل بسلاسة على المتصفح حتى على الأجهزة اللوحية." }
        ].map((item, i) => (
             <div key={i} className="bg-slate-900 p-8 rounded-3xl border border-slate-800 hover:border-slate-600 transition-colors group">
                <div className={`w-14 h-14 ${colorClasses[item.color].bg} rounded-2xl flex items-center justify-center ${colorClasses[item.color].text} mb-6 group-hover:scale-110 transition-transform`}>
                    <item.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
        ))}
    </div>
  </div>
  );
};

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
  <div className="max-w-6xl mx-auto px-6 py-20">
    <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
       <div className="flex-1">
          <span className="text-emerald-500 font-bold tracking-wider text-sm uppercase">بوابة المدارس</span>
          <h2 className="text-4xl font-bold mb-6 mt-2">تحول رقمي شامل لمعامل الروبوت</h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            نقدم للمدارس منصة متكاملة لدمج تعليم الروبوتات في المناهج الدراسية دون الحاجة لتكاليف المعامل الباهظة أو الصيانة المعقدة. حل سحابي يعمل على أجهزة المدرسة الحالية.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
             <button className="bg-emerald-600 hover:bg-emerald-500 px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-emerald-600/20">طلب عرض تجريبي</button>
             <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-8 py-3 rounded-xl font-bold text-white">تحميل البروشور</button>
          </div>
       </div>
       <div className="flex-1 bg-slate-800/50 p-8 rounded-3xl border border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
          <h3 className="text-xl font-bold mb-6">شركاء النجاح</h3>
          <div className="grid grid-cols-2 gap-4">
             {['مدارس الرياض', 'أكاديمية طويق', 'مدارس المنهل', 'تعليم جازان'].map((n, i) => (
                 <div key={i} className="h-16 bg-slate-900/50 rounded-xl border border-slate-700/50 flex items-center justify-center text-slate-500 font-bold text-sm">
                    {n}
                 </div>
             ))}
          </div>
       </div>
    </div>

    {/* Benefits for Roles */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 mb-6"><Users size={24}/></div>
            <h3 className="text-xl font-bold text-white mb-4">للمعلمين</h3>
            <ul className="space-y-3 text-slate-400">
                <li className="flex gap-2"><Check size={18} className="text-blue-500 mt-0.5"/> تحضير دروس تلقائي ومناهج جاهزة.</li>
                <li className="flex gap-2"><Check size={18} className="text-blue-500 mt-0.5"/> متابعة تقدم الطلاب لحظة بلحظة.</li>
                <li className="flex gap-2"><Check size={18} className="text-blue-500 mt-0.5"/> أدوات كشف الغش والنسخ في الأكواد.</li>
            </ul>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-6"><Building size={24}/></div>
            <h3 className="text-xl font-bold text-white mb-4">لإدارة المدرسة</h3>
            <ul className="space-y-3 text-slate-400">
                <li className="flex gap-2"><Check size={18} className="text-emerald-500 mt-0.5"/> توفير 70% من ميزانية معامل الروبوت.</li>
                <li className="flex gap-2"><Check size={18} className="text-emerald-500 mt-0.5"/> تقارير دورية عن أداء المدرسة في STEM.</li>
                <li className="flex gap-2"><Check size={18} className="text-emerald-500 mt-0.5"/> دعم فني وتدريب للكادر التعليمي.</li>
            </ul>
        </div>
    </div>

    {/* Steps */}
    <div className="max-w-4xl mx-auto mt-20">
        <h3 className="text-2xl font-bold mb-12 text-center">رحلة الشراكة والاعتماد</h3>
        <div className="space-y-8 relative">
             <div className="absolute top-4 bottom-4 right-6 w-0.5 bg-slate-800"></div>
             
             {[
               { title: 'جلسة استكشافية', desc: 'نجتمع مع إدارة المدرسة وفريق التقنية لتحديد الاحتياجات التعليمية والبنية التحتية الحالية.' },
               { title: 'التخصيص والتكامل', desc: 'نربط المنصة بنظام إدارة التعلم (LMS) لديكم، ونختار المسارات التعليمية المناسبة للطلاب.' },
               { title: 'تدريب المعلمين (TOT)', desc: 'ورش عمل مكثفة للمعلمين لتمكينهم من استخدام أدوات المنصة وإدارة الفصول الافتراضية.' },
               { title: 'الإطلاق التجريبي', desc: 'تفعيل المنصة لصف دراسي واحد لقياس الأثر والتأكد من سلاسة التجربة.' },
               { title: 'الاعتماد الكامل', desc: 'تعميم التجربة على كافة المراحل، مع دعم فني متواصل وتقارير أداء دورية.' }
             ].map((step, i) => (
                 <div key={i} className="flex gap-6 relative">
                     <div className="w-12 h-12 shrink-0 bg-slate-900 border-2 border-emerald-500 rounded-full flex items-center justify-center font-bold text-emerald-400 z-10 shadow-lg shadow-emerald-900/20">
                         {i + 1}
                     </div>
                     <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex-1 hover:border-emerald-500/30 transition-colors">
                         <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                         <p className="text-slate-400 text-sm">{step.desc}</p>
                     </div>
                 </div>
             ))}
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
          { q: "هل أحتاج لخبرة سابقة في البرمجة؟", a: "لا، منصة مُلَقِّن مصممة لتبدأ معك من الصفر. نوفر مسار 'المبتدئ' الذي يستخدم البرمجة المرئية (Blockly) لتعليم المنطق دون كتابة كود، ثم نتدرج معك لتعلم Python." },
          { q: "ما هي المتطلبات التقنية لتشغيل المنصة؟", a: "مُلَقِّن منصة سحابية بالكامل. كل ما تحتاجه هو جهاز كمبيوتر (Windows, Mac, Linux) أو جهاز لوحي حديث، ومتصفح إنترنت (Chrome أو Edge) واتصال مستقر بالإنترنت." },
          { q: "هل المنهج معتمد؟", a: "نعم، تم تصميم مناهجنا وفقاً للمعايير العالمية لتعليم علوم الحاسب (CSTA) ومعايير التعليم التقني السعودية، ويتم مراجعتها من قبل خبراء أكاديميين." },
          { q: "هل يمكنني الحصول على الشهادة؟", a: "بالتأكيد. عند إتمام المسارات التدريبية واجتياز التحديات والمشاريع النهائية بنجاح، يتم إصدار شهادة إتمام موثقة برقم مرجعي يمكن إضافتها لسيرتك الذاتية." },
          { q: "هل يمكن للمدارس الاشتراك؟", a: "نعم، لدينا بوابة خاصة للمدارس تتيح للمعلمين إدارة الفصول، متابعة الطلاب، والحصول على تقارير تفصيلية. يمكنكم طلب عرض تجريبي من صفحة 'للمدارس'." },
          { q: "كيف يعمل المصحح الذكي (AI)؟", a: "يستخدم المُلَقِّن نماذج ذكاء اصطناعي متقدمة (Gemini) لتحليل الكود الخاص بك لحظياً. لا يعطيك الحل المباشر، بل يكتشف موضع الخطأ ويشرحه لك، كما يقترح تلميحات ذكية لتحسين كفاءة الكود." }
        ].map((item, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-emerald-500/30 transition-colors">
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

const LegalContent = ({ type }: { type: PublicView }) => {
  const isPrivacy = type === PublicView.PRIVACY;
  
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-slate-300">
       <div className="flex items-center gap-3 mb-8">
           {isPrivacy ? <Lock className="text-emerald-500" size={32} /> : <Shield className="text-emerald-500" size={32} />}
           <h2 className="text-3xl font-bold text-white">{isPrivacy ? 'سياسة الخصوصية' : 'الشروط والأحكام'}</h2>
       </div>
       
       <div className="bg-slate-900 p-8 lg:p-12 rounded-2xl border border-slate-800 space-y-10 leading-relaxed font-light">
          {isPrivacy ? (
              <>
                  <section>
                      <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">1. مقدمة عامة</h3>
                      <p>مرحباً بكم في منصة مُلَقِّن. نحن نلتزم بحماية خصوصيتك وضمان أمان بياناتك الشخصية. توضح وثيقة سياسة الخصوصية هذه أنواع المعلومات التي نجمعها، وكيفية استخدامها، وحقوقك فيما يتعلق بهذه البيانات، وذلك بما يتوافق مع أنظمة حماية البيانات المعمول بها.</p>
                  </section>
                  <section>
                      <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">2. البيانات التي نقوم بجمعها</h3>
                      <div className="space-y-4">
                        <p><strong className="text-slate-200">أ. البيانات الشخصية:</strong> عند التسجيل، قد نطلب معلومات مثل الاسم الكامل، البريد الإلكتروني، رقم الهاتف، اسم المدرسة أو المؤسسة التعليمية.</p>
                        <p><strong className="text-slate-200">ب. البيانات الأكاديمية:</strong> نقوم بتخزين تقدمك الدراسي، نتائج التحديات، الأكواد البرمجية التي تكتبها، وتقييمات الذكاء الاصطناعي.</p>
                        <p><strong className="text-slate-200">ج. البيانات التقنية:</strong> نجمع معلومات تلقائية مثل عنوان IP، نوع المتصفح، نظام التشغيل، وسجلات الوصول لتحسين تجربة المستخدم وأمان المنصة.</p>
                      </div>
                  </section>
                  <section>
                      <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">3. أغراض استخدام البيانات</h3>
                      <ul className="list-disc list-inside space-y-2 text-slate-400 marker:text-emerald-500">
                          <li>تقديم الخدمات التعليمية وتشغيل المحاكاة بكفاءة.</li>
                          <li>إصدار الشهادات والتقارير الأكاديمية للمعلمين وأولياء الأمور.</li>
                          <li>تحسين وتدريب نماذج الذكاء الاصطناعي (يتم استخدام بيانات مجهولة الهوية لهذا الغرض).</li>
                          <li>إرسال إشعارات حول التحديثات، الصيانة، أو المواد التعليمية الجديدة.</li>
                          <li>منع الاحتيال وضمان أمن المستخدمين.</li>
                      </ul>
                  </section>
                  <section>
                      <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">4. مشاركة البيانات والإفصاح عنها</h3>
                      <p>نحن لا نقوم ببيع أو تأجير بياناتك الشخصية لأي طرف ثالث. قد نشارك البيانات في الحالات التالية:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1 text-slate-400 marker:text-emerald-500">
                          <li>مع مقدمي الخدمات التقنية (مثل خدمات الاستضافة السحابية) الذين يلتزمون بمعايير أمان صارمة.</li>
                          <li>مع المؤسسة التعليمية (المدرسة) التي تتبع لها، لغرض متابعة الأداء.</li>
                          <li>الامتثال للمتطلبات القانونية أو التنظيمية.</li>
                      </ul>
                  </section>
                   <section>
                      <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">5. أمن البيانات</h3>
                      <p>نستخدم أحدث تقنيات التشفير (SSL/TLS) لحماية البيانات أثناء النقل، ونطبق إجراءات أمنية صارمة على خوادمنا لمنع الوصول غير المصرح به.</p>
                  </section>
                  <section>
                      <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">6. حقوق المستخدم</h3>
                      <p>لك الحق في طلب الوصول إلى بياناتك، تصحيحها، أو حذفها في أي وقت. يمكنك ممارسة هذه الحقوق عبر التواصل مع فريق الدعم الفني.</p>
                  </section>
              </>
          ) : (
              <>
                  <section>
                      <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">1. شروط الاستخدام</h3>
                      <p>تحكم هذه الشروط استخدامك لمنصة مُلَقِّن. بإنشاء حساب أو استخدام الموقع، فإنك توافق قانونياً على الالتزام بهذه الشروط. المنصة مخصصة للاستخدام التعليمي للطلاب، المعلمين، والمؤسسات.</p>
                  </section>
                  <section>
                      <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">2. الملكية الفكرية</h3>
                      <p>جميع حقوق الملكية الفكرية المتعلقة بالمنصة، بما في ذلك البرمجيات، الأكواد المصدرية، التصاميم، المناهج الدراسية، والعلامات التجارية، هي ملك حصري لشركة "مُلَقِّن" لتقنية التعليم.</p>
                      <p className="mt-2 text-slate-400">يُمنع نسخ، توزيع، أو هندسة عكسية لأي جزء من المنصة دون إذن كتابي مسبق.</p>
                  </section>
                  <section>
                      <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">3. حسابات المستخدمين</h3>
                      <p>أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور. تتحمل المسؤولية الكاملة عن جميع الأنشطة التي تحدث تحت حسابك. يجب إخطارنا فوراً عن أي استخدام غير مصرح به.</p>
                  </section>
                  <section>
                      <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">4. سلوك المستخدم</h3>
                      <ul className="list-disc list-inside space-y-2 text-slate-400 marker:text-emerald-500">
                          <li>يمنع استخدام المنصة لأي غرض غير قانوني أو ضار.</li>
                          <li>يمنع محاولة تعطيل الخوادم أو الشبكات المرتبطة بالمنصة.</li>
                          <li>يمنع استخدام أدوات الغش أو البرمجيات التلقائية (Bots) في حل التحديات.</li>
                          <li>يجب احترام الآخرين في المنتديات وغرف الدردشة وعدم نشر محتوى مسيء.</li>
                      </ul>
                  </section>
                  <section>
                      <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">5. الاشتراكات والمدفوعات</h3>
                      <p>الخدمات المدفوعة تخضع لرسوم اشتراك تجدد تلقائياً. يمكن إلغاء الاشتراك في أي وقت، وسيستمر الوصول حتى نهاية فترة الفوترة الحالية. لا توجد مبالغ مستردة للفترات الجزئية.</p>
                  </section>
                  <section>
                      <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-800 pb-2">6. إخلاء المسؤولية</h3>
                      <p>يتم تقديم المنصة "كما هي". لا نضمن خلوها من الأخطاء أو انقطاع الخدمة، رغم سعينا الدائم لتحسين الجودة. لن نكون مسؤولين عن أي أضرار غير مباشرة ناتجة عن استخدام المنصة.</p>
                  </section>
              </>
          )}
          
          <div className="pt-8 border-t border-slate-800 flex justify-between items-center text-sm text-slate-500">
              <span>آخر تحديث: 01 يونيو 2025</span>
              <span>رقم النسخة: 2.4.1</span>
          </div>
       </div>
    </div>
  );
};

export default LandingPage;