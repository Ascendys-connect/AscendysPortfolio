import { cn } from "@/utils";
import type { FC, ReactNode } from "react";

interface LabelProps {
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  required?: boolean;
}

const Label: FC<LabelProps> = ({ htmlFor, children, className, required }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400",
        className,
      )}
    >
      {children}
      {required && <span className="ms-1 text-error-600 dark:text-error-400">*</span>}
    </label>
  );
};

export default Label;
