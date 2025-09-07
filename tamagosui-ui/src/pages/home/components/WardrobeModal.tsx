// (Import statements tetap sama)
import { GlassesIcon, Loader2Icon, WarehouseIcon, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UseMutateEquipAccessory } from "@/hooks/useMutateEquipAccessory";
import { useMutateMintAccessory } from "@/hooks/useMutateMintAccessory";
import { UseMutateUnequipAccessory } from "@/hooks/useMutateUnequipAccessory";
import { useQueryEquippedAccessories } from "@/hooks/useQueryEquippedAccessories";
import { useQueryOwnedAccessories } from "@/hooks/useQueryOwnedAccessories";
import type { PetStruct } from "@/types/Pet";


type WardrobeModalProps = {
  pet: PetStruct;
  isAnyActionPending: boolean;
  isOpen: boolean;
  onClose: () => void;
};

export function WardrobeModal({ pet, isAnyActionPending, isOpen, onClose }: WardrobeModalProps) {
    // (Semua hooks dan logic di atas return tetap sama)
    const { mutate: mutateMint, isPending: isMinting } = useMutateMintAccessory();
    const { mutate: mutateEquip, isPending: isEquipping } = UseMutateEquipAccessory();
    const { mutate: mutateUnequip, isPending: isUnequipping } = UseMutateUnequipAccessory();
    const { data: ownedAccessories, isLoading: isLoadingAccessories } = useQueryOwnedAccessories();
    const { data: equippedAccessories, isLoading: isLoadingEquipped } = useQueryEquippedAccessories({ petId: pet.id });
    const isProcessingWardrobe = isMinting || isEquipping || isUnequipping;
    const isLoading = isLoadingAccessories || isLoadingEquipped;

    // ... (Fungsi renderAccessoryItem dan renderContent tetap sama) ...
    const renderAccessoryItem = (
        acc: any,
        action: 'equip' | 'unequip'
      ) => (
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex items-center justify-between w-full p-3 bg-slate-700/50 rounded-lg"
        >
          <div className="flex items-center gap-3">
            <img src={acc.image_url} alt={acc.name} className="w-12 h-12 rounded-md border-2 border-purple-400/30 p-1 bg-slate-800" />
            <p className="text-md font-medium text-slate-200">{acc.name}</p>
          </div>
          {action === 'unequip' ? (
            <Button onClick={() => mutateUnequip({ petId: pet.id, accessoryType: acc.accessory_type })} disabled={isAnyActionPending || isProcessingWardrobe} variant="destructive" size="sm">
              {isUnequipping ? <Loader2Icon className="mr-1 h-3 w-3 animate-spin" /> : null} Unequip
            </Button>
          ) : (
            <Button onClick={() => mutateEquip({ petId: pet.id, accessoryId: acc.id.id })} disabled={isAnyActionPending || isProcessingWardrobe} size="sm" className="bg-purple-600 hover:bg-purple-700">
              {isEquipping ? <Loader2Icon className="mr-1 h-3 w-3 animate-spin" /> : null} Equip
            </Button>
          )}
        </motion.div>
      );

      const renderContent = () => {
        if (isLoading) {
          return <div className="flex justify-center items-center h-40"><Loader2Icon className="w-8 h-8 animate-spin text-purple-400" /></div>;
        }

        const unequipped = ownedAccessories?.filter(
          acc => !(
            (acc.accessory_type === 'hat' && equippedAccessories?.hat) ||
            (acc.accessory_type === 'glasses' && equippedAccessories?.glasses)
          )
        ) ?? [];

        return (
            <div className="space-y-4">
                <div>
                    <h4 className="font-bold text-lg mb-2 text-purple-300">Equipped</h4>
                    <div className="space-y-2 min-h-[50px]">
                        {equippedAccessories?.hat ? renderAccessoryItem(equippedAccessories.hat, 'unequip') : null}
                        {equippedAccessories?.glasses ? renderAccessoryItem(equippedAccessories.glasses, 'unequip') : null}
                        {!equippedAccessories?.hat && !equippedAccessories?.glasses && <p className="text-sm text-slate-400 text-center py-4">No accessories equipped.</p>}
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-2 text-purple-300">Inventory</h4>
                    <div className="space-y-2 min-h-[50px]">
                        {unequipped.length > 0 ? (
                            unequipped.map(acc => renderAccessoryItem(acc, 'equip'))
                        ) : (
                            <p className="text-sm text-slate-400 text-center py-4">Your inventory is empty.</p>
                        )}
                    </div>
                </div>
                <div>
                    <h4 className="font-bold text-lg mb-2 text-purple-300">Mint New</h4>
                    <div className="flex gap-4 w-full">
                        {/* DIUBAH:
                            - Menghapus `variant="outline"`.
                            - Menggunakan class kustom untuk styling yang lebih terkontrol.
                            - `bg-transparent`: Latar belakang transparan.
                            - `border border-purple-400`: Border solid berwarna ungu.
                            - `text-purple-300`: Warna teks ungu terang.
                            - `hover:bg-purple-500/20`: Saat di-hover, latar belakang menjadi sedikit ungu transparan.
                            - `hover:text-purple-300`: Memastikan warna teks TIDAK berubah saat di-hover.
                        */}
                        <Button
                            onClick={() => mutateMint({ accessoryType: "glasses" })}
                            disabled={isAnyActionPending || isProcessingWardrobe}
                            className="flex-1 bg-transparent border border-purple-400 text-purple-300 hover:bg-purple-500/20 hover:text-purple-300"
                        >
                            {isMinting ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <GlassesIcon className="mr-2 h-4 w-4" />} Mint Glasses
                        </Button>
                        <Button
                            onClick={() => mutateMint({ accessoryType: "hat" })}
                            disabled={isAnyActionPending || isProcessingWardrobe}
                            className="flex-1 bg-transparent border border-purple-400 text-purple-300 hover:bg-purple-500/20 hover:text-purple-300"
                        >
                            {isMinting ? <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> : <Crown className="mr-2 h-4 w-4" />} Mint Hat
                        </Button>
                    </div>
                </div>
            </div>
        );
      };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* DIUBAH: Menyesuaikan warna modal agar konsisten */}
            <DialogContent className="bg-[#1a1a2e] border-2 border-[#4a4a6a] text-white font-sans">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                        <WarehouseIcon /> Wardrobe
                    </DialogTitle>
                    <DialogDescription className="text-center text-slate-400">
                        Equip, unequip, or mint new accessories for your pet.
                    </DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto p-1 pr-4">
                    {renderContent()}
                </div>
            </DialogContent>
        </Dialog>
    );
}
