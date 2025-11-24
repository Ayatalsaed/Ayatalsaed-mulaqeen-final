import React from 'react';
import { Users, FileText, TrendingUp, AlertCircle, Plus, Search, MoreVertical, CheckCircle, Clock } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const STUDENTS_DATA = [
  { id: 1, name: 'أحمد محمد', progress: 85, status: 'Active', lastActive: '2 min ago', avatar: 'AM' },
  { id: 2, name: 'سارة خالد', progress: 92, status: 'Active', lastActive: '1 hr ago', avatar: 'SK' },
  { id: 3, name: 'عمر فهد', progress: 45, status: 'Needs Help', lastActive: '2 days ago', avatar: 'OF' },
  { id: 4, name: 'نورة السعيد', progress: 78, status: 'Active', lastActive: '5 min ago', avatar: 'NS' },
  { id: 5, name: 'فيصل الراشد', progress: 60, status: 'Inactive', lastActive: '1 week ago', avatar: 'FR' },
];

const ASSIGNMENTS_DATA = [
  { id: 1, title: 'تحدي المتاهة الذكية', due: '2025-06-15', completed: 18, total: 25, status: 'Active' },
  { id: 2, title: 'برمجة الحساسات - المستوي 1', due: '2025-06-10', completed: 25, total: 25, status: 'Closed' },
  { id: 3, title: 'مشروع الذراع الآلي', due: '2025-06-20', completed: 5, total: 25, status: 'Upcoming' },
];

const PERFORMANCE_DATA = [
  { name: 'Week 1', avg: 65 },
  { name: 'Week 2', avg: 72 },
  { name: 'Week 3', avg: 68 },
  { name: 'Week 4', avg: 85 },
  { name: 'Week 5', avg: 82 },
  { name: 'Week 6', avg: 90 },
];

const SKILLS_DATA = [
  { subject: 'المنطق', A: 85, fullMark: 100 },
  { subject: 'الحساسات', A: 70, fullMark: 100 },
  { subject: 'الكفاءة', A: 90, fullMark: 100 },
  { subject: 'التعاون', A: 65, fullMark: 100 },
  { subject: 'الإبداع', A: 80, fullMark: 100 },
  { subject: 'التصحيح', A: 75, fullMark: 100 },
];

const TrainerDashboard: React.FC = () => {
  return (
    <div className="p-6 lg:p-10 space-y-8 animate-fadeIn text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-1">لوحة المدرب</h2>
          <p className="text-slate-400">إدارة الفصول، متابعة الطلاب، وتقييم الأداء.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold shadow-lg shadow-emerald-600/20 transition-all">
          <Plus size={18} />
          <span>مهمة جديدة</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'إجمالي الطلاب', value: '125', sub: '+12 هذا الأسبوع', color: 'bg-blue-500/10 text-blue-500' },
          { icon: FileText, label: 'الواجبات النشطة', value: '4', sub: '2 تنتهي قريباً', color: 'bg-emerald-500/10 text-emerald-500' },
          { icon: TrendingUp, label: 'متوسط الأداء', value: '82%', sub: '+5% عن الشهر الماضي', color: 'bg-amber-500/10 text-amber-500' },
          { icon: AlertCircle, label: 'بحاجة لمساعدة', value: '3', sub: 'طلاب متعثرين', color: 'bg-rose-500/10 text-rose-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-slate-800/50 border border-slate-700 p-5 rounded-2xl flex items-center justify-between hover:border-slate-600 transition-colors">
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              <p className="text-xs text-slate-500 mt-1">{stat.sub}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Section: Students List */}
        <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
           <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">قائمة الطلاب</h3>
              <div className="relative">
                 <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                 <input 
                    type="text" 
                    placeholder="بحث..." 
                    className="bg-slate-900 border border-slate-700 rounded-lg pr-9 pl-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 w-48"
                 />
              </div>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-right">
                <thead>
                   <tr className="text-slate-400 text-sm border-b border-slate-700">
                      <th className="pb-3 pr-2">الطالب</th>
                      <th className="pb-3">الحالة</th>
                      <th className="pb-3">التقدم</th>
                      <th className="pb-3">آخر ظهور</th>
                      <th className="pb-3"></th>
                   </tr>
                </thead>
                <tbody className="text-sm">
                   {STUDENTS_DATA.map((student) => (
                      <tr key={student.id} className="group border-b border-slate-700/50 last:border-0 hover:bg-slate-700/20 transition-colors">
                         <td className="py-3 pr-2">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                                  {student.avatar}
                               </div>
                               <span className="font-medium text-slate-200">{student.name}</span>
                            </div>
                         </td>
                         <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                student.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' :
                                student.status === 'Needs Help' ? 'bg-rose-500/10 text-rose-400' :
                                'bg-slate-500/10 text-slate-400'
                            }`}>
                                {student.status === 'Active' ? 'نشط' : student.status === 'Needs Help' ? 'متعثر' : 'غائب'}
                            </span>
                         </td>
                         <td className="py-3">
                            <div className="flex items-center gap-2">
                               <div className="flex-1 w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                  <div className={`h-full rounded-full ${student.progress < 50 ? 'bg-rose-500' : student.progress < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${student.progress}%` }}></div>
                               </div>
                               <span className="text-xs text-slate-400">{student.progress}%</span>
                            </div>
                         </td>
                         <td className="py-3 text-slate-500 font-mono text-xs">
                            {student.lastActive}
                         </td>
                         <td className="py-3 text-left pl-2">
                            <button className="text-slate-500 hover:text-white transition-colors">
                               <MoreVertical size={16} />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
           </div>
        </div>

        {/* Right Section: Analytics & Tasks */}
        <div className="flex flex-col gap-6">
           
           {/* Performance Chart */}
           <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">تحليل الأداء العام</h3>
              <div className="h-40">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={PERFORMANCE_DATA}>
                       <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                       <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} hide />
                       <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                       <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc', fontSize: '12px' }}
                          itemStyle={{ color: '#10b981' }}
                       />
                       <Line type="monotone" dataKey="avg" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
                    </LineChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Skills Radar Chart (New) */}
           <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 relative overflow-hidden">
              <h3 className="text-lg font-bold text-white mb-4">متوسط مهارات الفصل</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={SKILLS_DATA}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="Class Avg" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
           </div>

           {/* Assignments List */}
           <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex-1">
              <h3 className="text-lg font-bold text-white mb-4">الواجبات والتحديات</h3>
              <div className="space-y-3">
                 {ASSIGNMENTS_DATA.map((assign) => (
                    <div key={assign.id} className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 hover:border-emerald-500/30 transition-colors">
                       <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-slate-200 text-sm">{assign.title}</h4>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${assign.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : assign.status === 'Closed' ? 'bg-slate-700 text-slate-400' : 'bg-amber-500/10 text-amber-400'}`}>
                             {assign.status}
                          </span>
                       </div>
                       <div className="flex justify-between items-center text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Clock size={12}/> {assign.due}</span>
                          <span className="flex items-center gap-1"><CheckCircle size={12}/> {assign.completed}/{assign.total}</span>
                       </div>
                       {/* Mini Progress */}
                       <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(assign.completed / assign.total) * 100}%` }}></div>
                       </div>
                    </div>
                 ))}
              </div>
              <button className="w-full mt-4 py-2 border border-slate-700 text-slate-400 rounded-lg text-sm hover:bg-slate-800 hover:text-white transition-colors">
                 عرض كل الواجبات
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default TrainerDashboard;