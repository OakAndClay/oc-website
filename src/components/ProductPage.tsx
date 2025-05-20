import React from "react";

type PaperProps = {
  children: React.ReactNode;
  className?: string;
};

export default function ProductPage({ children, className = "" }: PaperProps) {
  return (
    <div
      className={`bg-white/70 
                  rounded 
                  shadow-gray-700 
                  shadow-2xl 
                  p-10 
                  w-full 
                  max-w-3xl 
                  mb-50 
                  border-2 
                  border-gray-900
                  ${className}`}
    >
      {children}
    </div>
  );
}