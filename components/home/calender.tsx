"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  IconChevronLeft,
  IconChevronRight,
  IconPlus,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

import { useEffect, useState } from "react";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { DroppableDay } from "./calender-components/droppable-day";
import { SortableTask } from "./calender-components/task-item";
import { Task, toYYYYMMDD } from "./calender-components/types";

export default function Calender() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState(0);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const [newTaskPriority, setNewTaskPriority] =
    useState<Task["priority"]>("medium");
  const [newTaskStatus, setNewTaskStatus] = useState<Task["status"]>("todo");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    const savedTasks = localStorage.getItem("valorant-calendar-tasks");
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (_e) {
        console.error("Failed to parse tasks");
      }
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("valorant-calendar-tasks", JSON.stringify(tasks));
    }
  }, [tasks, isMounted]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor),
  );

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  ).getDay();

  const prevMonth = () => {
    setDirection(-1);
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const nextMonth = () => {
    setDirection(1);
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthImages = [
    "/assets/one.jpg", // January
    "/assets/two.png", // February
    "/assets/three.jpg", // March
    "/assets/four.jpg", // April
    "/assets/five.jpg", // May
    "/assets/six.jpg", // June
    "/assets/seven.jpg", // July
    "/assets/eight.jpg", // August
    "/assets/nine.jpg", // September
    "/assets/ten.jpg", // October
    "/assets/eleven.jpg", // November
    "/assets/twelve.jpg", // December
  ];

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );

    if (!startDate) {
      setStartDate(selectedDate);
      setEndDate(null);
    } else if (startDate && !endDate) {
      if (selectedDate.getTime() === startDate.getTime()) {
        setStartDate(null);
      } else if (selectedDate < startDate) {
        setStartDate(selectedDate);
      } else {
        setEndDate(selectedDate);
      }
    } else {
      setStartDate(selectedDate);
      setEndDate(null);
    }
  };

  const isSelected = (day: number) => {
    if (!startDate) return false;
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );

    if (endDate) {
      return dateToCheck >= startDate && dateToCheck <= endDate;
    }

    return dateToCheck.getTime() === startDate.getTime();
  };

  const isRangeStart = (day: number) => {
    if (!startDate) return false;
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    return dateToCheck.getTime() === startDate.getTime();
  };

  const isRangeEnd = (day: number) => {
    if (!endDate) return false;
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    return dateToCheck.getTime() === endDate.getTime();
  };

  const hasTask = (day: number) => {
    const dateStr = toYYYYMMDD(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
    );
    return tasks.some((task) => {
      if (!task.date) return false;
      if (task.endDate) {
        return dateStr >= task.date && dateStr <= task.endDate;
      }
      return task.date === dateStr;
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over) return;

    if (over.id.toString().startsWith("day-")) {
      const dayStr = over.id.toString().replace("day-", "");
      const day = parseInt(dayStr, 10);

      const dropDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
      );
      const dropDateStr = toYYYYMMDD(dropDate);

      let newStartDate = dropDateStr;
      let newEndDate = null;

      if (startDate && endDate) {
        const startStr = toYYYYMMDD(startDate);
        const endStr = toYYYYMMDD(endDate);
        if (dropDateStr >= startStr && dropDateStr <= endStr) {
          newStartDate = startStr;
          newEndDate = endStr;
        }
      }

      setTasks((items) =>
        items.map((item) => {
          if (item.id === active.id) {
            return { ...item, date: newStartDate, endDate: newEndDate };
          }
          return item;
        }),
      );
    } else if (active.id !== over.id) {
      setTasks((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);

        const newItems = [...items];
        const [moved] = newItems.splice(oldIndex, 1);
        newItems.splice(newIndex, 0, moved);

        return newItems;
      });
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const addTask = () => {
    if (!newTaskContent.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      content: newTaskContent,
      priority: newTaskPriority,
      status: newTaskStatus,
      date: startDate ? toYYYYMMDD(startDate) : null,
      endDate: startDate && endDate ? toYYYYMMDD(endDate) : null,
    };

    setTasks([newTask, ...tasks]);
    setNewTaskContent("");
    setIsDialogOpen(false);
  };

  const filteredTasks = tasks.filter((task) => {
    if (!startDate) return !task.date;
    if (!task.date) return true;

    const filterStart = toYYYYMMDD(startDate);
    const filterEnd = endDate ? toYYYYMMDD(endDate) : filterStart;

    const taskStart = task.date;
    const taskEnd = task.endDate || task.date;

    return taskStart <= filterEnd && taskEnd >= filterStart;
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="font-grotesk flex w-full flex-col gap-8 px-4 uppercase lg:flex-row lg:px-0"
      >
        <div className="w-full flex-1 shrink-0 lg:w-1/2">
          <div className="relative aspect-video w-full overflow-hidden border-2 border-zinc-300 shadow-[8px_8px_0px_0px_var(--accent)] dark:border-zinc-700 dark:shadow-[8px_8px_0px_0px_var(--accent)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentDate.getMonth()}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 h-full w-full"
              >
                <Image
                  src={monthImages[currentDate.getMonth()]}
                  alt={`${monthNames[currentDate.getMonth()]} Hero`}
                  fill
                  className="object-cover"
                  loading="eager"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="bg-background/50 mt-8 hidden min-h-75 flex-col border-2 border-zinc-300 p-4 lg:flex dark:border-zinc-700">
            <div className="mb-4 flex w-full flex-col gap-1">
              <div className="flex items-center justify-between border-b-2 border-zinc-300 pb-2 dark:border-zinc-700">
                <h3 className="font-bold tracking-widest text-[#ff4655] uppercase">
                  Notes & Tasks
                </h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer text-[#ff4655] hover:bg-[#ff4655]/10 hover:text-[#ff4655]"
                    >
                      <IconPlus size={20} />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-background font-grotesk rounded-none border-2 border-zinc-300 uppercase shadow-[8px_8px_0px_0px_#ff4655] sm:max-w-106.25 dark:border-zinc-700">
                    <DialogHeader>
                      <DialogTitle className="text-xl font-bold tracking-widest text-[#ff4655]">
                        Add Protocol
                      </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="flex flex-col gap-2">
                        <Label className="font-bold text-[#ff4655]">
                          Details
                        </Label>
                        <Textarea
                          placeholder="ENTER DIRECTIVES..."
                          className="min-h-24 resize-none rounded-none border-2 border-zinc-300 focus-visible:border-[#ff4655] focus-visible:ring-0 dark:border-zinc-700"
                          value={newTaskContent}
                          onChange={(e) => setNewTaskContent(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex flex-1 flex-col gap-2">
                          <Label className="font-bold text-[#ff4655]">
                            Priority
                          </Label>
                          <div className="flex flex-col gap-2">
                            {(["low", "medium", "high"] as const).map((p) => (
                              <Button
                                key={p}
                                variant={
                                  newTaskPriority === p ? "default" : "outline"
                                }
                                onClick={() => setNewTaskPriority(p)}
                                className={`h-8 rounded-none border-2 ${newTaskPriority === p ? "border-[#ff4655] bg-[#ff4655] text-white hover:bg-[#ff4655]/90" : "border-zinc-300 dark:border-zinc-700"}`}
                              >
                                {p}
                              </Button>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-1 flex-col gap-2">
                          <Label className="font-bold text-[#ff4655]">
                            Status
                          </Label>
                          <div className="flex flex-col gap-2">
                            {(["todo", "ongoing", "done"] as const).map((s) => (
                              <Button
                                key={s}
                                variant={
                                  newTaskStatus === s ? "default" : "outline"
                                }
                                onClick={() => setNewTaskStatus(s)}
                                className={`h-8 cursor-pointer rounded-none border-2 ${newTaskStatus === s ? "border-zinc-800 bg-zinc-800 text-white hover:bg-zinc-700 dark:border-zinc-200 dark:bg-zinc-200 dark:text-black" : "border-zinc-300 dark:border-zinc-700"}`}
                              >
                                {s}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={addTask}
                        className="bg-background mt-4 w-full rounded-none border-2 border-[#ff4655] font-bold tracking-widest text-[#ff4655] shadow-[4px_4px_0px_0px_#ff4655] transition-all hover:-translate-y-1 hover:bg-[#ff4655] hover:text-white"
                      >
                        INITIALIZE
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              {startDate && (
                <div className="mt-1 flex items-center justify-between pr-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                  <span>
                    FILTERS: {toYYYYMMDD(startDate)}{" "}
                    {endDate ? `TO ${toYYYYMMDD(endDate)}` : ""}
                  </span>
                  <button
                    onClick={() => {
                      setStartDate(null);
                      setEndDate(null);
                    }}
                    className="cursor-pointer underline hover:text-[#ff4655]"
                  >
                    CLEAR SELECTION
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
              {filteredTasks.length === 0 ? (
                <div className="flex h-full items-center justify-center border-2 border-dashed border-zinc-300 p-8 text-center text-sm font-bold tracking-widest text-zinc-500 dark:border-zinc-700">
                  NO NOTES OR TASKS FOUND.
                  <br />
                  CLICK + TO ADD SOMETHING.
                </div>
              ) : (
                <SortableContext
                  items={filteredTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {filteredTasks.map((task) => (
                    <SortableTask
                      key={task.id}
                      task={task}
                      onClick={() => {}}
                    />
                  ))}
                </SortableContext>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-1 flex-col gap-4 lg:w-1/2">
          <div className="flex items-center justify-between border-b-2 border-zinc-300 pb-4 dark:border-zinc-700">
            <h2 className="text-2xl font-bold tracking-widest text-zinc-800 dark:text-zinc-200">
              <span className="text-accent mr-2">
                [{currentDate.getFullYear()}]
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentDate.getMonth()}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block"
                >
                  {monthNames[currentDate.getMonth()]}
                </motion.span>
              </AnimatePresence>
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevMonth}
                className="hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-none border-2 border-zinc-300 dark:border-zinc-700"
              >
                <IconChevronLeft size={20} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextMonth}
                className="hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-none border-2 border-zinc-300 dark:border-zinc-700"
              >
                <IconChevronRight size={20} />
              </Button>
            </div>
          </div>

          <div className="w-full overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentDate.toISOString()}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction > 0 ? -20 : 20 }}
                transition={{ duration: 0.2 }}
                className="grid w-full grid-cols-7 gap-2 sm:gap-3"
              >
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="flex items-center justify-center pb-2 font-bold tracking-widest text-[#ff4655]"
                  >
                    {day}
                  </div>
                ))}

                {emptyDays.map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="aspect-square w-full border-2 border-transparent bg-zinc-200/50 dark:bg-zinc-800/50"
                  />
                ))}

                {days.map((day) => {
                  const selected = isSelected(day);
                  const rangeStart = isRangeStart(day);
                  const rangeEnd = isRangeEnd(day);
                  const today = isToday(day);
                  const taskPresent = hasTask(day);

                  return (
                    <DroppableDay
                      key={day}
                      day={day}
                      isSelected={selected}
                      isRangeStart={rangeStart}
                      isRangeEnd={rangeEnd}
                      isToday={today}
                      taskPresent={taskPresent}
                      onClick={() => handleDateClick(day)}
                    />
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="bg-background/50 mt-4 flex min-h-75 flex-col border-2 border-zinc-300 p-4 lg:hidden dark:border-zinc-700">
            <div className="mb-4 flex w-full flex-col gap-1">
              <div className="flex items-center justify-between border-b-2 border-zinc-300 pb-2 dark:border-zinc-700">
                <h3 className="font-bold tracking-widest text-[#ff4655] uppercase">
                  Notes & Tasks
                </h3>
              </div>
              {startDate && (
                <div className="mt-1 flex items-center justify-between pr-2 text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                  <span>
                    FILTERS: {toYYYYMMDD(startDate)}{" "}
                    {endDate ? `TO ${toYYYYMMDD(endDate)}` : ""}
                  </span>
                  <button
                    onClick={() => {
                      setStartDate(null);
                      setEndDate(null);
                    }}
                    className="cursor-pointer underline hover:text-[#ff4655]"
                  >
                    CLEAR SELECTION
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`bg-background/80 mb-2 flex items-center justify-between border-2 border-zinc-300 p-3 dark:border-zinc-700`}
                >
                  <div className="flex flex-col">
                    <div className="mb-1 flex items-center gap-2">
                      <span
                        className={`px-1 text-[10px] font-bold uppercase ${task.priority === "high" ? "text-[#ff4655]" : "text-zinc-500"}`}
                      >
                        {task.priority}
                      </span>
                      <span className="border border-zinc-500 px-1 text-[10px] text-zinc-500">
                        {task.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{task.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      <DragOverlay>
        {activeId ? (
          <div className="bg-background/90 z-999 flex h-24 w-24 rotate-3 cursor-grabbing flex-col items-center justify-center border-2 border-[#ff4655] p-2 text-center shadow-[4px_4px_0px_0px_#ff4655] backdrop-blur-sm">
            <span className="mb-1 text-xs font-bold tracking-wider text-[#ff4655] uppercase">
              {tasks.find((t) => t.id === activeId)?.priority}
            </span>
            <span className="line-clamp-3 w-full text-[10px] font-medium sm:text-xs">
              {tasks.find((t) => t.id === activeId)?.content}
            </span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
