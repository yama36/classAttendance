import { useState } from 'react';
import {
  AttendanceProvider,
  useAttendance,
} from "@/contexts/AttendanceContext";
import { AttendanceBoard } from "@/components/AttendanceBoard";
import { Sidebar } from "@/components/Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { DndContext, DragOverlay, DragStartEvent, DragEndEvent, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { StudentCard } from "@/components/StudentCard";
import { AttendanceStatus } from "@/types";

function Header() {
  const { getCurrentClass, currentDate } = useAttendance();
  const currentClass = getCurrentClass();

  return (
    <header className="bg-[#6B7F56] text-white sticky top-0 z-10 shadow-sm border-b border-white/10 shrink-0">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
        {/* 左上のクラスロゴ再現 */}
        <div className="relative transform -rotate-2 scale-[0.8] origin-left md:scale-100 shrink-0">
          {/* 白い紙の背景 */}
          <div className="bg-white text-[#4A4A4A] p-2 rounded-sm shadow-md border border-gray-200 w-32 text-center relative">
            {/* 黒いテープ（左上） */}
            <div className="absolute -top-2 -left-2 w-8 h-4 bg-[#333] transform -rotate-45 opacity-90 shadow-sm"></div>
            {/* 黒いテープ（右下） */}
            <div className="absolute -bottom-2 -right-2 w-8 h-4 bg-[#333] transform -rotate-45 opacity-90 shadow-sm"></div>

            <div className="text-2xl font-bold leading-none truncate px-1">
              {currentClass?.name || "---"}
            </div>
            <div className="text-xs font-bold tracking-wider">classroom</div>
          </div>
        </div>

        {/* 日付表示（ヘッダー中央） */}
        <div className="text-base sm:text-xl md:text-2xl font-bold tracking-widest text-white/90 flex-1 text-center truncate px-2">
          {/* SP: 短縮表示 (例: 12/24 (水)) */}
          <span className="md:hidden">
            {format(new Date(currentDate), 'MM月dd日 (eee)', { locale: ja })}
          </span>
          {/* PC: フル表示 */}
          <span className="hidden md:inline">
            {format(new Date(currentDate), 'yyyy年MM月dd日 (eee)', { locale: ja })}
          </span>
        </div>

        {/* ハンバーガーメニュー (モバイルのみ) */}
        <div className="md:hidden shrink-0">
          <Sheet>
            <SheetTrigger asChild>
              <button className="w-10 h-10 bg-[#5A6E48] rounded-md flex items-center justify-center hover:bg-[#4E603E] transition-colors shadow-inner border border-white/10 text-white">
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 border-l-[#6B7F56] bg-[#6B7F56] w-80 overflow-y-auto">
              <div className="min-h-full p-6">
                 <Sidebar />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
        {/* デスクトップ用のプレースホルダー（レイアウトバランス用） - モバイルでは非表示 */}
        <div className="hidden md:block w-32"></div> 
      </div>
    </header>
  );
}

function HomeContent() {
  const { updateAttendance } = useAttendance();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeData, setActiveData] = useState<any>(null);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 10 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } })
  );

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

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-[100dvh] bg-[#6B7F56] text-[#4A4A4A] font-['Yomogi'] flex flex-col overflow-hidden overscroll-none">
        <Header />

        <main className="container mx-auto px-4 py-6 flex-1 min-h-0">
          <div className="flex flex-col md:flex-row gap-8 h-full">
            <div className="flex-1 h-full min-h-0">
              <AttendanceBoard />
            </div>
            {/* デスクトップのみサイドバーを右側に表示 */}
            <div className="hidden md:block h-full shrink-0">
              <Sidebar />
            </div>
          </div>
        </main>

        <DragOverlay>
          {activeId && activeData ? (
            <div 
              className="opacity-90 rotate-3 scale-105 w-20 h-14 md:w-32 md:h-24" 
            >
              <StudentCard
                id={activeId}
                number={activeData.number}
                name={activeData.name}
                lastName={activeData.lastName}
                status={activeData.status}
                editMode={true}
              />
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

export default function Home() {
  return (
    <AttendanceProvider>
      <HomeContent />
    </AttendanceProvider>
  );
}
