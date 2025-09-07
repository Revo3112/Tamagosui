// src/pages/home/components/DraggablePetCard.tsx

import { motion, useMotionValue, animate, type PanInfo } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
    HeartIcon, BatteryIcon, DrumstickIcon, PlayIcon, BedIcon,
    BriefcaseIcon, ZapIcon, SparklesIcon, ShirtIcon, Loader2Icon,
    CoinsIcon, StarIcon,
} from "lucide-react";
import { StatDisplay } from "./StatDisplay";
import { ActionButton } from "./ActionButton";

type DraggablePetCardProps = {
    pet: any;
    gameBalance: any;
    displayStats: { energy: number; happiness: number; hunger: number };
    isAnyActionPending: boolean; isFeeding: boolean; isPlaying: boolean;
    isWorking: boolean; isWakingUp: boolean; isLevelingUp: boolean;
    canFeed: boolean; canPlay: boolean; canWork: boolean; canLevelUp: boolean;
    onFeed: () => void; onPlay: () => void; onWork: () => void;
    onSleep: () => void; onWakeUp: () => void; onLevelUp: () => void;
    onWardrobeClick: () => void;
};

export function DraggablePetCard({ pet, gameBalance, displayStats, ...props }: DraggablePetCardProps) {
  // === KONSTANTA FISIKA PENDULUM ===
  // Kembalikan panjang tali seperti semula
  const PENDULUM_LENGTH = 180; // Dipanjangkan kembali
  const VELOCITY_DAMPING = 0.012;

  // === MOTION VALUES & DRAG HANDLERS ===
  const pendulumAngle = useMotionValue(0);
  const isDragging = useMotionValue(false);

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    isDragging.set(true);
    const deltaX = info.offset.x;
    const deltaY = info.offset.y;
    const angleRad = Math.atan2(-deltaX, PENDULUM_LENGTH + deltaY);
    const angleDeg = (angleRad * 180) / Math.PI;
    const clampedAngle = Math.max(-45, Math.min(45, angleDeg));
    pendulumAngle.set(clampedAngle);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    isDragging.set(false);
    const angularVelocity = -(info.velocity.x / PENDULUM_LENGTH) * VELOCITY_DAMPING;
    animate(pendulumAngle, 0, {
      type: "spring",
      stiffness: 80,
      damping: 12,
      mass: 2.5,
      velocity: angularVelocity,
    });
  };

  const xpForNextLevel = pet.game_data.level * Number(gameBalance.exp_per_level);
  const xpProgress = (pet.game_data.experience / xpForNextLevel) * 100;

  return (
    // Background yang tidak menyebabkan scroll
    <div className="fixed inset-0 flex items-center justify-center bg-white overflow-hidden">
      {/* === TITIK GANTUNG TETAP (PIVOT POINT) === */}
      <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center">
        {/* Mounting point & Hook visual */}
        <div className="w-4 h-6 bg-slate-600 rounded-t-full shadow-lg"></div>
        <div className="w-8 h-8 bg-slate-500 rounded-full border-2 border-slate-400 shadow-xl">
          <div className="w-2 h-2 bg-slate-700 rounded-full mx-auto mt-1.5"></div>
        </div>

        {/* === PENDULUM ARM (BERROTASI DARI PIVOT) === */}
        <motion.div
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          style={{
            rotate: pendulumAngle,
            transformOrigin: "50% 0%", // Pivot point di atas tengah
          }}
          className="cursor-grab active:cursor-grabbing z-20"
          initial={{ opacity: 0, rotate: -5 }}
          animate={{ opacity: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* === TALI/CHAIN VISUAL === */}
          <div className="flex flex-col items-center">
            <div
              className="w-2 bg-gradient-to-b from-slate-500 to-slate-600 rounded-full shadow-inner"
              style={{ height: PENDULUM_LENGTH }}
            ></div>
            <div className="w-4 h-3 bg-slate-500 rounded-full border border-slate-400 -mt-1 mb-1"></div>
          </div>

          {/* === CARD DI UJUNG PENDULUM === */}
          <div className="-mt-1">
            <Card className="w-[600px] max-w-[90vw] rounded-xl bg-white/95 backdrop-blur-sm border-2 border-slate-300 text-slate-800 overflow-visible font-sans shadow-2xl relative z-10 mx-auto">
              <CardContent className="p-5">
                <div className="flex gap-5">
                  {/* === KOLOM KIRI: AVATAR & NAMA === */}
                  <div className="w-1/3 flex flex-col items-center justify-center space-y-3">
                    <motion.img
                      src={pet.image_url} alt={pet.name}
                      className={cn( "w-36 h-36 rounded-full border-4 object-cover transition-all duration-500", pet.isSleeping ? "border-blue-300/50 filter grayscale" : "border-slate-300")}
                      whileHover={{ scale: pet.isSleeping ? 1 : 1.05, rotate: pet.isSleeping ? 0 : 2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                    <div className="text-center">
                      <h2 className="text-2xl font-bold font-pixel tracking-wider text-slate-700">{pet.name}</h2>
                      <p className="text-base text-slate-500 font-semibold">Level {pet.game_data.level}</p>
                    </div>
                  </div>

                  {/* === KOLOM KANAN: STATS & AKSI === */}
                  <div className="w-2/3 flex flex-col space-y-2.5">
                    {/* Baris 1: Koin & XP */}
                    <div className="flex justify-between items-center">
                      <Tooltip>
                        <TooltipTrigger className="flex items-center gap-2 px-3 py-1.5 bg-yellow-400/20 rounded-full border border-yellow-400/40">
                          <CoinsIcon className="w-5 h-5 text-yellow-600" />
                          <span className="font-bold text-lg text-yellow-700">{pet.game_data.coins}</span>
                        </TooltipTrigger>
                        <TooltipContent><p>Your Coins</p></TooltipContent>
                      </Tooltip>
                      <div className="w-full max-w-xs pl-4">
                        <Tooltip>
                          <TooltipTrigger className="w-full cursor-default">
                            <div className="flex items-center gap-2">
                              <StarIcon className="w-5 h-5 text-purple-500 flex-shrink-0" />
                              <Progress value={xpProgress} className="h-3 bg-slate-200 [&>div]:bg-purple-500" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent><p>XP: {pet.game_data.experience} / {xpForNextLevel}</p></TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    {/* Baris 2: Stat Bars */}
                    <div className="space-y-1.5 pt-1">
                      <StatDisplay icon={<BatteryIcon className="text-green-500 w-6 h-6" />} label="Energy" value={displayStats.energy} color="bg-green-500" />
                      <StatDisplay icon={<HeartIcon className="text-pink-500 w-6 h-6" />} label="Happiness" value={displayStats.happiness} color="bg-pink-500" />
                      <StatDisplay icon={<DrumstickIcon className="text-orange-500 w-6 h-6" />} label="Hunger" value={displayStats.hunger} color="bg-orange-500" />
                    </div>

                    {/* Baris 3: Level Up Button */}
                    <Button onClick={props.onLevelUp} disabled={!props.canLevelUp || props.isAnyActionPending} className={cn("w-full text-md font-bold bg-yellow-400 hover:bg-yellow-500 text-slate-800 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg py-2.5", props.canLevelUp && "animate-pulse shadow-yellow-400/50")}>
                      {props.isLevelingUp ? <Loader2Icon className="mr-2 h-5 w-5 animate-spin" /> : <SparklesIcon className="mr-2 h-5 w-5" />}
                      Level Up!
                    </Button>

                    {/* Baris 4 & 5: Action Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <ActionButton onClick={props.onFeed} disabled={!props.canFeed || props.isAnyActionPending} isPending={props.isFeeding} label="Feed" icon={<DrumstickIcon />} className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5" />
                      <ActionButton onClick={props.onPlay} disabled={!props.canPlay || props.isAnyActionPending} isPending={props.isPlaying} label="Play" icon={<PlayIcon />} className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5" />
                      <ActionButton onClick={props.onWork} disabled={!props.canWork || props.isAnyActionPending} isPending={props.isWorking} label="Work" icon={<BriefcaseIcon />} className="col-span-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5" />
                      {pet.isSleeping ? (
                        <Button onClick={props.onWakeUp} disabled={props.isWakingUp} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-bold py-2.5">
                          {props.isWakingUp ? <Loader2Icon className="mr-2 h-5 w-5 animate-spin" /> : <ZapIcon className="mr-2 h-5 w-5" />} Wake Up!
                        </Button>
                      ) : (
                        <Button onClick={props.onSleep} disabled={props.isAnyActionPending} className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold py-2.5">
                          <BedIcon className="mr-2 h-5 w-5" /> Sleep
                        </Button>
                      )}
                      <Button onClick={props.onWardrobeClick} disabled={props.isAnyActionPending} variant="outline" className="w-full bg-transparent border-purple-400 text-purple-500 hover:bg-purple-400/10 hover:text-purple-600 rounded-lg font-bold py-2.5">
                        <ShirtIcon className="mr-2 h-5 w-5" /> Wardrobe
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
