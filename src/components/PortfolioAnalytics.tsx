import React, { useState } from "react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar 
} from "recharts";
import { 
  Activity, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Coins, 
  RefreshCw, 
  CheckCircle2, 
  Sliders, 
  Clock, 
  ShieldAlert,
  Flame,
  Zap,
  Layers,
  ArrowDownToLine
} from "lucide-react";
import { TokenData, PortfolioPosition, UserTransaction } from "../types";
import { INITIAL_CHART_DATA } from "../data/defaultToken";

interface PortfolioAnalyticsProps {
  tokenData: TokenData;
  portfolio: PortfolioPosition;
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioPosition>>;
  onOpenLiquidityRemoval?: () => void;
}

export const PortfolioAnalytics: React.FC<PortfolioAnalyticsProps> = ({
  tokenData,
  portfolio,
  setPortfolio,
  onOpenLiquidityRemoval,
}) => {
  const [activeChartMode, setActiveChartMode] = useState<"price" | "volume">("price");
  const [timeframe, setTimeframe] = useState<"1H" | "24H" | "7D" | "30D">("24H");
  
  // Swap Widget State
  const [swapMode, setSwapMode] = useState<"BUY" | "SELL">("BUY");
  const [swapSolAmount, setSwapSolAmount] = useState<string>("1.5");
  const [swapTokenAmount, setSwapTokenAmount] = useState<string>("");
  const [slippage, setSlippage] = useState<number>(1.0);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [swapSuccessNote, setSwapSuccessNote] = useState<string | null>(null);

  // User transaction history
  const [userTransactions, setUserTransactions] = useState<UserTransaction[]>([
    {
      id: "utx-1",
      date: "10 mins ago",
      type: "BUY",
      tokenAmount: 25000,
      solAmount: 6.5,
      priceUsd: 0.048,
      status: "Confirmed",
    },
    {
      id: "utx-2",
      date: "3 hours ago",
      type: "CLAIM_YIELD",
      tokenAmount: 3840,
      solAmount: 0.42,
      priceUsd: 0.0475,
      status: "Confirmed",
    },
    {
      id: "utx-3",
      date: "Yesterday",
      type: "BUY",
      tokenAmount: 80000,
      solAmount: 18.2,
      priceUsd: 0.042,
      status: "Confirmed",
    },
  ]);

  // Handle Swap calculation
  const handleSolChange = (val: string) => {
    setSwapSolAmount(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      const calculatedTokens = Math.round((num * 184.60) / tokenData.priceUsd);
      setSwapTokenAmount(calculatedTokens.toString());
    } else {
      setSwapTokenAmount("");
    }
  };

  // Execute Swap Simulation
  const handleExecuteSwap = () => {
    const solVal = parseFloat(swapSolAmount);
    if (isNaN(solVal) || solVal <= 0) return;

    setIsSwapping(true);
    setTimeout(() => {
      const tokensCalculated = Math.round((solVal * 184.60) / tokenData.priceUsd);

      if (swapMode === "BUY") {
        setPortfolio((prev) => ({
          ...prev,
          solWalletBalance: Math.max(0, prev.solWalletBalance - solVal),
          tokenBalance: prev.tokenBalance + tokensCalculated,
          currentValueUsd: (prev.tokenBalance + tokensCalculated) * tokenData.priceUsd,
          unrealizedPnlUsd: prev.unrealizedPnlUsd + (tokensCalculated * tokenData.priceUsd * 0.1),
        }));

        setUserTransactions((prev) => [
          {
            id: "utx-" + Date.now(),
            date: "Just now",
            type: "BUY",
            tokenAmount: tokensCalculated,
            solAmount: solVal,
            priceUsd: tokenData.priceUsd,
            status: "Confirmed",
          },
          ...prev,
        ]);
        setSwapSuccessNote(`Successfully swapped ${solVal} SOL for ${tokensCalculated.toLocaleString()} ${tokenData.symbol}!`);
      } else {
        // Sell
        const tokensToSell = Math.min(portfolio.tokenBalance, tokensCalculated);
        const solReceived = Number(((tokensToSell * tokenData.priceUsd) / 184.60).toFixed(2));

        setPortfolio((prev) => ({
          ...prev,
          solWalletBalance: prev.solWalletBalance + solReceived,
          tokenBalance: Math.max(0, prev.tokenBalance - tokensToSell),
          currentValueUsd: Math.max(0, (prev.tokenBalance - tokensToSell) * tokenData.priceUsd),
        }));

        setUserTransactions((prev) => [
          {
            id: "utx-" + Date.now(),
            date: "Just now",
            type: "SELL",
            tokenAmount: tokensToSell,
            solAmount: solReceived,
            priceUsd: tokenData.priceUsd,
            status: "Confirmed",
          },
          ...prev,
        ]);
        setSwapSuccessNote(`Successfully swapped ${tokensToSell.toLocaleString()} ${tokenData.symbol} for ${solReceived} SOL!`);
      }

      setIsSwapping(false);
      setTimeout(() => setSwapSuccessNote(null), 5000);
    }, 1000);
  };

  // Claim Yield Rewards
  const handleClaimYield = () => {
    if (portfolio.pendingYieldRewards <= 0) return;
    const claimedTokens = portfolio.pendingYieldRewards;
    const bonusSol = Number(((claimedTokens * tokenData.priceUsd * 0.25) / 184.60).toFixed(2));

    setPortfolio((prev) => ({
      ...prev,
      tokenBalance: prev.tokenBalance + claimedTokens,
      solWalletBalance: prev.solWalletBalance + bonusSol,
      pendingYieldRewards: 0,
      currentValueUsd: (prev.tokenBalance + claimedTokens) * tokenData.priceUsd,
    }));

    setUserTransactions((prev) => [
      {
        id: "utx-" + Date.now(),
        date: "Just now",
        type: "CLAIM_YIELD",
        tokenAmount: claimedTokens,
        solAmount: bonusSol,
        priceUsd: tokenData.priceUsd,
        status: "Confirmed",
      },
      ...prev,
    ]);

    setSwapSuccessNote(`Claimed ${claimedTokens.toLocaleString()} ${tokenData.symbol} + ${bonusSol} SOL in Rise Farming Staking Rewards!`);
    setTimeout(() => setSwapSuccessNote(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Portfolio Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md">
          <span className="text-xs font-medium text-slate-400 block mb-1">Total Position Value</span>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-white font-mono">
              ${portfolio.currentValueUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <ArrowUpRight className="h-3 w-3 mr-0.5" /> +{tokenData.priceChange24h}%
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Holdings:</span>
            <span className="font-mono text-white font-semibold">
              {portfolio.tokenBalance.toLocaleString()} {tokenData.symbol}
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md">
          <span className="text-xs font-medium text-slate-400 block mb-1">Unrealized Net PnL</span>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-emerald-400 font-mono">
              +${portfolio.unrealizedPnlUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              +{portfolio.unrealizedPnlPercent.toFixed(1)}%
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
            <span>Avg Entry:</span>
            <span className="font-mono text-slate-300">${portfolio.averageBuyPrice.toFixed(4)}</span>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block mb-1">Staked LP Position</span>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-black text-cyan-400 font-mono">
                ${portfolio.stakedLpBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className="text-xs font-semibold text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800/60">
                Tier: Diamond
              </span>
            </div>
            <div className="mt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-2">
              <span>Staking APR:</span>
              <span className="font-mono text-emerald-400 font-bold">44.5% Active</span>
            </div>
          </div>
          {onOpenLiquidityRemoval && (
            <button
              id="open-lp-removal-from-analytics-btn"
              onClick={onOpenLiquidityRemoval}
              className="mt-3 w-full rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 py-2 text-xs font-bold text-cyan-300 transition flex items-center justify-center gap-1.5"
            >
              <ArrowDownToLine className="h-3.5 w-3.5" />
              <span>Remove LP to HTN1...ZV5i</span>
            </button>
          )}
        </div>

        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 to-emerald-950/40 p-5 shadow-md flex flex-col justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 block mb-1">Unclaimed Yield Rewards</span>
            <div className="text-2xl font-black text-emerald-300 font-mono">
              {portfolio.pendingYieldRewards.toLocaleString()} {tokenData.symbol}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              ≈ ${(portfolio.pendingYieldRewards * tokenData.priceUsd).toFixed(2)} USD
            </span>
          </div>
          <button
            id="claim-yield-rewards-btn"
            onClick={handleClaimYield}
            disabled={portfolio.pendingYieldRewards <= 0}
            className="mt-3 w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 py-2 text-xs font-bold text-slate-950 transition shadow-md shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            <Zap className="h-3.5 w-3.5 fill-current" />
            <span>Claim Rewards to Wallet</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {swapSuccessNote && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3.5 text-xs text-emerald-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{swapSuccessNote}</span>
        </div>
      )}

      {/* Main Grid: Chart & Quick Swap Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg flex flex-col justify-between">
          <div>
            {/* Chart Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white tracking-wide">{tokenData.symbol}/SOL Live Feed</span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                    Raydium + Meteora
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-black text-white font-mono">${tokenData.priceUsd.toFixed(4)}</span>
                  <span className="text-xs font-bold text-emerald-400">+{tokenData.priceChange24h}% (24h)</span>
                </div>
              </div>

              {/* Mode & Timeframe Switcher */}
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
                  <button
                    onClick={() => setActiveChartMode("price")}
                    className={`px-2.5 py-1 rounded font-semibold transition ${
                      activeChartMode === "price" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Price
                  </button>
                  <button
                    onClick={() => setActiveChartMode("volume")}
                    className={`px-2.5 py-1 rounded font-semibold transition ${
                      activeChartMode === "volume" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Volume
                  </button>
                </div>

                <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
                  {(["1H", "24H", "7D", "30D"] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-2 py-1 rounded text-[11px] font-semibold transition ${
                        timeframe === tf ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recharts Area / Bar Chart */}
            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {activeChartMode === "price" ? (
                  <AreaChart data={INITIAL_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis domain={["auto", "auto"]} stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `$${v.toFixed(3)}`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#090d16",
                        borderColor: "#1e293b",
                        borderRadius: "0.75rem",
                        fontSize: "12px",
                      }}
                      formatter={(value: any) => [`$${Number(value).toFixed(4)}`, "Price"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#10b981"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#priceGradient)"
                    />
                  </AreaChart>
                ) : (
                  <BarChart data={INITIAL_CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#090d16",
                        borderColor: "#1e293b",
                        borderRadius: "0.75rem",
                        fontSize: "12px",
                      }}
                      formatter={(value: any, name: any) => [
                        `$${Number(value).toLocaleString()}`,
                        name === "buyVolume" ? "Buy Pressure" : "Sell Volume",
                      ]}
                    />
                    <Bar dataKey="buyVolume" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="sellVolume" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Social Sentiment & Buy/Sell Ratio Footer */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Buy vs Sell Pressure</span>
              <span className="font-bold text-emerald-400 font-mono">81.4% Buys</span>
              <div className="w-full bg-rose-500/80 h-1.5 rounded-full overflow-hidden mt-1">
                <div className="bg-emerald-400 h-full w-[81.4%]"></div>
              </div>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Social Mentions (24h)</span>
              <span className="font-bold text-white font-mono">14,280</span>
              <span className="text-emerald-400 text-[10px] block mt-0.5">+142% spike</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">DexScreener Watchlists</span>
              <span className="font-bold text-cyan-400 font-mono">6,840</span>
              <span className="text-slate-500 text-[10px] block mt-0.5">Top 1% Solana</span>
            </div>

            <div>
              <span className="text-slate-400 block text-[11px]">Liquidity to FDV Ratio</span>
              <span className="font-bold text-white font-mono">14.2% Healthy</span>
              <span className="text-emerald-400 text-[10px] block mt-0.5">Zero Rug Risk</span>
            </div>
          </div>
        </div>

        {/* Quick Trade / DCA Execution Panel */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Instant Solana DEX Swap</h3>
              </div>
              <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs">
                <button
                  onClick={() => setSwapMode("BUY")}
                  className={`px-3 py-1 rounded font-bold transition ${
                    swapMode === "BUY" ? "bg-emerald-500 text-slate-950" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Buy
                </button>
                <button
                  onClick={() => setSwapMode("SELL")}
                  className={`px-3 py-1 rounded font-bold transition ${
                    swapMode === "SELL" ? "bg-rose-500 text-white" : "text-slate-400 hover:text-white"
                  }`}
                >
                  Sell
                </button>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              {/* Pay Input */}
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>You Pay:</span>
                  <span>Balance: {portfolio.solWalletBalance.toFixed(2)} SOL</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={swapSolAmount}
                    onChange={(e) => handleSolChange(e.target.value)}
                    className="w-full bg-transparent font-mono text-lg font-bold text-white focus:outline-none"
                    placeholder="0.0"
                  />
                  <span className="rounded-lg bg-slate-800 px-2.5 py-1 font-bold text-slate-200 shrink-0">
                    SOL
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  ≈ ${(parseFloat(swapSolAmount || "0") * 184.60).toFixed(2)} USD
                </div>
              </div>

              {/* Receive Input */}
              <div className="rounded-xl bg-slate-950 p-3.5 border border-slate-800">
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>You Receive (Estimated):</span>
                  <span>Balance: {portfolio.tokenBalance.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    readOnly
                    value={swapTokenAmount || Math.round((parseFloat(swapSolAmount || "1") * 184.60) / tokenData.priceUsd).toLocaleString()}
                    className="w-full bg-transparent font-mono text-lg font-bold text-emerald-400 focus:outline-none"
                  />
                  <span className="rounded-lg bg-slate-800 px-2.5 py-1 font-bold text-slate-200 shrink-0">
                    {tokenData.symbol}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  1 {tokenData.symbol} = ${tokenData.priceUsd.toFixed(4)}
                </div>
              </div>

              {/* Slippage & Route */}
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Slippage Tolerance:</span>
                <div className="flex gap-1.5">
                  {[0.5, 1.0, 2.5].map((slip) => (
                    <button
                      key={slip}
                      onClick={() => setSlippage(slip)}
                      className={`px-2 py-0.5 rounded ${
                        slippage === slip ? "bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {slip}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Route Optimization:</span>
                <span className="text-slate-200 font-medium">Raydium CPMM (Best Price)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800">
            <button
              id="execute-swap-btn"
              onClick={handleExecuteSwap}
              disabled={isSwapping}
              className={`w-full rounded-xl py-3 text-xs font-bold transition shadow-lg flex items-center justify-center gap-2 ${
                swapMode === "BUY"
                  ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30"
                  : "bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/30"
              } disabled:opacity-50`}
            >
              {isSwapping ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Coins className="h-4 w-4" />}
              <span>
                {isSwapping
                  ? "Routing on Solana Mainnet..."
                  : `${swapMode === "BUY" ? "Instant Buy" : "Instant Sell"} ${tokenData.symbol}`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* User Transaction History */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Your Wallet Activity & Staking Ledger</h3>
          </div>
          <span className="text-xs text-slate-400">Live confirmation via Solana RPC</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2">Time</th>
                <th className="pb-2">Action</th>
                <th className="pb-2">Tokens ({tokenData.symbol})</th>
                <th className="pb-2">SOL Value</th>
                <th className="pb-2">Unit Price</th>
                <th className="pb-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {userTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/20">
                  <td className="py-2.5 text-slate-400 font-sans">{tx.date}</td>
                  <td className="py-2.5 font-sans font-bold">
                    {tx.type === "BUY" && <span className="text-emerald-400">DEX BUY</span>}
                    {tx.type === "SELL" && <span className="text-rose-400">DEX SELL</span>}
                    {tx.type === "CLAIM_YIELD" && <span className="text-cyan-400">STAKING YIELD</span>}
                  </td>
                  <td className="py-2.5 text-white font-semibold">
                    {tx.tokenAmount.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-slate-300">{tx.solAmount} SOL</td>
                  <td className="py-2.5 text-slate-400">${tx.priceUsd.toFixed(4)}</td>
                  <td className="py-2.5 text-right font-sans">
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
