import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClassData, ViewMode, AttendanceStatus } from '@/types';
import { initialClasses } from '@/lib/mockData';
import { format } from 'date-fns';

interface AttendanceContextType {
  classes: ClassData[];
  currentClassId: string;
  setCurrentClassId: (id: string) => void;
  currentDate: string;
  setCurrentDate: (date: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  updateAttendance: (studentId: string, status: AttendanceStatus, date?: string) => void;
  importRoster: (classId: string, file: File) => Promise<void>;
  getCurrentClass: () => ClassData | undefined;
  setClasses: React.Dispatch<React.SetStateAction<ClassData[]>>;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function AttendanceProvider({ children }: { children: React.ReactNode }) {
  const [classes, setClasses] = useState<ClassData[]>(initialClasses);
  const [currentClassId, setCurrentClassId] = useState<string>(initialClasses[0].id);
  const [currentDate, setCurrentDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [viewMode, setViewMode] = useState<ViewMode>('teacher');

  const getCurrentClass = () => classes.find(c => c.id === currentClassId);

  const updateAttendance = (studentId: string, status: AttendanceStatus, date: string = currentDate) => {
    setClasses(prevClasses => prevClasses.map(cls => {
      if (cls.id !== currentClassId) return cls;
      
      return {
        ...cls,
        students: cls.students.map(student => {
          if (student.id !== studentId) return student;
          
          const existingRecordIndex = student.records.findIndex(r => r.date === date);
          let newRecords = [...student.records];
          
          if (existingRecordIndex >= 0) {
            newRecords[existingRecordIndex] = { ...newRecords[existingRecordIndex], status };
          } else {
            newRecords.push({ date, status });
          }
          
          return { ...student, records: newRecords };
        })
      };
    }));
  };

  const importRoster = async (classId: string, file: File) => {
    // Implementation for file import would go here
    // For now, we'll just log it
    console.log('Importing roster for class', classId, file);
  };

  return (
    <AttendanceContext.Provider value={{
      classes,
      currentClassId,
      setCurrentClassId,
      currentDate,
      setCurrentDate,
      viewMode,
      setViewMode,
      updateAttendance,
      importRoster,
      getCurrentClass,
      setClasses
    }}>
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (context === undefined) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}
