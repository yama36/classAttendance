import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAttendance } from '@/contexts/AttendanceContext';
import { Trash2 } from 'lucide-react';

interface ClassManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClassManagerModal({ open, onOpenChange }: ClassManagerModalProps) {
  const { classes, deleteClass } = useAttendance();

  const handleDelete = (id: string, name: string) => {
    if (confirm(`クラス「${name}」を削除してもよろしいですか？\nこの操作は取り消せません。`)) {
      deleteClass(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-[#FFFDF0] font-['Yomogi'] border-none shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#4A4A4A]">クラス管理</DialogTitle>
           <DialogDescription className="text-[#6B7F56]">
            登録済みのクラス一覧です。不要なクラスを削除できます。
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {classes.length === 0 ? (
            <div className="text-center text-slate-500 py-8">クラスが登録されていません</div>
          ) : (
            classes.map((cls) => (
              <div key={cls.id} className="flex items-center justify-between p-3 bg-white rounded-sm border border-[#C4A484] shadow-sm">
                <div>
                  <div className="font-bold text-lg">{cls.name}</div>
                  <div className="text-xs text-slate-500">{cls.students.length} 名</div>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDelete(cls.id, cls.name)}
                  className="bg-[#D98E8E] hover:bg-[#C07070] text-white"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  削除
                </Button>
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="bg-[#6B7F56] text-white hover:bg-[#5A6E48]">
            閉じる
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
