// src/pages/home/components/PetComponent.tsx

import { useEffect, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { TooltipProvider } from "@/components/ui/tooltip";

import { DraggablePetCard } from "./components/DraggablePetCard";
import { WardrobeModal } from "@/pages/home/components/WardrobeModal";

import { useMutateCheckAndLevelUp } from "@/hooks/useMutateCheckLevel";
import { useMutateFeedPet } from "@/hooks/useMutateFeedPet";
import { useMutateLetPetSleep } from "@/hooks/useMutateLetPetSleep";
import { useMutatePlayWithPet } from "@/hooks/useMutatePlayWithPet";
import { useMutateWakeUpPet } from "@/hooks/useMutateWakeUpPet";
import { useMutateWorkForCoins } from "@/hooks/useMutateWorkForCoins";
import { useQueryGameBalance } from "@/hooks/useQueryGameBalance";
import { useSmartSoundEffects } from "@/hooks/useSmartSoundEffects";
import type { PetStruct } from "@/types/Pet";

type PetDashboardProps = {
  pet: PetStruct;
};

export default function PetComponent({ pet }: PetDashboardProps) {
  // Semua hooks dan state tetap sama persis
  const { data: gameBalance, isLoading: isLoadingGameBalance } = useQueryGameBalance();
  const [displayStats, setDisplayStats] = useState(pet.stats);
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const { mutate: mutateFeedPet, isPending: isFeeding } = useMutateFeedPet();
  const { mutate: mutatePlayWithPet, isPending: isPlaying } = useMutatePlayWithPet();
  const { mutate: mutateWorkForCoins, isPending: isWorking } = useMutateWorkForCoins();
  const { mutate: mutateLetPetSleep, isPending: isSleeping } = useMutateLetPetSleep();
  const { mutate: mutateWakeUpPet, isPending: isWakingUp } = useMutateWakeUpPet();
  const { mutate: mutateLevelUp, isPending: isLevelingUp } = useMutateCheckAndLevelUp();
  const { soundEffects } = useSmartSoundEffects();

  // Semua useEffect tetap sama
  useEffect(() => {
    setDisplayStats(pet.stats);
  }, [pet.stats]);

  useEffect(() => {
    if (pet.isSleeping && !isWakingUp && gameBalance) {
      const intervalId = setInterval(() => {
        setDisplayStats((prev) => {
          const energyPerSecond = 1000 / Number(gameBalance.sleep_energy_gain_ms);
          const hungerLossPerSecond = 1000 / Number(gameBalance.sleep_hunger_loss_ms);
          const happinessLossPerSecond = 1000 / Number(gameBalance.sleep_happiness_loss_ms);
          return {
            energy: Math.min(gameBalance.max_stat, prev.energy + energyPerSecond),
            hunger: Math.max(0, prev.hunger - hungerLossPerSecond),
            happiness: Math.max(0, prev.happiness - happinessLossPerSecond),
          };
        });
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [pet.isSleeping, isWakingUp, gameBalance]);

  if (isLoadingGameBalance || !gameBalance) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full bg-[#0D0B14]">
        <Loader2Icon className="w-8 h-8 animate-spin mr-4 text-white" />
        <h1 className="text-2xl font-pixel text-white">Loading Game...</h1>
      </div>
    );
  }

  // Semua kalkulasi logic dan handlers tetap sama
  const isAnyActionPending = isFeeding || isPlaying || isSleeping || isWorking || isLevelingUp || isWakingUp;
  const canFeed = !pet.isSleeping && pet.stats.hunger < gameBalance.max_stat && pet.game_data.coins >= Number(gameBalance.feed_coins_cost);
  const canPlay = !pet.isSleeping && pet.stats.energy >= gameBalance.play_energy_loss && pet.stats.hunger >= gameBalance.play_hunger_loss;
  const canWork = !pet.isSleeping && pet.stats.energy >= gameBalance.work_energy_loss && pet.stats.happiness >= gameBalance.work_happiness_loss && pet.stats.hunger >= gameBalance.work_hunger_loss;
  const canLevelUp = !pet.isSleeping && pet.game_data.experience >= pet.game_data.level * Number(gameBalance.exp_per_level);

  const handleFeed = () => { soundEffects.feedSound.play(); mutateFeedPet({ petId: pet.id }); };
  const handlePlay = () => { soundEffects.playSound.play(); mutatePlayWithPet({ petId: pet.id }); };
  const handleWork = () => { soundEffects.workSound.play(); mutateWorkForCoins({ petId: pet.id }); };
  const handleSleep = () => { soundEffects.sleepSound.play(); mutateLetPetSleep({ petId: pet.id }); };
  const handleWakeUp = () => { soundEffects.sleepSound.stop(); soundEffects.wakeUpSound.play(); mutateWakeUpPet({ petId: pet.id }); };
  const handleLevelUp = () => { soundEffects.levelUpSound.play(); mutateLevelUp({ petId: pet.id }); };
  const handleWardrobeClick = () => { soundEffects.clickSound.play(); setIsWardrobeOpen(true); };

  return (
    <main className="flex justify-center min-h-screen w-full bg-white p-4 pt-20 overflow-hidden">
      <TooltipProvider>
        <DraggablePetCard
          pet={pet}
          gameBalance={gameBalance}
          displayStats={displayStats}
          isAnyActionPending={isAnyActionPending}
          isFeeding={isFeeding}
          isPlaying={isPlaying}
          isWorking={isWorking}
          isWakingUp={isWakingUp}
          isLevelingUp={isLevelingUp}
          canFeed={canFeed}
          canPlay={canPlay}
          canWork={canWork}
          canLevelUp={canLevelUp}
          onFeed={handleFeed}
          onPlay={handlePlay}
          onWork={handleWork}
          onSleep={handleSleep}
          onWakeUp={handleWakeUp}
          onLevelUp={handleLevelUp}
          onWardrobeClick={handleWardrobeClick}
        />

        <AnimatePresence>
          {isWardrobeOpen && (
            <WardrobeModal
              pet={pet}
              isAnyActionPending={isAnyActionPending}
              isOpen={isWardrobeOpen}
              onClose={() => setIsWardrobeOpen(false)}
            />
          )}
        </AnimatePresence>
      </TooltipProvider>
    </main>
  );
}
