import { motion } from "motion/react";

import React, { ComponentProps } from "react";

type AnimatedTextProps = ComponentProps<"h1"> & {
  as?: keyof React.JSX.IntrinsicElements;
  children: React.ReactNode;
};

export default function AnimatedText({
  as: Tag = "h1",
  children,
  className = "",
  ...props
}: AnimatedTextProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const MotionTag = (motion as any)[Tag] || (motion as any).div;

  return (
    <MotionTag
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  );
}
