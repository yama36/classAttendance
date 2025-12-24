import { ClassData } from "@/types";
import { format } from "date-fns";

const today = format(new Date(), 'yyyy-MM-dd');

const createStudents = (count: number, classId: string) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `student-${classId}-${i + 1}`,
      number: i + 1,
      name: `生徒 ${i + 1}`,
    lastName: `生徒${i + 1}`, // SP表示用（番号付きで表示させるため）
      records: [
        { date: today, status: 'present' }
      ]
  }));
};

export const initialClasses: ClassData[] = [
  {
    id: 'class-1-1',
    name: '1年1組',
    students: createStudents(30, '1-1')
  },
  {
    id: 'class-1-2',
    name: '1年2組',
    students: createStudents(36, '1-2')
  },
  {
    id: 'class-1-3',
    name: '1年3組',
    students: createStudents(40, '1-3')
  }
];
