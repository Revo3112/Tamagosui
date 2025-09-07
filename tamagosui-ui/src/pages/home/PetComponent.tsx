// (Import statements tetap sama seperti kode Anda)
import { useEffect, useState } from "react";
import {
  HeartIcon,
  Loader2Icon,
  BatteryIcon,
  DrumstickIcon,
  PlayIcon,
  BedIcon,
  BriefcaseIcon,
  ZapIcon,
  SparklesIcon,
  ShirtIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { PetHeader } from "@/pages/home/components/PetHeader";
import { StatDisplay } from "@/pages/home/components/StatDisplay";
import { ActionButton } from "@/pages/home/components/ActionButton";
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
    // (Semua hooks dan state tetap sama)
    const { data: gameBalance, isLoading: isLoadingGameBalance } = useQueryGameBalance();
    const [displayStats, setDisplayStats] = useState(pet.stats);
    const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
    const { mutate: mutateFeedPet, isPending: isFeeding } = useMutateFeedPet();
    const { mutate: mutatePlayWithPet, isPending: isPlaying } = useMutatePlayWithPet();
    const { mutate: mutateWorkForCoins, isPending: isWorking } = useMutateWorkForCoins();
    const { mutate: mutateLetPetSleep, isPending: isSleeping } = useMutateLetPetSleep();
    const { mutate: mutateWakeUpPet, isPending: isWakingUp } = useMutateWakeUpPet();
    const { mutate: mutateLevelUp, isPending: isLevelingUp } = useMutateCheckAndLevelUp();

    // Sound effects hooks
    const { soundEffects } = useSmartSoundEffects();

    // (Semua useEffect dan logic tetap sama)
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
          <div className="flex items-center justify-center h-screen w-screen bg-[#1a1a2e]">
            <Loader2Icon className="w-8 h-8 animate-spin mr-4 text-white" />
            <h1 className="text-2xl font-pixel text-white">Loading Game Rules...</h1>
          </div>
        );
    }

    const isAnyActionPending = isFeeding || isPlaying || isSleeping || isWorking || isLevelingUp || isWakingUp;
    const canFeed = !pet.isSleeping && pet.stats.hunger < gameBalance.max_stat && pet.game_data.coins >= Number(gameBalance.feed_coins_cost);
    const canPlay = !pet.isSleeping && pet.stats.energy >= gameBalance.play_energy_loss && pet.stats.hunger >= gameBalance.play_hunger_loss;
    const canWork = !pet.isSleeping && pet.stats.energy >= gameBalance.work_energy_loss && pet.stats.happiness >= gameBalance.work_happiness_loss && pet.stats.hunger >= gameBalance.work_hunger_loss;
    const canLevelUp = !pet.isSleeping && pet.game_data.experience >= pet.game_data.level * Number(gameBalance.exp_per_level);

    // Sound effect handlers
    const handleFeed = () => {
        soundEffects.feedSound.play();
        mutateFeedPet({ petId: pet.id });
    };

    const handlePlay = () => {
        soundEffects.playSound.play();
        mutatePlayWithPet({ petId: pet.id });
    };

    const handleWork = () => {
        soundEffects.workSound.play();
        mutateWorkForCoins({ petId: pet.id });
    };

    const handleSleep = () => {
        soundEffects.sleepSound.play(); // Start looping sleep sound
        mutateLetPetSleep({ petId: pet.id });
    };

    const handleWakeUp = () => {
        soundEffects.sleepSound.stop(); // Stop looping sleep sound
        soundEffects.wakeUpSound.play(); // Play wake up sound
        mutateWakeUpPet({ petId: pet.id });
    };

    const handleLevelUp = () => {
        soundEffects.levelUpSound.play();
        mutateLevelUp({ petId: pet.id });
    };

    const handleWardrobeClick = () => {
        soundEffects.clickSound.play();
        setIsWardrobeOpen(true);
    };

    return (
        <TooltipProvider>
            {/* DIHAPUS: Wrapper dengan gradient background. Komponen sekarang berdiri sendiri. */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                {/* DIUBAH:
                    - Ukuran diubah menjadi w-[380px] agar tidak terlalu kecil/besar.
                    - Background diubah menjadi warna solid (#1a1a2e) dan tanpa blur.
                    - Border dibuat lebih tegas dengan warna solid (#4a4a6a).
                    - Shadow dihilangkan untuk tampilan yang lebih flat/pixel.
                    - Sudut diubah menjadi rounded-lg yang tidak terlalu melengkung.
                */}
                <Card className="w-[380px] rounded-lg bg-[#1a1a2e] border-2 border-[#4a4a6a] text-white overflow-hidden font-sans">
                    <PetHeader
                        name={pet.name}
                        level={pet.game_data.level}
                        coins={pet.game_data.coins}
                        experience={pet.game_data.experience}
                        xpForNextLevel={pet.game_data.level * Number(gameBalance.exp_per_level)}
                    />
                    <CardContent className="p-5 space-y-5">
                        <div className="relative flex justify-center">
                            <motion.img
                                src={pet.image_url}
                                alt={pet.name}
                                // DIUBAH: Menyesuaikan warna border
                                className={cn(
                                    "w-36 h-36 rounded-full border-4 object-cover transition-all duration-500",
                                    pet.isSleeping ? "border-blue-500/30 filter grayscale" : "border-[#4a4a6a]"
                                )}
                                whileHover={{ scale: pet.isSleeping ? 1 : 1.05 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            />
                            {pet.isSleeping && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-5xl font-bold font-pixel text-blue-300 animate-pulse">
                                        Zzz...
                                    </motion.div>
                                </div>
                            )}
                        </div>

                        {/* Stat Bars (Tidak perlu diubah, sudah bagus) */}
                        <div className="space-y-3">
                            <StatDisplay icon={<BatteryIcon className="text-green-400" />} label="Energy" value={displayStats.energy} color="bg-green-500" />
                            <StatDisplay icon={<HeartIcon className="text-pink-400" />} label="Happiness" value={displayStats.happiness} color="bg-pink-500" />
                            <StatDisplay icon={<DrumstickIcon className="text-orange-400" />} label="Hunger" value={displayStats.hunger} color="bg-orange-500" />
                        </div>

                        {/* Level Up Button (Tidak perlu diubah) */}
                        <div>
                            <Button
                                onClick={handleLevelUp}
                                disabled={!canLevelUp || isAnyActionPending}
                                className={cn(
                                    "w-full text-lg font-bold bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg",
                                    canLevelUp && "animate-pulse shadow-yellow-400/50"
                                )}
                            >
                                {isLevelingUp ? <Loader2Icon className="mr-2 h-5 w-5 animate-spin" /> : <SparklesIcon className="mr-2 h-5 w-5" />}
                                Level Up!
                            </Button>
                        </div>

                        {/* Action Buttons (Tidak perlu diubah) */}
                        <div className="grid grid-cols-2 gap-4">
                            <ActionButton onClick={handleFeed} disabled={!canFeed || isAnyActionPending} isPending={isFeeding} label="Feed" icon={<DrumstickIcon />} />
                            <ActionButton onClick={handlePlay} disabled={!canPlay || isAnyActionPending} isPending={isPlaying} label="Play" icon={<PlayIcon />} />
                            <ActionButton onClick={handleWork} disabled={!canWork || isAnyActionPending} isPending={isWorking} label="Work" icon={<BriefcaseIcon />} className="col-span-2" />
                        </div>

                        {/* Sleep & Wardrobe Buttons */}
                        <div className="grid grid-cols-2 gap-4 pt-2">
                            {pet.isSleeping ? (
                                <Button onClick={handleWakeUp} disabled={isWakingUp} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-bold">
                                    {isWakingUp ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <ZapIcon className="mr-2 h-4 w-4" />} Wake Up!
                                </Button>
                            ) : (
                                <Button onClick={handleSleep} disabled={isAnyActionPending} className="w-full bg-blue-600 hover:bg-blue-700 rounded-lg font-bold">
                                    {isSleeping ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <BedIcon className="mr-2 h-4 w-4" />} Sleep
                                </Button>
                            )}
                            {/* DIUBAH: Menyesuaikan style tombol Wardrobe */}
                            <Button onClick={handleWardrobeClick} disabled={isAnyActionPending} variant="outline" className="w-full bg-transparent border-purple-400 hover:bg-purple-500/20 text-purple-300 hover:text-purple-300 rounded-lg font-bold">
                                <ShirtIcon className="mr-2 h-4 w-4" /> Wardrobe
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

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
    );
}
