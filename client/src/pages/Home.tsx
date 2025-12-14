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

function Header() {
  const { getCurrentClass, currentDate } = useAttendance();
  const currentClass = getCurrentClass();

  return (
    <header className="bg-[#6B7F56] text-white sticky top-0 z-10 shadow-sm border-b border-white/10 shrink-0">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* 左上のクラスロゴ再現 */}
        <div className="relative transform -rotate-2">
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
        <div className="text-lg md:text-2xl font-bold tracking-widest text-white/90">
          {format(new Date(currentDate), 'yyyy年MM月dd日 (eee)', { locale: ja })}
        </div>

        {/* ハンバーガーメニュー (モバイルのみ) */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="w-12 h-12 bg-[#5A6E48] rounded-md flex items-center justify-center hover:bg-[#4E603E] transition-colors shadow-inner border border-white/10 text-white">
                <Menu className="w-6 h-6" />
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

export default function Home() {
  return (
    <AttendanceProvider>
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

        {/* Footer decoration */}
        <div className="h-12 bg-[#6B7F56] flex items-center justify-center gap-8 overflow-hidden opacity-50 shrink-0">
          {/* Chalk lines */}
          <div className="w-16 h-1 bg-white/60 rounded-full transform rotate-1"></div>
          <div className="w-16 h-1 bg-white/60 rounded-full transform -rotate-1"></div>
          <div className="w-4 h-4 bg-white/60 clip-path-triangle"></div>
          <div className="w-16 h-1 bg-white/60 rounded-full transform rotate-1"></div>
          <div className="w-4 h-4 bg-white/60 clip-path-triangle transform rotate-180"></div>
          <div className="w-16 h-1 bg-white/60 rounded-full transform -rotate-1"></div>
        </div>
      </div>
    </AttendanceProvider>
  );
}
