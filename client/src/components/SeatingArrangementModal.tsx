import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAttendance } from '@/contexts/AttendanceContext';
import { ClassData } from '@/types';

interface SeatingArrangementModalProps {
  targetClass: ClassData;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SeatingArrangementModal({ targetClass, trigger, open, onOpenChange }: SeatingArrangementModalProps) {
  const { updateClassStudentsOrder } = useAttendance();
  const [inputText, setInputText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // 内部状態とpropsの制御を同期させるためのラッパー
  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
    if (newOpen) {
        // モーダルが開いたときに、現在の並び順で初期値をセットすることも可能だが、
        // ユーザーはコピペで上書きしたいだろうから空にするか、あるいは現在の番号を表示するか。
        // とりあえず空にしておく、またはプレースホルダーを表示。
    }
  };

  // 実際の表示制御
  const isModalOpen = open !== undefined ? open : isOpen;

  const handleSave = () => {
    // テキストを行ごとに分割し、さらに空白やタブで分割して番号を抽出
    const rows = inputText.trim().split(/\n/);
    const orderedNumbers: number[] = [];

    rows.forEach(row => {
      // 全角数字を半角に変換し、区切り文字で分割
      const numbers = row
        .replace(/[０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
        .split(/[\t\s,]+/)
        .map(s => parseInt(s.trim(), 10))
        .filter(n => !isNaN(n));
      
      orderedNumbers.push(...numbers);
    });

    if (orderedNumbers.length === 0) {
      alert('有効な座席番号が見つかりませんでした。');
      return;
    }

    // 番号に対応する生徒IDを検索
    // 見つかった順序（入力順）に並べる
    const orderedStudentIds: string[] = [];
    const usedStudentIds = new Set<string>();

    orderedNumbers.forEach(num => {
      // 同じ番号の生徒が複数いる場合（あまりないはずだが）も考慮しfindを使用
      // ただし、同じ生徒を重複して追加しないようにチェック
      const student = targetClass.students.find(s => s.number === num && !usedStudentIds.has(s.id));
      if (student) {
        orderedStudentIds.push(student.id);
        usedStudentIds.add(student.id);
      }
    });

    // 入力に含まれていない生徒は、updateClassStudentsOrder側で末尾に追加される仕様だが、
    // ここで明示的に警告を出したりすることも可能。とりあえずそのまま保存。

    updateClassStudentsOrder(targetClass.id, orderedStudentIds);
    handleOpenChange(false);
    setInputText('');
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[500px] font-['Yomogi']">
        <DialogHeader>
          <DialogTitle>座席配置の登録</DialogTitle>
          <DialogDescription>
            座席の配置（出席番号）を入力してください。<br/>
            Excelなどからコピー＆ペーストできます。<br/>
            左上から入力された順に、教室の右下から座席が配置されます。
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder={`1	2	3\n4	5	6`}
            className="h-[300px] font-mono"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <div className="text-sm text-gray-500">
            ※ タブ、カンマ、スペース、改行区切りに対応しています。<br/>
            ※ 入力されなかった生徒は、配置の最後に自動的に追加されます。
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>キャンセル</Button>
          <Button onClick={handleSave}>保存</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
