import { ConnectButton } from "@mysten/dapp-kit";
import { SoundControlButton } from "@/components/SoundControlButton";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <h1 className="text-2xl font-bold tracking-tighter">TAMAGOSUI</h1>
        <div className="flex items-center gap-3">
          <SoundControlButton />
          <ConnectButton />
        </div>
      </div>
    </header>
  );
}
