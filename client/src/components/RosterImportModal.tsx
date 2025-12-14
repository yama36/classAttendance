import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAttendance } from '@/contexts/AttendanceContext';
import { Student, ClassData } from '@/types';

interface RosterImportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RosterImportModal({ open, onOpenChange }: RosterImportModalProps) {
  const [text, setText] = useState('');
  const { setClasses, setCurrentClassId } = useAttendance();

  const handleImport = () => {
    if (!text.trim()) return;

    // TSV/CSVデータの解析
    // 想定フォーマット: 学年(またはクラス名の一部), クラス, 番号, 名前
    // 例: 
    // 1, A, 1, 田中
    // 1, A, 2, 佐藤
    // 1, B, 1, 鈴木
    
    const rows = text.trim().split('\n');
    const newClassesMap = new Map<string, ClassData>();

    rows.forEach((row) => {
      // カンマまたはタブで分割
      const cells = row.split(/[\t,]/).map(c => c.trim());
      
      // 最低限、名前があれば登録を試みるが、
      // 学年・クラス・番号・名前 の4カラム、または クラス・番号・名前 の3カラムを想定
      
      let grade = '';
      let className = '';
      let numberStr = '';
      let name = '';

      if (cells.length >= 4) {
        [grade, className, numberStr, name] = cells;
      } else if (cells.length === 3) {
        [className, numberStr, name] = cells;
      } else if (cells.length === 2) {
        [numberStr, name] = cells;
        className = 'A'; // デフォルト
      } else {
        return; // データ不足
      }

      if (!name) return;

      // クラスIDの生成 (例: class-1-A)
      const fullClassName = grade ? `${grade}年${className}組` : `${className}組`;
      const classId = `class-${grade}-${className}`;

      if (!newClassesMap.has(classId)) {
        newClassesMap.set(classId, {
          id: classId,
          name: fullClassName,
          students: []
        });
      }

      const classData = newClassesMap.get(classId)!;
      const number = parseInt(numberStr) || classData.students.length + 1;

      classData.students.push({
        id: `student-${classId}-${number}`,
        number: number,
        name: name,
        records: []
      });
    });

    // 生徒を番号順にソート
    newClassesMap.forEach(cls => {
      cls.students.sort((a, b) => a.number - b.number);
    });

    if (newClassesMap.size > 0) {
      const newClasses = Array.from(newClassesMap.values());
      setClasses(newClasses);
      
      // 最初のクラスを選択状態にする
      if (newClasses.length > 0) {
        setCurrentClassId(newClasses[0].id);
      }
      
      onOpenChange(false);
      setText('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#FFFDF0] font-['Yomogi'] border-none shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#4A4A4A]">名簿の一括登録</DialogTitle>
          <DialogDescription className="text-[#6B7F56]">
            Excelなどから「学年」「クラス」「番号」「名前」の列をコピーして貼り付けてください。<br/>
            ※座席配置は番号順に初期化されます。後で変更可能です。
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="text-xs text-slate-500 bg-white/50 p-2 rounded border border-[#C4A484] font-mono">
            例：<br/>
            1	A	1	田中 太郎<br/>
            1	A	2	佐藤 花子<br/>
            1	B	1	鈴木 一郎
          </div>
          <Textarea
            placeholder="ここに貼り付け..."
            className="min-h-[200px] font-mono text-sm bg-white border-[#C4A484] focus:border-[#6B7F56]"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-[#C4A484] text-[#4A4A4A] hover:bg-[#F0F0F0]">
            キャンセル
          </Button>
          <Button onClick={handleImport} className="bg-[#6B7F56] text-white hover:bg-[#5A6E48]">
            一括登録する
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
