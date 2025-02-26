
const HELIUS_API_KEY = "8a10cafb-6ef0-4910-9172-c98829cf0317";
const BIRDEYE_API_KEY = "1941ebdf9f6d47d78edf60ba1c300f66";
const SOLSCAN_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE3NDA0NjEyNDE3MDIsImVtYWlsIjoicGF1bG9maWxpcGU2OTk2QGdtYWlsLmNvbSIsImFjdGlvbiI6InRva2VuLWFwaSIsImFwaVZlcnNpb24iOiJ2MiIsImlhdCI6MTc0MDQ2MTI0MX0.h4_lr8qPvspdDhHK9VumeP3FyMRrwPm4Nq9s1lpoXB8";

interface Transaction {
  signature: string;
  timestamp: number;
  value: number;
}

interface TraderData {
  address: string;
  transactions: Transaction[];
  pnl: number;
  trades: number;
  winRate: number;
}

interface TokenHolding {
  symbol: string;
  name: string;
  amount: number;
  valueUsd: number;
  logo?: string;
}

interface DefiTrade {
  protocol: string;
  type: string;
  valueUsd: number;
  timestamp: number;
}

interface TokenPnLData {
  symbol: string;
  name: string;
  pnl: number;
  percentageChange: number;
  logo?: string;
}

export const fetchTraderData = async (walletAddress: string): Promise<TraderData> => {
  try {
    // Fetch transactions using the Parse Transaction History endpoint
    const heliusResponse = await fetch(
      `https://api.helius.xyz/v0/addresses/${walletAddress}/transactions/?api-key=${HELIUS_API_KEY}`
    );
    const heliusData = await heliusResponse.json();

    // Process transactions
    const transactions = (heliusData || []).map((tx: any) => {
      // Calculate transaction value from token transfers and native transfers
      let value = 0;
      
      // Add up native SOL transfers
      if (tx.nativeTransfers) {
        tx.nativeTransfers.forEach((transfer: any) => {
          if (transfer.fromUserAccount === walletAddress) {
            value -= transfer.amount;
          }
          if (transfer.toUserAccount === walletAddress) {
            value += transfer.amount;
          }
        });
      }

      // Add up token transfers
      if (tx.tokenTransfers) {
        tx.tokenTransfers.forEach((transfer: any) => {
          if (transfer.fromUserAccount === walletAddress) {
            value -= Number(transfer.tokenAmount);
          }
          if (transfer.toUserAccount === walletAddress) {
            value += Number(transfer.tokenAmount);
          }
        });
      }

      return {
        signature: tx.signature || "",
        timestamp: tx.timestamp || Date.now(),
        value: value,
      };
    });

    // Calculate metrics
    const pnl = transactions.reduce((acc: number, tx: Transaction) => acc + tx.value, 0);
    const trades = transactions.length;
    const winningTrades = transactions.filter(tx => tx.value > 0).length;
    const winRate = trades > 0 ? Math.round((winningTrades / trades) * 100) : 0;

    return {
      address: walletAddress,
      transactions,
      pnl,
      trades,
      winRate,
    };
  } catch (error) {
    console.error('Error fetching trader data:', error);
    throw error;
  }
};

export const fetchTokenBalances = async (address: string): Promise<TokenHolding[]> => {
  try {
    const response = await fetch(
      `https://api.helius.xyz/v0/addresses/${address}/balances?api-key=${HELIUS_API_KEY}`
    );
    const data = await response.json();
    
    return data.tokens.map((token: any) => ({
      symbol: token.symbol || "Unknown",
      name: token.name || "Unknown Token",
      amount: token.amount || 0,
      valueUsd: token.valueUsd || 0,
      logo: token.logo,
    }));
  } catch (error) {
    console.error("Error fetching token balances:", error);
    throw error;
  }
};

export const fetchDefiTrades = async (address: string): Promise<DefiTrade[]> => {
  try {
    const response = await fetch(
      `https://api.helius.xyz/v0/addresses/${address}/transactions?api-key=${HELIUS_API_KEY}`
    );
    const data = await response.json();
    
    return data
      .filter((tx: any) => tx.type === "SWAP" || tx.type === "LIQUIDITY")
      .map((tx: any) => ({
        protocol: tx.protocol || "Unknown Protocol",
        type: tx.type || "Unknown",
        valueUsd: tx.valueUsd || 0,
        timestamp: tx.timestamp || Date.now(),
      }));
  } catch (error) {
    console.error("Error fetching DeFi trades:", error);
    throw error;
  }
};

export const fetchTokenPnL = async (address: string, period: string): Promise<TokenPnLData[]> => {
  try {
    // Convert period to timestamp
    const now = Date.now();
    const periodMap: { [key: string]: number } = {
      "1d": 24 * 60 * 60 * 1000,
      "3d": 3 * 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
    };
    
    const startTime = now - periodMap[period];
    
    const response = await fetch(
      `https://api.helius.xyz/v0/addresses/${address}/portfolio?api-key=${HELIUS_API_KEY}&startTime=${startTime}&endTime=${now}`
    );
    const data = await response.json();
    
    return data.tokens.map((token: any) => ({
      symbol: token.symbol || "Unknown",
      name: token.name || "Unknown Token",
      pnl: token.pnl || 0,
      percentageChange: token.percentageChange || 0,
      logo: token.logo,
    }));
  } catch (error) {
    console.error("Error fetching token PnL:", error);
    throw error;
  }
};
