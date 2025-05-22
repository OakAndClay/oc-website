import React from "react";

type PaperProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Paper({ children, className = "" }: PaperProps) {
  return (
    <div
      className={`bg-white/60 
                  rounded 
                  shadow-gray-700 
                  shadow-2xl 
                  p-10 
                  w-full 
                  max-w-2xl 
                  mb-50 
                  border-2 
                  border-gray-900 
                  transition-transform 
                  duration-700 
                  hover:scale-105
                  hover:bg-white/70
                  hover:shadow-gray-600 
                  ${className}`}
    >
      {children}
    </div>
  );
}