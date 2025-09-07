import { GlassesIcon, Loader2Icon, WarehouseIcon, Crown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

import { UseMutateEquipAccessory } from "@/hooks/useMutateEquipAccessory";
import { useMutateMintAccessory } from "@/hooks/useMutateMintAccessory";
import { UseMutateUnequipAccessory } from "@/hooks/useMutateUnequipAccessory";
import { useQueryEquippedAccessories } from "@/hooks/useQueryEquippedAccessories";
import { useQueryOwnedAccessories } from "@/hooks/useQueryOwnedAccessories";

import type { PetStruct } from "@/types/Pet";

type WardrobeManagerProps = {
  pet: PetStruct;
  isAnyActionPending: boolean;
};

export function WardrobeManager({
  pet,
  isAnyActionPending,
}: WardrobeManagerProps) {
  // --- Hooks for Actions ---
  const { mutate: mutateMint, isPending: isMinting } = useMutateMintAccessory();
  const { mutate: mutateEquip, isPending: isEquipping } =
    UseMutateEquipAccessory();
  const { mutate: mutateUnequip, isPending: isUnequipping } =
    UseMutateUnequipAccessory();

  // --- Wardrobe Data Fetching Hooks ---
  const { data: ownedAccessories, isLoading: isLoadingAccessories } =
    useQueryOwnedAccessories();
  const { data: equippedAccessories, isLoading: isLoadingEquipped } =
    useQueryEquippedAccessories({ petId: pet.id });

  // A specific loading state for wardrobe actions to disable buttons.
  const isProcessingWardrobe = isMinting || isEquipping || isUnequipping;
  const isLoading = isLoadingAccessories || isLoadingEquipped;

  const renderContent = () => {
    // Priority 1: Handle the loading state first to prevent UI flicker.
    if (isLoading) {
      return (
        <p className="text-sm text-muted-foreground">Loading wardrobe...</p>
      );
    }

    // Check if any accessories are equipped
    const hasGlasses = equippedAccessories?.glasses;
    const hasHat = equippedAccessories?.hat;
    const hasAnyAccessory = hasGlasses || hasHat;

    // Priority 2: Show equipped accessories (if any)
    if (hasAnyAccessory) {
      return (
        <div className="w-full space-y-3">
          {hasGlasses && (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <img
                  src={hasGlasses.image_url}
                  alt={hasGlasses.name}
                  className="w-10 h-10 rounded-md border p-1 bg-white"
                />
                <p className="text-sm font-medium">{hasGlasses.name}</p>
              </div>
              <Button
                onClick={() => mutateUnequip({ petId: pet.id, accessoryType: "glasses" })}
                disabled={isAnyActionPending || isProcessingWardrobe}
                variant="destructive"
                size="sm"
              >
                {isUnequipping && (
                  <Loader2Icon className="mr-1 h-3 w-3 animate-spin" />
                )}
                Unequip
              </Button>
            </div>
          )}

          {hasHat && (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <img
                  src={hasHat.image_url}
                  alt={hasHat.name}
                  className="w-10 h-10 rounded-md border p-1 bg-white"
                />
                <p className="text-sm font-medium">{hasHat.name}</p>
              </div>
              <Button
                onClick={() => mutateUnequip({ petId: pet.id, accessoryType: "hat" })}
                disabled={isAnyActionPending || isProcessingWardrobe}
                variant="destructive"
                size="sm"
              >
                {isUnequipping && (
                  <Loader2Icon className="mr-1 h-3 w-3 animate-spin" />
                )}
                Unequip
              </Button>
            </div>
          )}
        </div>
      );
    }

    // Priority 3: Show available accessories to equip (if any in inventory)
    if (ownedAccessories && ownedAccessories.length > 0) {
      const glassesInInventory = ownedAccessories.find(acc => acc.accessory_type === "glasses");
      const hatInInventory = ownedAccessories.find(acc => acc.accessory_type === "hat");

      return (
        <div className="w-full space-y-3">
          {glassesInInventory && (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <img
                  src={glassesInInventory.image_url}
                  alt={glassesInInventory.name}
                  className="w-10 h-10 rounded-md border p-1 bg-white"
                />
                <p className="text-sm font-medium">{glassesInInventory.name}</p>
              </div>
              <Button
                onClick={() =>
                  mutateEquip({
                    petId: pet.id,
                    accessoryId: glassesInInventory.id.id,
                  })
                }
                disabled={isAnyActionPending || isProcessingWardrobe}
                size="sm"
              >
                {isEquipping && (
                  <Loader2Icon className="mr-1 h-3 w-3 animate-spin" />
                )}
                Equip
              </Button>
            </div>
          )}

          {hatInInventory && (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <img
                  src={hatInInventory.image_url}
                  alt={hatInInventory.name}
                  className="w-10 h-10 rounded-md border p-1 bg-white"
                />
                <p className="text-sm font-medium">{hatInInventory.name}</p>
              </div>
              <Button
                onClick={() =>
                  mutateEquip({
                    petId: pet.id,
                    accessoryId: hatInInventory.id.id,
                  })
                }
                disabled={isAnyActionPending || isProcessingWardrobe}
                size="sm"
              >
                {isEquipping && (
                  <Loader2Icon className="mr-1 h-3 w-3 animate-spin" />
                )}
                Equip
              </Button>
            </div>
          )}
        </div>
      );
    }

    // Priority 4: If nothing is equipped and inventory is empty, show mint buttons
    return (
      <div className="flex gap-2 w-full">
        <Button
          onClick={() => mutateMint({ accessoryType: "glasses" })}
          disabled={isAnyActionPending || isProcessingWardrobe}
          className="flex-1 cursor-pointer"
          variant="outline"
        >
          {isMinting ? (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GlassesIcon className="mr-2 h-4 w-4" />
          )}{" "}
          Mint Glasses
        </Button>
        <Button
          onClick={() => mutateMint({ accessoryType: "hat" })}
          disabled={isAnyActionPending || isProcessingWardrobe}
          className="flex-1 cursor-pointer"
          variant="outline"
        >
          {isMinting ? (
            <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Crown className="mr-2 h-4 w-4" />
          )}{" "}
          Mint Hat
        </Button>
      </div>
    );
  };

  return (
    <CardFooter className="flex-col items-start gap-4 border-t pt-4">
      <h3 className="font-bold text-muted-foreground flex items-center gap-2 mx-auto">
        <WarehouseIcon size={16} /> WARDROBE
      </h3>
      <div className="w-full text-center p-3 bg-muted rounded-lg min-h-[80px] flex items-center justify-center">
        {renderContent()}
      </div>
    </CardFooter>
  );
}
