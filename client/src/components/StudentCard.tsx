import { useDraggable } from '@dnd-kit/core';
import { cn, getStatusLabel, getShortStatusLabel } from '@/lib/utils';
import { AttendanceStatus } from '@/types';

interface StudentCardProps {
  id: string;
  number: number;
  name: string;
  lastName?: string;
  status: AttendanceStatus;
  editMode: boolean;
  onClick?: () => void;
  className?: string;
}

export function StudentCard({ id, number, name, lastName, status, editMode, onClick, className }: StudentCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
    data: { id, number, name, lastName, status },
    disabled: !editMode,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 50,
  } : undefined;

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
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-sm transition-all duration-200 select-none",
        "w-full h-full", 
        editMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        "group",
        className
      )}
    >
      {/* 椅子 (机の上側=奥側に配置) - SPでは非表示 */}
      <div className="hidden md:block absolute top-0 w-3/4 h-4 bg-[#8B5E3C] rounded-b-md transform -translate-y-1/2 z-0 shadow-sm"></div>

      {/* 机本体 */}
      <div className={cn(
        "relative w-full h-full rounded-sm shadow-md flex flex-col items-center justify-center md:justify-between z-10 overflow-hidden",
        "py-0.5 md:py-2", // パディング調整
        "border-b-2 md:border-b-4 border-black/10", // ボーダー調整
        getDeskColor(status)
      )}>
        
        {/* 名前表示エリア */}
        <div className="flex-none md:flex-1 flex items-center justify-center w-full px-0.5 md:px-1">
          
          {/* SP: 名字のみ、極小サイズ */}
          <div className="md:hidden flex flex-col items-center justify-center leading-none text-white font-bold drop-shadow-sm w-full overflow-hidden">
            <span className="text-[9px] opacity-90">{number}</span>
            <span className="text-[10px] w-full text-center truncate">{familyName}</span>
          </div>

          {/* PC: 番号.フルネーム */}
          <div className="hidden md:block text-white font-bold text-lg tracking-wider drop-shadow-md text-center leading-tight w-full truncate">
            {number}.{name}
          </div>
        </div>

        {/* ステータス表示 */}
        <div className="flex-none md:mb-2 w-full flex justify-center items-center">
          {/* SP: 短縮ラベル (例: 欠) */}
          {status !== 'present' && (
            <div className={cn(
              "md:hidden text-[9px] font-bold text-white px-1 py-0.5 rounded-sm leading-none mt-0.5",
              "bg-black/20 backdrop-blur-sm"
            )}>
              {getShortStatusLabel(status)}
            </div>
          )}

          {/* PC: 通常ラベル */}
          <div className={cn(
            "hidden md:block px-2 py-0.5 rounded-full text-xs font-bold text-white shadow-sm tracking-widest transform rotate-[-2deg]",
            getLabelColor(status)
          )}>
            {getStatusLabel(status)}
          </div>
        </div>
      </div>
    </div>
  );
}
