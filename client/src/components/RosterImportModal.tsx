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

    const rows = text.trim().split('\n');
    console.log('Processing rows:', rows.length);
    const newClassesMap = new Map<string, ClassData>();

    rows.forEach((row, index) => {
      // 空行をスキップ
      if (!row.trim()) return;

      // セル分割の試行（タブ優先 -> カンマ -> スペース）
      let cells = row.split('\t').map(c => c.trim()).filter(Boolean);
      
      if (cells.length < 2 && row.includes(',')) {
         cells = row.split(',').map(c => c.trim()).filter(Boolean);
      }
      
      if (cells.length < 2) {
         cells = row.split(/[\s]+/).map(c => c.trim()).filter(Boolean);
      }

      console.log(`Row ${index} cells:`, cells);
      
      let grade = '';
      let className = '';
      let numberStr = '';
      // 名前情報の抽出
      let namePart1 = ''; // 姓またはフルネーム
      let namePart2 = ''; // 名（あれば）

      // カラム数に応じたマッピング
      if (cells.length >= 5) {
         // 学年, クラス, 番号, 姓, 名
         [grade, className, numberStr, namePart1, namePart2] = cells;
      } else if (cells.length === 4) {
         // 学年, クラス, 番号, 名前
         // ※ここで「クラス,番号,姓,名」の可能性もあるが、既存互換で「学年」優先
         [grade, className, numberStr, namePart1] = cells;
      } else if (cells.length === 3) {
         // クラス, 番号, 名前 (学年なし)
         [className, numberStr, namePart1] = cells;
      } else if (cells.length === 2) {
         // 番号, 名前 (クラス=A固定)
         [numberStr, namePart1] = cells;
         className = 'A'; 
      } else {
        console.log(`Row ${index} skipped: not enough columns (${cells.length})`);
        return; // データ不足
      }

      if (!namePart1) return;

      // 姓・名の決定
      let lastName = namePart1;
      let firstName = namePart2;

      // 名が空で、姓にスペースが含まれる場合は分割を試みる
      if (!firstName && lastName.includes(' ')) {
          // 全角スペースも考慮して分割
          const parts = lastName.replace('　', ' ').split(' ');
          if (parts.length >= 2) {
              lastName = parts[0];
              firstName = parts.slice(1).join(' '); // 残りを名とする
          }
      }

      // フルネーム（互換性用）
      const fullName = firstName ? `${lastName} ${firstName}` : lastName;

      // クラスIDの生成
      const fullClassName = grade ? `${grade}年${className}組` : `${className}組`;
      const classId = grade 
        ? `class-${grade}-${className}` 
        : `class-${className}`;

      if (!newClassesMap.has(classId)) {
        newClassesMap.set(classId, {
          id: classId,
          name: fullClassName,
          students: []
        });
      }

      const classData = newClassesMap.get(classId)!;
      let number = parseInt(numberStr);
      if (isNaN(number)) {
          number = classData.students.length + 1;
      }

      classData.students.push({
        id: `student-${classId}-${number}`,
        number: number,
        name: fullName,
        lastName: lastName,
        firstName: firstName,
        records: []
      });
    });

    // 生徒を番号順にソート
    newClassesMap.forEach(cls => {
      cls.students.sort((a, b) => a.number - b.number);
    });

    if (newClassesMap.size > 0) {
      const newClasses = Array.from(newClassesMap.values());
      
      setClasses(prevClasses => {
        const mergedClassesMap = new Map(prevClasses.map(c => [c.id, c]));
        newClasses.forEach(newClass => {
          mergedClassesMap.set(newClass.id, newClass);
        });
        return Array.from(mergedClassesMap.values());
      });
      
      if (newClasses.length > 0) {
        setCurrentClassId(newClasses[0].id);
      }
      
      onOpenChange(false);
      setText('');
      alert(`${newClasses.length}クラス、合計${Array.from(newClassesMap.values()).reduce((acc, cls) => acc + cls.students.length, 0)}人の生徒を登録しました。`);
    } else {
      alert('有効なデータが見つかりませんでした。区切り文字（タブやカンマ）やフォーマットを確認してください。\n例: 学年[タブ]クラス[タブ]番号[タブ]姓[タブ]名');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#FFFDF0] font-['Yomogi'] border-none shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#4A4A4A]">名簿の一括登録</DialogTitle>
          <DialogDescription className="text-[#6B7F56]">
            Excelなどからデータをコピーして貼り付けてください。<br/>
            推奨形式: 「学年」「クラス」「番号」「姓」「名」(5列)<br/>
            ※座席配置は番号順に初期化されます。後で変更可能です。
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="text-xs text-slate-500 bg-white/50 p-2 rounded border border-[#C4A484] font-mono">
            例1 (5列)：1[TAB]A[TAB]1[TAB]田中[TAB]太郎<br/>
            例2 (4列)：1[TAB]A[TAB]1[TAB]田中 太郎 (スペース区切り自動分割)<br/>
            例3 (3列)：A[TAB]1[TAB]佐藤 花子
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
