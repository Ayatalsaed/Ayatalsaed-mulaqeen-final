import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Trophy, Clock, Zap, Target } from 'lucide-react';
import { Challenge } from '../types';

interface DashboardProps {
  challenges: Challenge[];
}

const data = [
  { subject: 'المنطق البرمجي', A: 120, fullMark: 150 },
  { subject: 'كفاءة الحل', A: 98, fullMark: 150 },
  { subject: 'استخدام الحساسات', A: 86, fullMark: 150 },
  { subject: 'الإبداع', A: 99, fullMark: 150 },
  { subject: 'تصحيح الأخطاء', A: 85, fullMark: 150 },
  { subject: 'السرعة', A: 65, fullMark: 150 },
];

const activityData = [
  { name: 'السبت', hours: 2 },
  { name: 'الأحد', hours: 4 },
  { name: 'الاثنين', hours: 1 },
  { name: 'الثلاثاء', hours: 3 },
  { name: 'الأربعاء', hours: 5 },
  { name: 'الخميس', hours: 2 },
  { name: 'الجمعة', hours: 0 },
];

const Dashboard: React.FC<DashboardProps> = ({ challenges }) => {
  return (
    <div className="p-6 lg:p-10 space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">مرحباً، عبد الله 👋</h2>
          <p className="text-slate-400">استمر في التقدم، أنت قريب من فتح مستوى "المطور المحترف".</p>
        </div>
        <div className="bg-slate-800 p-2 rounded-lg flex items-center gap-2 border border-slate-700">
           <span className="text-sm text-slate-400 px-2">المستوى الحالي:</span>
           <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded font-bold border border-emerald-500/30">المستوى 5</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Trophy, label: 'الإنجازات المكتملة', value: '12', color: 'text-amber-400' },
          { icon: Zap, label: 'نقاط الخبرة', value: '2,450', color: 'text-cyan-400' },
          { icon: Clock, label: 'ساعات التدريب', value: '34h', color: 'text-emerald-400' },
          { icon: Target, label: 'دقة الحلول', value: '88%', color: 'text-rose-400' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl flex items-center gap-4 hover:border-emerald-500/30 transition-colors">
            <div className={`w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-sm">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-1 bg-slate-800/50 border border-slate-700 rounded-3xl p-6 relative overflow-hidden">
          <h3 className="text-xl font-bold text-white mb-4">تحليل المهارات</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar name="Student" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Challenges List */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-3xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">التحديات النشطة</h3>
          <div className="space-y-3">
            {challenges.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl border border-slate-700 hover:border-slate-500 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${c.completed ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`}></div>
                  <div>
                    <h4 className="font-bold text-slate-100">{c.title}</h4>
                    <p className="text-sm text-slate-400">{c.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded border ${
                    c.difficulty === 'Easy' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                    c.difficulty === 'Medium' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' :
                    'border-rose-500/30 text-rose-400 bg-rose-500/10'
                  }`}>
                    {c.difficulty}
                  </span>
                  <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                    {c.completed ? 'مراجعة' : 'ابـدأ'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;