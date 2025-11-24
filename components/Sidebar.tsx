import React from 'react';
import { LayoutDashboard, Code, Bot, Settings, Award, Layers, Users } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: View.DASHBOARD, label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: View.EDITOR, label: 'المعمل البرمجي', icon: Code },
    { id: View.BUILDER, label: 'بناء الروبوت', icon: Bot },
    { id: View.SIMULATION, label: 'المحاكاة', icon: Layers },
    { id: View.TRAINER_DASHBOARD, label: 'بوابة المدرب', icon: Users },
  ];

  return (
    <div className="w-20 lg:w-64 h-screen bg-slate-900 border-l border-slate-700 flex flex-col items-center lg:items-stretch py-6 shadow-xl z-20">
      <div className="flex items-center justify-center lg:justify-start lg:px-6 mb-10 gap-3">
        <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <Bot className="text-white w-6 h-6" />
        </div>
        <h1 className="hidden lg:block text-2xl font-bold text-white tracking-wide">مُلَقِّن</h1>
      </div>

      <nav className="flex-1 px-3 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group
              ${currentView === item.id 
                ? 'bg-gradient-to-l from-emerald-600 to-emerald-500 text-white shadow-md' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
          >
            <item.icon className={`w-6 h-6 ${currentView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
            <span className="hidden lg:block font-medium">{item.label}</span>
            {currentView === item.id && (
              <div className="absolute left-0 w-1 h-8 bg-white rounded-r-full lg:hidden"></div>
            )}
          </button>
        ))}
      </nav>

      <div className="px-3 mt-auto space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
          <Award className="w-6 h-6" />
          <span className="hidden lg:block">الشهادات</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
          <Settings className="w-6 h-6" />
          <span className="hidden lg:block">الإعدادات</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;