
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  isPositive?: boolean;
  className?: string;
}

export function StatsCard({ title, value, change, isPositive, className }: StatsCardProps) {
  return (
    <Card className={cn(
      "p-6 backdrop-blur-sm bg-card/30 border-0 shadow-xl transition-all duration-300 hover:bg-card/40",
      className
    )}>
      <p className="text-sm font-medium text-gray-400">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
      {change && (
        <p className={cn(
          "text-sm mt-2",
          isPositive ? "text-profit" : "text-loss"
        )}>
          {isPositive ? "+" : "-"}{Math.abs(Number(change))}%
        </p>
      )}
    </Card>
  );
}
