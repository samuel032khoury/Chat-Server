import { ButtonHTMLAttributes, FC } from "react";
import { cva, VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "active:scale-95 inline-flex items-center justify-center rounded-md text-s font-medium " +
    "transition-color focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 " +
    "disabled:opacity-50 disabled:pointed-events-none",
  {
    variants: {
      variant: {
        default: "bg-blue-900 text-white hover:bg-blue-800",
        ghost:
          "bg-transparent hover:text-slate-900 hover:bg-slate-200 dark:hover:bg-slate-700 dark:hover:text-slate-200",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-2",
        lg: "h-11 px-8 ",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button: FC<ButtonProps> = ({
  className,
  children,
  variant,
  size,
  isLoading,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader2 className={"mr-4 h-4 w-4 animate-spin"} /> : null}
      {children}
    </button>
  );
};
export default Button;