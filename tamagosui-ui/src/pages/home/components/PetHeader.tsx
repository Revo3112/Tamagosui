import { CoinsIcon, StarIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type PetHeaderProps = {
  name: string;
  level: number;
  coins: number;
  experience: number;
  xpForNextLevel: number;
};

export function PetHeader({ name, level, coins, experience, xpForNextLevel }: PetHeaderProps) {
  const xpProgress = (experience / xpForNextLevel) * 100;

  return (
    <div className="bg-slate-900/50 p-4 border-b border-purple-500/30">
      <div className="flex justify-between items-center mb-3">
        {/* Coins Display */}
        <Tooltip>
          <TooltipTrigger className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 rounded-full border border-yellow-500/30">
            <CoinsIcon className="w-5 h-5 text-yellow-400" />
            <span className="font-bold text-lg text-yellow-300">{coins}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Your Coins</p>
          </TooltipContent>
        </Tooltip>

        {/* Level Display */}
        <div className="text-center">
          <h1 className="text-4xl font-bold font-pixel tracking-wider text-purple-300">{name}</h1>
          <p className="text-md text-purple-400 font-semibold">Level {level}</p>
        </div>

        {/* Placeholder for symmetry */}
        <div className="w-20"></div>
      </div>

      {/* XP Bar */}
      <Tooltip>
        <TooltipTrigger className="w-full cursor-default">
          <div className="flex items-center gap-2">
            <StarIcon className="w-5 h-5 text-purple-400" />
            <Progress value={xpProgress} className="h-3 bg-slate-700 [&>div]:bg-purple-500" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>XP: {experience} / {xpForNextLevel}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
