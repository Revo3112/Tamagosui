// src/pages/home/components/PetImageDisplay.tsx

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { PetStruct } from "@/types/Pet";

type PetImageDisplayProps = {
  pet: PetStruct;
};

export function PetImageDisplay({ pet }: PetImageDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center bg-slate-900/30 rounded-lg p-6 h-full">
      <div className="relative">
        <motion.img
          src={pet.image_url}
          alt={pet.name}
          className={cn(
            "w-64 h-64 rounded-full border-8 object-cover transition-all duration-500",
            pet.isSleeping
              ? "border-blue-500/30 filter grayscale"
              : "border-[#4a4a6a]"
          )}
          whileHover={{ scale: pet.isSleeping ? 1 : 1.05, rotate: pet.isSleeping ? 0 : 2 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        {pet.isSleeping && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-7xl font-bold font-pixel text-blue-300 animate-pulse"
            >
              Zzz...
            </motion.div>
          </div>
        )}
      </div>
       <h2 className="mt-6 text-5xl font-bold font-pixel tracking-wider text-purple-300">{pet.name}</h2>
       <p className="text-xl text-purple-400 font-semibold">Level {pet.game_data.level}</p>
    </div>
  );
}
