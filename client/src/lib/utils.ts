import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStatusColor = (status: string) => {
  switch (status) {
    case "present":
      return "bg-[#94C9C3] text-white"; // Teal/Blue
    case "absent":
      return "bg-[#F4B4B4] text-white"; // Pink
    case "late":
      return "bg-[#F9E0B0] text-white"; // Yellow/Orange
    case "leaveEarly":
      return "bg-[#9FB1C9] text-white"; // Blue/Grey
    default:
      return "bg-[#C4A484] text-white"; // Default Brown (Desk color)
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "present":
      return "出席";
    case "absent":
      return "欠席";
    case "late":
      return "遅刻";
    case "leaveEarly":
      return "早退";
    default:
      return status;
  }
};

export const getShortStatusLabel = (status: string) => {
  switch (status) {
    case "present":
      return ""; // 出席は表示なし（または〇など）
    case "absent":
      return "欠";
    case "late":
      return "遅";
    case "leaveEarly":
      return "早";
    default:
      return "";
  }
};
