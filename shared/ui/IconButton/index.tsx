import { cn } from "@/shared/utils/cn";
import React, { FC } from "react";

export const IconButton: FC<
  React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = ({ className, ...rest }) => {
  return (
    <button {...rest} className={cn("rounded-lg bg-indigo-700 px-3 py-3 text-[20px]", className)}>
      {rest.children}
    </button>
  );
};
