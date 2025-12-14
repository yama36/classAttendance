import { useState, useMemo } from 'react';
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { useAttendance } from '@/contexts/AttendanceContext';
import { StudentCard } from './StudentCard';
import { DropZone } from './DropZone';
import { AttendanceStatus } from '@/types';
import { cn } from '@/lib/utils';

// グリッド設定定数
const FIXED_COLS = 6;
const MIN_CARD_WIDTH = 120;
const MIN_CARD_HEIGHT = 90;

export function AttendanceBoard() {
  const { getCurrentClass, currentDate, updateAttendance, viewMode } = useAttendance();
  const currentClass = getCurrentClass();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<any>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

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

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setActiveData(event.active.data.current);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id) {
      const studentId = active.id as string;
      const newStatus = over.id as AttendanceStatus;
      
      updateAttendance(studentId, newStatus);
    }
    
    setActiveId(null);
    setActiveData(null);
  };

  const handleCardClick = (studentId: string, currentStatus: AttendanceStatus) => {
    if (viewMode === 'student') return;
    
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

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-full gap-6 font-['Yomogi']">
        {viewMode === 'teacher' && (
          <div className="grid grid-cols-4 gap-4 shrink-0">
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
        )}

        <div className={cn(
          "flex-1 bg-white rounded-sm p-6 shadow-md relative transition-all duration-500 overflow-auto",
          viewMode === 'student' ? "rotate-180" : ""
        )}>
          {/* グリッドコンテナ */}
          <div 
            className={cn(
              "grid gap-4 h-full", 
              viewMode === 'student' ? "rotate-180" : ""
            )}
            style={{
              gridTemplateColumns: gridStyle.templateCols,
              gridTemplateRows: gridStyle.templateRows,
            }}
          >
            {currentClass.students.map((student) => (
              <StudentCard
                key={student.id}
                id={student.id}
                number={student.number}
                name={student.name}
                lastName={student.lastName} // 追加
                status={getStudentStatus(student.id)}
                editMode={viewMode === 'teacher'}
                onClick={() => handleCardClick(student.id, getStudentStatus(student.id))}
              />
            ))}
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId && activeData ? (
          <div 
            className="opacity-90 rotate-3 scale-105" 
            style={{ 
              width: `${MIN_CARD_WIDTH}px`,
              height: `${MIN_CARD_HEIGHT}px`
            }}
          >
            <StudentCard
              id={activeId}
              number={activeData.number}
              name={activeData.name}
              lastName={activeData.lastName} // 追加
              status={activeData.status}
              editMode={true}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
