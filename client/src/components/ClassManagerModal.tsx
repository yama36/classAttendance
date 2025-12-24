import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useAttendance } from '@/contexts/AttendanceContext';
import { Trash2, Users, LayoutGrid, Plus } from 'lucide-react';
import { RosterImportModal } from './RosterImportModal';
import { SeatingArrangementModal } from './SeatingArrangementModal';
import { ClassData } from '@/types';

interface ClassManagerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClassManagerModal({ open, onOpenChange }: ClassManagerModalProps) {
  const { classes, deleteClass } = useAttendance();
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [seatingModalOpen, setSeatingModalOpen] = useState(false);
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);

  const handleDeleteClick = (cls: ClassData) => {
    setSelectedClass(cls);
    setDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedClass) {
      deleteClass(selectedClass.id);
      setSelectedClass(null);
    }
  };

  const handleSeatingClick = (cls: ClassData) => {
    setSelectedClass(cls);
    setSeatingModalOpen(true);
  };

  const handleImportClick = () => {
    setImportModalOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] bg-[#FFFDF0] font-['Yomogi'] border-none shadow-lg max-h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between pr-8">
              <DialogTitle className="text-2xl font-bold text-[#4A4A4A]">クラス管理</DialogTitle>
            </div>
            <DialogDescription className="text-[#6B7F56]">
              登録済みのクラス一覧です。不要なクラスを削除できます。
            </DialogDescription>
          </DialogHeader>

          {/* 新規登録エリア */}
          <div className="flex-shrink-0 py-4 border-b border-[#C4A484]/30 mb-2">
            <Button 
              onClick={handleImportClick}
              className="w-full bg-[#6B7F56] hover:bg-[#5A6E48] text-white py-6 text-lg shadow-sm"
            >
              <Plus className="w-5 h-5 mr-2" />
              名簿を一括登録する
            </Button>
            <p className="text-xs text-center mt-2 text-[#8B5E3C]">
              ※Excelなどからコピーして、新しいクラスを作成できます
            </p>
          </div>

          <ScrollArea className="flex-1 pr-4 -mr-4">
            <div className="space-y-3 pb-4">
              {classes.length === 0 ? (
                <div className="text-center text-slate-500 py-12 bg-white/50 rounded-lg border border-dashed border-[#C4A484]">
                  クラスがまだ登録されていません。<br/>
                  上のボタンから名簿を登録してください。
                </div>
              ) : (
                classes.map((cls) => (
                  <div key={cls.id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white rounded-md border border-[#C4A484] shadow-sm gap-4">
                    <div className="flex-1 w-full sm:w-auto text-left">
                      <div className="font-bold text-xl text-[#4A4A4A]">{cls.name}</div>
                      <div className="flex items-center text-sm text-[#8B5E3C] mt-1">
                        <Users className="w-4 h-4 mr-1" />
                        {cls.students.length} 名
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button 
                        variant="outline" 
                        onClick={() => handleSeatingClick(cls)}
                        className="flex-1 sm:flex-none border-[#4A4A4A] text-[#4A4A4A] hover:bg-[#F0F0F0] font-bold border-2"
                      >
                        <LayoutGrid className="w-4 h-4 mr-2" />
                        座席登録
                      </Button>
                      
                      <Button 
                        variant="destructive" 
                        onClick={() => handleDeleteClick(cls)}
                        className="flex-1 sm:flex-none bg-[#D98E8E] hover:bg-[#C07070] text-white opacity-90 hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        削除
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <DialogFooter className="flex-shrink-0 pt-4 border-t border-[#C4A484]/30 mt-2">
            <Button onClick={() => onOpenChange(false)} className="bg-[#8B5E3C] text-white hover:bg-[#7A4D2B]">
              閉じる
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 名簿登録モーダル */}
      <RosterImportModal 
        open={importModalOpen} 
        onOpenChange={setImportModalOpen} 
      />

      {/* 座席登録モーダル */}
      {selectedClass && (
        <SeatingArrangementModal
          targetClass={selectedClass}
          open={seatingModalOpen}
          onOpenChange={setSeatingModalOpen}
        />
      )}

      {/* 削除確認アラート */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent className="font-['Yomogi'] bg-[#FFFDF0]">
          <AlertDialogHeader>
            <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              クラス「{selectedClass?.name}」を削除します。<br/>
              この操作は元に戻せません。登録されている生徒データや出席記録もすべて削除されます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[#C4A484]">キャンセル</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-[#D98E8E] hover:bg-[#C07070] text-white"
            >
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
