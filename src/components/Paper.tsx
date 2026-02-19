import React from "react";

type PaperProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Paper({ children, className = "" }: PaperProps) {
  return (
    <div
      className={`bg-white/80
                  backdrop-blur-sm
                  rounded-xl
                  shadow-stone-700/30
                  shadow-lg
                  p-8
                  sm:p-10
                  w-full
                  max-w-2xl
                  mb-12
                  border
                  border-stone-200/50
                  transition-all
                  duration-500
                  hover:shadow-2xl
                  hover:bg-white/90
                  hover:border-stone-300/50
                  hover:-translate-y-2
                  ${className}`}
    >
      {children}
    </div>
  );
}
