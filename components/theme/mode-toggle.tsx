"use client";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";

import { useEffect, useState } from "react";

import { Button } from "../ui/button";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const [systemTheme, setSystemTheme] = useState<"dark" | "light">("light");

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  const switch_theme = () => {
    switch (theme) {
      case "dark":
        setTheme("light");
        break;
      case "light":
        setTheme("dark");
        break;
      case "system":
        setTheme(systemTheme === "light" ? "dark" : "light");
        break;
      default:
        return;
    }
  };
  return (
    <Button
      onClick={switch_theme}
      className="border-none bg-transparent hover:bg-transparent"
    >
      <motion.span
        key={theme === "dark" ? "sun" : "moon"}
        initial={{ rotate: 0, opacity: 0 }}
        animate={{ rotate: 180, opacity: 1 }}
        exit={{ rotate: 0, opacity: 0 }}
        whileHover={{
          scale: 1.2,
        }}
        transition={{ duration: 0.4 }}
        className="flex cursor-pointer"
      >
        <IconSun className="hidden text-white dark:flex" />
        <IconMoon className="flex text-black dark:hidden" />
      </motion.span>
    </Button>
  );
}
