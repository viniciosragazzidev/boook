import { cn } from "@/app/tools/utils";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
};
const Button = ({ children, className, icon }: ButtonProps) => {
  return (
    <button
      className={cn(
        "text-cWhite bg-cRed px-4  h-10 rounded-md text-sm flex items-center gap-3 py-1 hover:bg-opacity-80 hover:scale-95 transition-all active:scale-90",
        className
      )}
      type="button"
    >
      <span className="text-xl">{icon}</span>
      <div className="w-[2px] h-full bg-cGray opacity-40"></div>
      {children}
    </button>
  );
};

export default Button;
