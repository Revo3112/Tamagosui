// src/pages/home/components/PetStatsAndActions.tsx

import {
  HeartIcon,
  BatteryIcon,
  DrumstickIcon,
  PlayIcon,
  BedIcon,
  BriefcaseIcon,
  ZapIcon,
  SparklesIcon,
  ShirtIcon,
  Loader2Icon,
  CoinsIcon,
  StarIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { StatDisplay } from "./StatDisplay";
import { ActionButton } from "./ActionButton";

// Definisikan tipe props yang sangat detail untuk type safety
type PetStatsAndActionsProps = {
  pet: any; // Ganti dengan PetStruct jika memungkinkan
  gameBalance: any; // Ganti dengan tipe yang lebih spesifik
  displayStats: { energy: number; happiness: number; hunger: number };
  isAnyActionPending: boolean;
  isFeeding: boolean;
  isPlaying: boolean;
  isWorking: boolean;
  isSleeping: boolean;
  isWakingUp: boolean;
  isLevelingUp: boolean;
  canFeed: boolean;
  canPlay: boolean;
  canWork: boolean;
  canLevelUp: boolean;
  onFeed: () => void;
  onPlay: () => void;
  onWork: () => void;
  onSleep: () => void;
  onWakeUp: () => void;
  onLevelUp: () => void;
  onWardrobeClick: () => void;
};

export function PetStatsAndActions({
  pet,
  gameBalance,
  displayStats,
  isAnyActionPending,
  isFeeding,
  isPlaying,
  isWorking,
  isSleeping,
  isWakingUp,
  isLevelingUp,
  canFeed,
  canPlay,
  canWork,
  canLevelUp,
  onFeed,
  onPlay,
  onWork,
  onSleep,
  onWakeUp,
  onLevelUp,
  onWardrobeClick,
}: PetStatsAndActionsProps) {

  const xpForNextLevel = pet.game_data.level * Number(gameBalance.exp_per_level);
  const xpProgress = (pet.game_data.experience / xpForNextLevel) * 100;

  return (
    <div className="flex flex-col justify-between h-full space-y-5">
      {/* Bagian Atas: Koin dan XP Bar */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <Tooltip>
              <TooltipTrigger className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-full border border-yellow-500/30">
                <CoinsIcon className="w-6 h-6 text-yellow-400" />
                <span className="font-bold text-xl text-yellow-300">{pet.game_data.coins}</span>
              </TooltipTrigger>
              <TooltipContent><p>Your Coins</p></TooltipContent>
            </Tooltip>
        </div>
        <Tooltip>
          <TooltipTrigger className="w-full cursor-default">
            <div className="flex items-center gap-3">
              <StarIcon className="w-6 h-6 text-purple-400" />
              <Progress value={xpProgress} className="h-4 bg-slate-700 [&>div]:bg-purple-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent><p>XP: {pet.game_data.experience} / {xpForNextLevel}</p></TooltipContent>
        </Tooltip>
      </div>

      {/* Statistik Utama */}
      <div className="space-y-3">
        <StatDisplay icon={<BatteryIcon className="text-green-400 w-7 h-7" />} label="Energy" value={displayStats.energy} color="bg-green-500" />
        <StatDisplay icon={<HeartIcon className="text-pink-400 w-7 h-7" />} label="Happiness" value={displayStats.happiness} color="bg-pink-500" />
        <StatDisplay icon={<DrumstickIcon className="text-orange-400 w-7 h-7" />} label="Hunger" value={displayStats.hunger} color="bg-orange-500" />
      </div>

      {/* Tombol Level Up */}
      <div>
        <Button
          onClick={onLevelUp}
          disabled={!canLevelUp || isAnyActionPending}
          className={cn(
            "w-full text-lg font-bold bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg py-6",
            canLevelUp && "animate-pulse shadow-yellow-400/50"
          )}
        >
          {isLevelingUp ? <Loader2Icon className="mr-2 h-5 w-5 animate-spin" /> : <SparklesIcon className="mr-2 h-5 w-5" />}
          Level Up!
        </Button>
      </div>

      {/* Tombol Aksi */}
      <div className="grid grid-cols-2 gap-4">
        <ActionButton onClick={onFeed} disabled={!canFeed || isAnyActionPending} isPending={isFeeding} label="Feed" icon={<DrumstickIcon />} />
        <ActionButton onClick={onPlay} disabled={!canPlay || isAnyActionPending} isPending={isPlaying} label="Play" icon={<PlayIcon />} />
        <ActionButton onClick={onWork} disabled={!canWork || isAnyActionPending} isPending={isWorking} label="Work" icon={<BriefcaseIcon />} className="col-span-2" />
      </div>

      {/* Tombol Sleep & Wardrobe */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        {pet.isSleeping ? (
          <Button onClick={onWakeUp} disabled={isWakingUp} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-bold py-5">
            {isWakingUp ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <ZapIcon className="mr-2 h-4 w-4" />} Wake Up!
          </Button>
        ) : (
          <Button onClick={onSleep} disabled={isAnyActionPending} className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg font-bold py-5">
            {isSleeping ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <BedIcon className="mr-2 h-4 w-4" />} Sleep
          </Button>
        )}
        <Button onClick={onWardrobeClick} disabled={isAnyActionPending} variant="outline" className="w-full bg-transparent border-purple-400 hover:bg-purple-500/20 text-purple-300 hover:text-purple-300 rounded-lg font-bold py-5">
          <ShirtIcon className="mr-2 h-4 w-4" /> Wardrobe
        </Button>
      </div>
    </div>
  );
}
