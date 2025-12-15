import { cn } from '@/lib/utils';
import { AttendanceStatus } from '@/types';

interface DropZoneProps {
  id: AttendanceStatus;
  label: string;
  colorClass: string;
  icon?: React.ReactNode;
  count: number;
}

export function DropZone({ id, label, colorClass, icon, count }: DropZoneProps) {

  // Map status to the specific pastel colors from the image
  const getBgColor = (id: string) => {
    switch (id) {
      case 'present': return 'bg-[#94C9C3]';
      case 'absent': return 'bg-[#F4B4B4]';
      case 'late': return 'bg-[#F9E0B0]';
      case 'leaveEarly': return 'bg-[#9FB1C9]';
      default: return 'bg-white';
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-sm transition-all duration-200 h-24 w-full shadow-sm relative overflow-hidden",
        getBgColor(id),
        "text-white",
        "opacity-90 hover:opacity-100"
      )}
    >
      {/* Hand-drawn border effect using box-shadow or border-image could be cool, but simple rounded-sm works for now */}
      
      <div className="text-3xl font-bold mb-1 z-10">{count}</div>
      <div className="text-sm font-bold flex items-center gap-2 z-10 tracking-widest">
        {icon}
        {label}
      </div>
      
      {/* Decorative white squiggle/line */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/50 rounded-full"></div>
    </div>
  );
}
