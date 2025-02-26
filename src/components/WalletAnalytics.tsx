
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wallet, SwapHorizontal, BarChart3, Calendar } from "lucide-react";
import { TopHoldings } from "./TopHoldings";
import { DefiTrades } from "./DefiTrades";
import { TokenPnL } from "./TokenPnL";

interface WalletAnalyticsProps {
  address: string;
}

export function WalletAnalytics({ address }: WalletAnalyticsProps) {
  const [dateFilter, setDateFilter] = useState("1d");

  return (
    <Tabs defaultValue="holdings" className="w-full">
      <TabsList className="grid grid-cols-3 w-full">
        <TabsTrigger value="holdings" className="flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Top Holdings
        </TabsTrigger>
        <TabsTrigger value="defi" className="flex items-center gap-2">
          <SwapHorizontal className="h-4 w-4" />
          DeFi Trades
        </TabsTrigger>
        <TabsTrigger value="pnl" className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Token PnL
        </TabsTrigger>
      </TabsList>
      <TabsContent value="holdings">
        <TopHoldings address={address} />
      </TabsContent>
      <TabsContent value="defi">
        <DefiTrades address={address} />
      </TabsContent>
      <TabsContent value="pnl">
        <div className="mb-4 flex justify-end gap-2">
          {["1d", "3d", "7d", "30d"].map((period) => (
            <button
              key={period}
              onClick={() => setDateFilter(period)}
              className={`px-3 py-1 rounded-md ${
                dateFilter === period
                  ? "bg-primary text-white"
                  : "bg-card/30 hover:bg-card/40"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
        <TokenPnL address={address} period={dateFilter} />
      </TabsContent>
    </Tabs>
  );
}
