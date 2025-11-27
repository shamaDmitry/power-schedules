import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const headingVariants = cva("", {
  variants: {
    level: {
      h1: "scroll-m-20 text-5xl font-extrabold tracking-tight text-balance",
      h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
    },
  },
  defaultVariants: {
    level: "h1",
  },
});

function Heading({
  className,
  level = "h1",
  asChild,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof headingVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : `${level}`;

  return (
    <Comp className={cn(headingVariants({ level, className }))} {...props} />
  );
}

export { Heading, headingVariants };
