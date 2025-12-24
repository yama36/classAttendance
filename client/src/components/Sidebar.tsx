import { useState } from 'react';
import { useAttendance } from '@/contexts/AttendanceContext';
import { cn, getStatusLabel } from '@/lib/utils';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { ClassManagerModal } from './ClassManagerModal';

export function Sidebar() {
  const { getCurrentClass, currentDate, classes, currentClassId, setCurrentClassId } = useAttendance();
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const currentClass = getCurrentClass();

  if (!currentClass) return null;

  const getStudentStatus = (studentId: string) => {
    const student = currentClass.students.find(s => s.id === studentId);
    const record = student?.records.find(r => r.date === currentDate);
    return record?.status || 'present';
  };

  const absentStudents = currentClass.students.filter(s => {
    const status = getStudentStatus(s.id);
    return status !== 'present';
  });

  return (
    <div className="w-full md:w-80 flex flex-col gap-6 h-full font-['Yomogi']">
      {/* Class Selector & Date - Blackboard style card */}
      <div className="bg-[#6B7F56] p-6 rounded-sm shadow-md text-white relative overflow-hidden">
        {/* Chalk dust effect */}
        <div className="absolute inset-0 bg-white opacity-5 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }}></div>
        
        <h2 className="text-lg font-bold mb-4 border-b-2 border-white/30 pb-2 inline-block">Classroom</h2>
        
        <div className="space-y-4 relative z-10">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-bold opacity-80">クラス</label>
              <button 
                onClick={() => setIsManagerModalOpen(true)}
                className="text-xs text-white/80 hover:text-white underline"
              >
                管理
              </button>
            </div>
            <select 
              value={currentClassId}
              onChange={(e) => setCurrentClassId(e.target.value)}
              className="w-full p-2 rounded-sm border-2 border-white/30 bg-white/10 text-white focus:outline-none focus:border-white"
            >
              {classes.map(cls => (
                <option key={cls.id} value={cls.id} className="text-slate-900">{cls.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Absentee List - Notebook paper style */}
      <div className="flex-1 bg-[#FFFDF0] p-6 rounded-sm shadow-md overflow-hidden flex flex-col relative border-l-8 border-[#E2E8F0]">
        {/* Notebook lines */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#E5E7EB 1px, transparent 1px)', backgroundSize: '100% 2rem', marginTop: '3rem' }}></div>
        
        <h2 className="text-lg font-bold text-[#4A4A4A] mb-6 relative z-10 flex items-center gap-2">
          <span className="bg-[#F4B4B4] text-white px-2 py-1 rounded-sm text-sm transform -rotate-2">Memo</span>
          欠席・遅刻・早退 ({absentStudents.length})
        </h2>
        
        <div className="flex-1 overflow-y-auto pr-2 relative z-10">
          {absentStudents.length === 0 ? (
            <div className="text-slate-400 text-center py-8 font-bold transform rotate-2">
              みんな出席！
            </div>
          ) : (
            <ul className="space-y-0">
              {absentStudents.map(student => {
                const status = getStudentStatus(student.id);
                return (
                  <li key={student.id} className="flex items-center justify-between py-2 border-b border-transparent h-8">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#6B7F56] w-6">{student.number}</span>
                      <span className="font-bold text-[#4A4A4A]">{student.name}</span>
                    </div>
                    <span className={cn(
                      "text-xs font-bold px-2 py-0.5 rounded-sm transform rotate-1",
                      status === 'absent' && "bg-[#F4B4B4] text-white",
                      status === 'late' && "bg-[#F9E0B0] text-white",
                      status === 'leaveEarly' && "bg-[#9FB1C9] text-white"
                    )}>
                      {getStatusLabel(status)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <ClassManagerModal open={isManagerModalOpen} onOpenChange={setIsManagerModalOpen} />
    </div>
  );
}
