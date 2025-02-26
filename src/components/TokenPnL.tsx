
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { fetchTokenPnL } from "@/utils/api";

interface TokenPnLProps {
  address: string;
  period: string;
}

export function TokenPnL({ address, period }: TokenPnLProps) {
  const { data: pnlData, isLoading } = useQuery({
    queryKey: ["token-pnl", address, period],
    queryFn: () => fetchTokenPnL(address, period),
    enabled: !!address,
  });

  if (isLoading) return <div>Loading Token PnL...</div>;

  return (
    <div className="space-y-4">
      {pnlData?.map((token, index) => (
        <Card key={index} className="p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src={token.logo || "/placeholder.svg"}
              alt={token.symbol}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-bold">{token.symbol}</p>
              <p className="text-sm text-gray-400">{token.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={`font-bold ${token.pnl >= 0 ? "text-profit" : "text-loss"}`}>
              {token.pnl >= 0 ? "+" : "-"}${Math.abs(token.pnl).toFixed(2)}
            </p>
            <p className="text-sm text-gray-400">
              {token.percentageChange}%
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
