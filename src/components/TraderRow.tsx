
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TraderRowProps {
  rank: number;
  address: string;
  pnl: number;
  trades: number;
  winRate: number;
}

export function TraderRow({ rank, address, pnl, trades, winRate }: TraderRowProps) {
  const isPositive = pnl >= 0;
  const formatPnL = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1e9) return `${(absValue / 1e9).toFixed(2)}B`;
    if (absValue >= 1e6) return `${(absValue / 1e6).toFixed(2)}M`;
    if (absValue >= 1e3) return `${(absValue / 1e3).toFixed(2)}K`;
    return absValue.toFixed(2);
  };
  
  return (
    <Card className="p-4 backdrop-blur-sm bg-card/30 border-0 shadow-xl transition-all duration-300 hover:bg-card/40 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold text-gray-400">#{rank}</span>
        <span className="font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span>
      </div>
      <div className="flex items-center gap-8">
        <span className={cn(
          "font-bold",
          isPositive ? "text-profit" : "text-loss"
        )}>
          {isPositive ? "+" : "-"}${formatPnL(pnl)}
        </span>
        <span className="text-gray-400">{trades} trades</span>
        <span className="text-gray-400">{winRate}% win rate</span>
      </div>
    </Card>
  );
}
