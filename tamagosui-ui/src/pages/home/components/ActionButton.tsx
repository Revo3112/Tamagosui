import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ActionButtonProps = {
  onClick: () => void;
  disabled: boolean;
  isPending: boolean;
  label: string;
  icon: ReactNode;
  className?: string;
};

export function ActionButton({ onClick, disabled, isPending, label, icon, className }: ActionButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      className={cn("w-full", className)}
    >
      <Button
        onClick={onClick}
        disabled={disabled || isPending}
        className="w-full cursor-pointer bg-slate-700 hover:bg-slate-600 rounded-lg font-bold text-base"
      >
        {isPending ? (
          <Loader2Icon className="mr-2 h-5 w-5 animate-spin" />
        ) : (
          <div className="mr-2 h-5 w-5">{icon}</div>
        )}
        {label}
      </Button>
    </motion.div>
  );
}
