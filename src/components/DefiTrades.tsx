
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchDefiTrades } from "@/utils/api";

interface DefiTradesProps {
  address: string;
}

export function DefiTrades({ address }: DefiTradesProps) {
  const { data: trades, isLoading } = useQuery({
    queryKey: ["defi-trades", address],
    queryFn: () => fetchDefiTrades(address),
    enabled: !!address,
  });

  if (isLoading) return <div>Loading DeFi trades...</div>;

  return (
    <div className="space-y-4">
      {trades?.map((trade, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <p className="font-bold">{trade.protocol}</p>
                <p className="text-gray-400">{trade.type}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold">${trade.valueUsd.toFixed(2)}</p>
              <p className="text-sm text-gray-400">
                {new Date(trade.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
