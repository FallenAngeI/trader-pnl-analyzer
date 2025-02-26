
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

export const fetchTraderData = async (walletAddress: string): Promise<TraderData> => {
  try {
    // Fetch transactions from Helius (using correct endpoint)
    const heliusResponse = await fetch(
      `https://api.helius.xyz/v0/addresses/${walletAddress}/transactions?api-key=${HELIUS_API_KEY}`
    );
    const heliusData = await heliusResponse.json();

    // Fetch additional data from Solscan (with correct auth header)
    const solscanResponse = await fetch(
      `https://pro-api.solscan.io/v1.0/account/transactions?account=${walletAddress}`,
      {
        headers: {
          "token": SOLSCAN_API_KEY
        }
      }
    );
    const solscanData = await solscanResponse.json();

    // Handle empty response case
    const transactions = (heliusData?.transactions || []).map((tx: any) => ({
      signature: tx.signature || tx.id || "",
      timestamp: tx.timestamp || Date.now(),
      value: tx.value || 0,
    }));

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
