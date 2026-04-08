export type Task = {
  id: string;
  content: string;
  status: "todo" | "ongoing" | "done";
  priority: "low" | "medium" | "high";
  date: string | null;
  endDate?: string | null;
};

export const toYYYYMMDD = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
