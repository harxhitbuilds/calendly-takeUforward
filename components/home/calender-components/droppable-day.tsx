"use client";

import { useDroppable } from "@dnd-kit/core";
import { motion } from "motion/react";

export function DroppableDay({
  day,
  isSelected,
  isRangeStart,
  isRangeEnd,
  isToday,
  taskPresent,
  onClick,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}: any) {
  const { isOver, setNodeRef } = useDroppable({
    id: `day-${day}`,
  });

  let dayClasses =
    "flex aspect-square w-full cursor-pointer items-center justify-center border-2 text-base sm:text-xl font-bold transition-all duration-200 relative ";

  if (isOver) {
    dayClasses +=
      "border-[#ff4655] scale-110 bg-[#ff4655]/20 z-10 text-[#ff4655] shadow-[0px_0px_10px_0px_#ff4655] ";
  } else if (isRangeStart || isRangeEnd) {
    dayClasses +=
      "border-[#ff4655] bg-[#ff4655] text-[#ece8e1] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] dark:shadow-[4px_4px_0px_0px_#ece8e1] hover:-translate-y-1 ";
  } else if (isSelected) {
    dayClasses += "border-[#ff4655]/40 bg-[#ff4655]/20 text-[#ff4655] ";
  } else if (isToday) {
    dayClasses +=
      "border-zinc-500 bg-background text-foreground ring-2 ring-zinc-500/20 ring-offset-2 ring-offset-background";
  } else {
    dayClasses +=
      "border-zinc-300 bg-background text-foreground hover:border-[#ff4655] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#ff4655] dark:border-zinc-700";
  }

  if (taskPresent && !isRangeStart && !isRangeEnd && !isOver) {
    dayClasses += " shadow-[inset_0px_-4px_0px_0px_#ff4655]";
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      ref={setNodeRef}
      onClick={onClick}
      className={dayClasses}
    >
      {day}
      {taskPresent && (isRangeStart || isRangeEnd) && (
        <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-white dark:bg-black" />
      )}
    </motion.div>
  );
}
