
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatsCard } from "@/components/StatsCard";
import { TraderRow } from "@/components/TraderRow";
import { WalletAnalytics } from "@/components/WalletAnalytics";
import { useQuery } from "@tanstack/react-query";
import { fetchTraderData } from "@/utils/api";
import { toast } from "sonner";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedAddress, setSearchedAddress] = useState("");

  const { data: traderData, isLoading } = useQuery({
    queryKey: ['trader', searchedAddress],
    queryFn: () => searchedAddress ? fetchTraderData(searchedAddress) : null,
    enabled: !!searchedAddress,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchedAddress(searchQuery.trim());
    } else {
      toast.error("Please enter a valid wallet address");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
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
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by wallet address..."
            className="w-full pl-12 pr-4 py-3 bg-card/30 backdrop-blur-sm border-0 focus:ring-2 ring-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        {/* Traders List and Analytics */}
        <div className="space-y-8">
          {isLoading && (
            <div className="text-center text-gray-400">Loading trader data...</div>
          )}
          {traderData && (
            <>
              <TraderRow
                rank={1}
                address={traderData.address}
                pnl={traderData.pnl}
                trades={traderData.trades}
                winRate={traderData.winRate}
              />
              <WalletAnalytics address={traderData.address} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
