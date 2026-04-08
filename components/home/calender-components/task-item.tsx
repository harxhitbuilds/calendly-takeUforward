"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconGripVertical } from "@tabler/icons-react";

import { Task } from "./types";

interface TaskItemProps {
  task: Task;
  isDragging?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listeners?: any;
  onClick?: () => void;
}

export function TaskItemUI({
  task,
  isDragging,
  attributes,
  listeners,
  onClick,
}: TaskItemProps) {
  const priorityColors = {
    low: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    medium: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    high: "bg-[#ff4655]/20 text-[#ff4655] border-[#ff4655]/30",
  };

  const statusColors = {
    todo: "bg-zinc-500",
    ongoing: "bg-yellow-500",
    done: "bg-green-500",
  };

  let displayDate = "";
  if (task.date) {
    const formatDateStr = (dateStr: string) => {
      const [y, m, d] = dateStr.split("-");
      return new Date(
        parseInt(y, 10),
        parseInt(m, 10) - 1,
        parseInt(d, 10),
      ).toLocaleDateString(undefined, { month: "short", day: "numeric" });
    };
    displayDate = formatDateStr(task.date);
    if (task.endDate && task.endDate !== task.date) {
      displayDate += ` - ${formatDateStr(task.endDate)}`;
    }
  }

  return (
    <div
      className={`mb-2 flex items-center gap-2 border-2 p-3 ${isDragging ? "border-[#ff4655] opacity-80 shadow-[4px_4px_0px_0px_#ff4655]" : "bg-background/80 border-zinc-300 dark:border-zinc-700"}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab transition-colors hover:text-[#ff4655]"
      >
        <IconGripVertical size={20} />
      </div>
      <div
        className="flex flex-1 cursor-pointer flex-col gap-1"
        onClick={onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={`h-2 w-2 rounded-full ${statusColors[task.status]}`}
            />
            <span
              className={`rounded-none border-2 px-2 py-0.5 text-xs font-bold tracking-wider uppercase ${priorityColors[task.priority]}`}
            >
              {task.priority}
            </span>
          </div>
          {task.date && (
            <span className="text-xs font-bold text-zinc-500">
              {displayDate}
            </span>
          )}
        </div>
        <p className="text-sm font-medium">{task.content}</p>
      </div>
    </div>
  );
}

export function SortableTask({
  task,
  onClick,
}: {
  task: Task;
  onClick: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskItemUI
        task={task}
        isDragging={isDragging}
        attributes={attributes}
        listeners={listeners}
        onClick={onClick}
      />
    </div>
  );
}
