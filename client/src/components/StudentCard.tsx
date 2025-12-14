import { useDraggable } from '@dnd-kit/core';
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
        "w-full h-full", // 親グリッドセルいっぱいに広げる
        editMode ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        "group"
      )}
    >
      {/* 椅子 (机の下にしまわれている状態) - 机の後ろ（レイヤー的に下）に配置 */}
      <div className="absolute bottom-0 w-3/4 h-4 bg-[#8B5E3C] rounded-t-md transform translate-y-1/2 z-0 shadow-sm"></div>

      {/* 机本体 */}
      <div className={cn(
        "relative w-full h-full rounded-sm shadow-md flex flex-col items-center justify-center z-10 overflow-hidden border-b-4 border-black/10",
        getDeskColor(status)
      )}>
        {/* 机のディテール：上部の溝（ペントレイ） */}
        <div className="absolute top-3 w-1/2 h-1.5 bg-black/10 rounded-full"></div>

        {/* 名前表示 */}
        <div className="mt-4 text-white font-bold text-lg tracking-wider drop-shadow-md px-1 text-center leading-tight">
          {/* SP: 番号.姓 */}
          <span className="md:hidden">{number}.{familyName}</span>
          {/* PC: 番号.フルネーム */}
          <span className="hidden md:inline">{number}.{name}</span>
        </div>

        {/* ステータス表示（大きく見やすく） */}
        <div className={cn(
          "mt-1 px-3 py-1 rounded-full text-sm font-bold text-white shadow-sm tracking-widest transform rotate-[-2deg]",
          getLabelColor(status)
        )}>
          {getStatusLabel(status)}
        </div>
      </div>
    </div>
  );
}
