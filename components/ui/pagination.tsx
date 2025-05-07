import React from "react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  className?: string;
  children: React.ReactNode;
}

export function Pagination({ className, children }: PaginationProps) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <ul className="flex flex-row items-center gap-1">
        {React.Children.map(children, (child) => {
          return <li>{child}</li>;
        })}
      </ul>
    </nav>
  );
}