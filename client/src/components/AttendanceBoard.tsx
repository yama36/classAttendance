import { useMemo } from 'react';
import { useAttendance } from '@/contexts/AttendanceContext';
import { StudentCard } from './StudentCard';
import { DropZone } from './DropZone';
import { AttendanceStatus } from '@/types';
import { cn } from '@/lib/utils';

// グリッド設定定数
const FIXED_COLS = 6;
const MIN_CARD_WIDTH = 0; // SP対応のため0にする（親コンテナに合わせて縮小）
const MIN_CARD_HEIGHT = 0; // SP対応のため0にする

export function AttendanceBoard() {
  const { getCurrentClass, currentDate, updateAttendance } = useAttendance();
  const currentClass = getCurrentClass();

  const gridStyle = useMemo(() => {
    const count = currentClass?.students.length || 0;
    const rows = Math.ceil(count / FIXED_COLS);

    // CSS Gridのminmax関数を使用
    return {
      templateCols: `repeat(${FIXED_COLS}, minmax(${MIN_CARD_WIDTH}px, 1fr))`,
      templateRows: `repeat(${rows}, minmax(${MIN_CARD_HEIGHT}px, 1fr))`,
      cols: FIXED_COLS,
      rows
    };
  }, [currentClass?.students.length]);

  if (!currentClass) return <div>クラスが選択されていません</div>;

  const handleCardClick = (studentId: string, currentStatus: AttendanceStatus) => {
    const statuses: AttendanceStatus[] = ['present', 'absent', 'late', 'leaveEarly'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    
    updateAttendance(studentId, nextStatus);
  };

  const getStudentStatus = (studentId: string) => {
    const student = currentClass.students.find(s => s.id === studentId);
    const record = student?.records.find(r => r.date === currentDate);
    return record?.status || 'present';
  };

  const counts = {
    present: currentClass.students.filter(s => getStudentStatus(s.id) === 'present').length,
    absent: currentClass.students.filter(s => getStudentStatus(s.id) === 'absent').length,
    late: currentClass.students.filter(s => getStudentStatus(s.id) === 'late').length,
    leaveEarly: currentClass.students.filter(s => getStudentStatus(s.id) === 'leaveEarly').length,
  };

  // 教師視点（右下起点）にするため、グリッド全体を180度回転させる
  const students = currentClass.students;

  return (
    <div className="flex flex-col h-full gap-2 md:gap-6 font-['Yomogi']">
      {/* SP時のみ上部にドロップゾーンを表示（PCではサイドバーに移動） */}
      <div className="md:hidden grid grid-cols-4 gap-2 shrink-0">
        <DropZone 
          id="present" 
          label="出席" 
          count={counts.present}
          colorClass=""
        />
        <DropZone 
          id="absent" 
          label="欠席" 
          count={counts.absent}
          colorClass=""
        />
        <DropZone 
          id="late" 
          label="遅刻" 
          count={counts.late}
          colorClass=""
        />
        <DropZone 
          id="leaveEarly" 
          label="早退" 
          count={counts.leaveEarly}
          colorClass=""
        />
      </div>

      <div className={cn(
        "flex-1 bg-white rounded-sm p-2 md:p-6 shadow-md relative transition-all duration-500 overflow-hidden"
      )}>
        {/* グリッドコンテナ */}
        <div 
          className={cn(
            "grid gap-1 md:gap-4 h-full",
            "rotate-180" // グリッド全体を180度回転（右下が起点になる）
          )}
          style={{
            gridTemplateColumns: gridStyle.templateCols,
            gridTemplateRows: gridStyle.templateRows,
          }}
        >
          {students.map((student) => (
            <StudentCard
              key={student.id}
              id={student.id}
              number={student.number}
              name={student.name}
              lastName={student.lastName}
              status={getStudentStatus(student.id)}
              editMode={true}
              onClick={() => handleCardClick(student.id, getStudentStatus(student.id))}
              className="rotate-180" // カードの向きを元に戻す
            />
          ))}
        </div>
      </div>
    </div>
  );
}
