
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchTokenBalances } from "@/utils/api";

interface TopHoldingsProps {
  address: string;
}

export function TopHoldings({ address }: TopHoldingsProps) {
  const { data: holdings, isLoading } = useQuery({
    queryKey: ["holdings", address],
    queryFn: () => fetchTokenBalances(address),
    enabled: !!address,
  });

  if (isLoading) return <div>Loading holdings...</div>;

  return (
    <div className="space-y-4">
      {holdings?.map((holding, index) => (
        <Card key={index} className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={holding.logo || "/placeholder.svg"}
              alt={holding.symbol}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-bold">{holding.symbol}</p>
              <p className="text-sm text-gray-400">{holding.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold">${holding.valueUsd.toFixed(2)}</p>
            <p className="text-sm text-gray-400">
              {holding.amount.toFixed(2)} tokens
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
