"use client";

import { IconMoon, IconSettings, IconSun } from "@tabler/icons-react";
import { useTheme } from "next-themes";

import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";

export default function SettingDialog() {
  const { theme, setTheme } = useTheme();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-background fixed right-4 bottom-4 h-12 w-12 rounded-full border-2 border-[#ff4655] shadow-[4px_4px_0px_0px_#ff4655] transition-transform hover:-translate-y-1 dark:shadow-[4px_4px_0px_0px_#ff4655]"
        >
          <IconSettings className="h-6 w-6 text-[#ff4655]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background rounded-none border-2 border-zinc-300 shadow-[8px_8px_0px_0px_#ff4655] sm:max-w-106.25 dark:border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-widest text-[#ff4655] uppercase">
            Settings
          </DialogTitle>
          <DialogDescription className="text-xs tracking-wider uppercase">
            Configure your calendar experience.
          </DialogDescription>
        </DialogHeader>
        <div className="font-grotesk grid gap-6 py-4 tracking-widest uppercase">
          <div className="flex flex-col gap-3">
            <Label className="font-bold text-[#ff4655]">Theme</Label>
            <div className="flex flex-wrap gap-4">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className={`gap-2 rounded-none border-2 font-bold ${theme === "light" ? "border-[#ff4655] bg-[#ff4655] text-white hover:bg-[#ff4655]/90" : "text-foreground border-zinc-300 dark:border-zinc-700"}`}
                onClick={() => setTheme("light")}
              >
                <IconSun size={18} /> Light
              </Button>
              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className={`gap-2 rounded-none border-2 font-bold ${theme === "dark" ? "border-[#ff4655] bg-[#ff4655] text-white hover:bg-[#ff4655]/90" : "text-foreground border-zinc-300 dark:border-zinc-700"}`}
                onClick={() => setTheme("dark")}
              >
                <IconMoon size={18} /> Dark
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label className="font-bold text-[#ff4655]">
              First Day of Week
            </Label>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="bg-background text-foreground/50 flex-1 cursor-not-allowed rounded-none border-2 border-zinc-300 font-bold dark:border-zinc-700"
              >
                Sunday
              </Button>
              <Button
                variant="outline"
                className="bg-background text-foreground/50 flex-1 cursor-not-allowed rounded-none border-2 border-zinc-300 font-bold dark:border-zinc-700"
              >
                Monday
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
