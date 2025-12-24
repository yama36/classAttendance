import { cn } from '@/lib/utils';
import { AttendanceStatus } from '@/types';

interface DropZoneProps {
  id: AttendanceStatus;
  label: string;
  colorClass: string;
  icon?: React.ReactNode;
  count: number;
  className?: string;
  compact?: boolean;
}

export function DropZone({ id, label, colorClass, icon, count, className, compact }: DropZoneProps) {

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
        "flex flex-col items-center justify-center p-2 md:p-4 rounded-sm transition-all duration-200 w-full shadow-sm relative overflow-hidden",
        compact ? "h-14 p-1" : "h-16 md:h-24",
        getBgColor(id),
        "text-white",
        "opacity-90 hover:opacity-100",
        className
      )}
    >
      {/* Hand-drawn border effect using box-shadow or border-image could be cool, but simple rounded-sm works for now */}
      
      <div className={cn(
        "font-bold z-10",
        compact ? "text-lg mb-0" : "text-xl md:text-3xl mb-0 md:mb-1"
      )}>{count}</div>
      
      <div className={cn(
        "font-bold flex items-center gap-2 z-10 tracking-widest",
        compact ? "text-[10px]" : "text-xs md:text-sm"
      )}>
        {icon}
        {label}
      </div>
      
      {/* Decorative white squiggle/line */}
      {!compact && (
        <div className="hidden md:block absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/50 rounded-full"></div>
      )}
    </div>
  );
}
