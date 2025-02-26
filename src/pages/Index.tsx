
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/StatsCard";
import { TraderRow } from "@/components/TraderRow";

const mockTraders = [
  { address: "HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH", pnl: 125000, trades: 156, winRate: 68 },
  { address: "2YmHuRiGgkU4S3bwYxEYMFJ4atRxZrHZp6QWzWgkf17x", pnl: 85000, trades: 98, winRate: 72 },
  { address: "8MVwRhtiqoauQTYh8j8LoKFnNABWzLCj7hW2KqJq6EXr", pnl: -32000, trades: 45, winRate: 42 },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 animate-float">
          <h1 className="text-4xl md:text-6xl font-bold">
            Solana Trader Analytics
          </h1>
          <p className="text-gray-400 text-lg md:text-xl">
            Track top performers and analyze trading patterns
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Volume"
            value="$12.5M"
            change={15}
            isPositive={true}
          />
          <StatsCard
            title="Active Traders"
            value="1,234"
            change={8}
            isPositive={true}
          />
          <StatsCard
            title="Average ROI"
            value="32%"
            change={5}
            isPositive={true}
          />
        </div>

        {/* Search Section */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by wallet address..."
            className="w-full pl-12 pr-4 py-3 bg-card/30 backdrop-blur-sm border-0 focus:ring-2 ring-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Traders List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold mb-6">Top Traders</h2>
          {mockTraders.map((trader, index) => (
            <TraderRow
              key={trader.address}
              rank={index + 1}
              address={trader.address}
              pnl={trader.pnl}
              trades={trader.trades}
              winRate={trader.winRate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
