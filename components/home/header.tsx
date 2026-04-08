"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconEdit } from "@tabler/icons-react";
import { z } from "zod";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { homepageConfig } from "@/config/home";

import AnimatedText from "../global/animated-text";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Field, FieldGroup } from "../ui/field";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const motivationSchema = z.object({
  motivationLine: z
    .string()
    .min(1, "Quate is required")
    .max(200, "Max length is 200"),
});

type Inputs = {
  motivationLine: string;
};

export default function Header() {
  const date = new Date();
  const todayParts = date
    .toLocaleDateString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
    .split(", ");
  const weekday = todayParts[0];
  const rest = todayParts.slice(1).join(", ");

  const [motivationLine, setMotivationLine] = useState(
    homepageConfig.motivationLine,
  );

  useEffect(() => {
    const stored = localStorage.getItem("motivationLine");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setMotivationLine(stored);
  }, []);

  return (
    <div className="flex flex-col gap-3 px-4 lg:px-0">
      <Badge className="bg-accent/10 text-accent relative rounded-xs border border-zinc-200 after:w-full dark:border-zinc-800">
        <AnimatedText>{homepageConfig.tagLine}</AnimatedText>
        <div className="via-accent absolute bottom-0 h-px w-full bg-linear-to-r from-transparent to-transparent"></div>
      </Badge>

      <AnimatedText className="font-grotesk text-4xl font-bold">
        <span className="text-accent">{weekday}</span>
        {`, ${rest}`}
      </AnimatedText>
      <div className="relative inline-block max-w-xl align-bottom">
        <AnimatedText className="text-muted-foreground font-grotesk">
          {motivationLine}
        </AnimatedText>

        <div className="absolute right-0 bottom-0 cursor-pointer">
          <MotivationLineDialog
            motivationLine={motivationLine}
            setMotivationLine={setMotivationLine}
          />
        </div>
      </div>
    </div>
  );
}

const MotivationLineDialog = ({
  motivationLine,
  setMotivationLine,
}: {
  motivationLine: string;
  setMotivationLine: (line: string) => void;
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: { motivationLine },
    resolver: zodResolver(motivationSchema),
  });

  useEffect(() => {
    reset({ motivationLine });
  }, [motivationLine, reset]);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setMotivationLine(data.motivationLine);
    localStorage.setItem("motivationLine", data.motivationLine);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <IconEdit size={15} className="text-muted-foreground" />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Edit Your Motivation Line</DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="motivationline">Motivation Line</Label>
              <Textarea
                id="motivationline"
                {...register("motivationLine", { required: true })}
              />
              {errors.motivationLine && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.motivationLine.message}
                </p>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
