import { ClassData } from "@/types";
import { format } from "date-fns";

const today = format(new Date(), 'yyyy-MM-dd');

export const initialClasses: ClassData[] = [
  {
    id: 'class-a',
    name: '3年A組',
    students: Array.from({ length: 30 }, (_, i) => ({
      id: `student-a-${i + 1}`,
      number: i + 1,
      name: `生徒 ${i + 1}`,
      records: [
        { date: today, status: 'present' }
      ]
    }))
  },
  {
    id: 'class-b',
    name: '3年B組',
    students: Array.from({ length: 30 }, (_, i) => ({
      id: `student-b-${i + 1}`,
      number: i + 1,
      name: `生徒 ${i + 1}`,
      records: [
        { date: today, status: 'present' }
      ]
    }))
  }
];
