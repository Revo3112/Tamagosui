import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { ReactNode } from "react";

type StatDisplayProps = {
  icon: ReactNode;
  label: string;
  value: number;
  color: string;
};

export function StatDisplay({ icon, label, value, color }: StatDisplayProps) {
  const roundedValue = Math.round(value);

  return (
    <Tooltip>
      <TooltipTrigger className="w-full">
        <div className="flex items-center gap-3 w-full">
          <div className="w-7 h-7 flex-shrink-0">{icon}</div>
          <div className="w-full h-4 bg-slate-700/50 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${color}`}
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          <span className="w-10 text-right font-mono font-bold text-slate-300">{roundedValue}%</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>
          {label}: {roundedValue} / 100
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
