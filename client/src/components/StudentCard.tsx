import { cn, getStatusLabel } from '@/lib/utils';
import { AttendanceStatus } from '@/types';

interface StudentCardProps {
  id: string;
  number: number;
  name: string;
  lastName?: string;
  status: AttendanceStatus;
  editMode: boolean;
  onClick?: () => void;
}

export function StudentCard({ id, number, name, lastName, status, editMode, onClick }: StudentCardProps) {

  // ステータスに応じた机の色設定
  const getDeskColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present': return 'bg-[#C4A484]'; // 通常の机の色（茶色）
      case 'absent': return 'bg-[#F4B4B4]';   // 遅刻（ピンク）
      case 'late': return 'bg-[#F9E0B0]'; // 早退（黄色）
      case 'leaveEarly': return 'bg-[#9FB1C9]'; // 欠席（青グレー）
      default: return 'bg-[#C4A484]';
    }
  };

  // ステータスラベルの背景色（スタンプ風）
  const getLabelColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present': return 'bg-[#7FB5B5]'; // 少し濃いティール
      case 'absent': return 'bg-[#D98E8E]';   // 濃いピンク
      case 'late': return 'bg-[#E0C080]'; // 濃い黄色
      case 'leaveEarly': return 'bg-[#7A8CA3]'; // 濃い青グレー
      default: return 'bg-transparent';
    }
  };

  // 姓の決定（lastNameがなければnameから推測、スペース区切り）
  const familyName = lastName || name.split(/[\s　]+/)[0];

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-sm transition-all duration-200 select-none",
        "w-full h-full", // 親グリッドセルいっぱいに広げる
        editMode ? "cursor-pointer hover:scale-105" : "cursor-default",
        "group"
      )}
    >
      {/* 椅子 (机の上側=奥側に配置) */}
      <div className="absolute top-0 w-3/4 h-4 bg-[#8B5E3C] rounded-b-md transform -translate-y-1/2 z-0 shadow-sm"></div>

      {/* 机本体 */}
      <div className={cn(
        "relative w-full h-full rounded-sm shadow-md flex flex-col items-center justify-between z-10 overflow-hidden border-b-4 border-black/10 py-2",
        getDeskColor(status)
      )}>
        
        {/* 上部余白と名前 */}
        <div className="flex-1 flex items-center justify-center w-full px-1">
          <div className="text-white font-bold text-lg tracking-wider drop-shadow-md text-center leading-tight w-full truncate">
            {/* SP: 番号.姓 */}
            <span className="md:hidden">{number}.{familyName}</span>
            {/* PC: 番号.フルネーム */}
            <span className="hidden md:inline">{number}.{name}</span>
          </div>
        </div>

        {/* ステータス表示（中央下） */}
        <div className="mb-2">
          <div className={cn(
            "px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-sm tracking-widest transform rotate-[-2deg]",
            getLabelColor(status)
          )}>
            {getStatusLabel(status)}
          </div>
        </div>

        {/* 机のディテール：下部の溝（ペントレイ） */}
        <div className="w-1/2 h-1.5 bg-black/10 rounded-full mb-1"></div>
      </div>
    </div>
  );
}
