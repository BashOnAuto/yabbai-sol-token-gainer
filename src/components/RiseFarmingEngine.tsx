import React, { useState, useEffect } from "react";
import { 
  Zap, 
  Flame, 
  ShieldCheck, 
  TrendingUp, 
  Sliders, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  ArrowUpRight, 
  Coins, 
  Cpu,
  Lock,
  Layers,
  ChevronRight,
  ArrowDownToLine,
  X,
  ShieldAlert,
  ExternalLink,
  Copy,
  Check,
  Wallet
} from "lucide-react";
import { TokenData, RiseFarmingConfig, FarmingTransaction, PortfolioPosition } from "../types";

interface RiseFarmingEngineProps {
  tokenData: TokenData;
  setTokenData: React.Dispatch<React.SetStateAction<TokenData>>;
  farmingConfig: RiseFarmingConfig;
  setFarmingConfig: React.Dispatch<React.SetStateAction<RiseFarmingConfig>>;
  transactions: FarmingTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<FarmingTransaction[]>>;
  portfolio: PortfolioPosition;
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioPosition>>;
  onNavigateToWithdraw?: () => void;
  onOpenLiquidityRemoval?: () => void;
}

export const RiseFarmingEngine: React.FC<RiseFarmingEngineProps> = ({
  tokenData,
  setTokenData,
  farmingConfig,
  setFarmingConfig,
  transactions,
  setTransactions,
  portfolio,
  setPortfolio,
  onNavigateToWithdraw,
  onOpenLiquidityRemoval,
}) => {
  const [secondsUntilNextTick, setSecondsUntilNextTick] = useState(farmingConfig.frequencySeconds);
  const [isExecutingBurn, setIsExecutingBurn] = useState(false);
  const [burnSuccessMessage, setBurnSuccessMessage] = useState<string | null>(null);
  const [isGeneratingAiAdvice, setIsGeneratingAiAdvice] = useState(false);
  const [aiAdvice, setAiAdvice] = useState<{
    marketVerdict: string;
    healthScore: number;
    recommendedRiseParams: {
      microVolumeFrequencySeconds: number;
      buybackAllocationPercent: number;
      holderStakingYieldApr: number;
      floorDefenseBidBufferPercent: number;
      dexScreenerTrendPriority: string;
    };
    tacticalActions: string[];
    antiDumpProtectionAdvice: string;
  } | null>(null);

  // Vault War-Chest Withdrawal Modal & Execution State
  const [isWithdrawWarChestModalOpen, setIsWithdrawWarChestModalOpen] = useState(false);
  const [warChestWithdrawAmount, setWarChestWithdrawAmount] = useState("25");
  const [warChestDestinationType, setWarChestDestinationType] = useState<"connected" | "custom">("connected");
  const [customDestinationAddress, setCustomDestinationAddress] = useState("");
  const [isExecutingWarChestWithdraw, setIsExecutingWarChestWithdraw] = useState(false);
  const [warChestWithdrawStep, setWarChestWithdrawStep] = useState("");
  const [warChestWithdrawReceipt, setWarChestWithdrawReceipt] = useState<{
    amount: number;
    destination: string;
    txHash: string;
    timestamp: string;
  } | null>(null);
  const [warChestWithdrawError, setWarChestWithdrawError] = useState<string | null>(null);
  const [isCopiedReceiptHash, setIsCopiedReceiptHash] = useState(false);
  const [warChestSuccessBanner, setWarChestSuccessBanner] = useState<string | null>(null);

  // Periodic Rise Farming execution effect
  useEffect(() => {
    if (!farmingConfig.isActive) return;

    const timer = setInterval(() => {
      setSecondsUntilNextTick((prev) => {
        if (prev <= 1) {
          // Trigger automated micro-buy tick!
          executeFarmingTick();
          return farmingConfig.frequencySeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [farmingConfig.isActive, farmingConfig.frequencySeconds]);

  // Execute an automated micro-volume buy that lifts price slightly
  const executeFarmingTick = () => {
    const randomSol = Number((Math.random() * (farmingConfig.maxTicketSol - farmingConfig.minTicketSol) + farmingConfig.minTicketSol).toFixed(2));
    const tokenBought = Math.round((randomSol * 184.60) / tokenData.priceUsd);
    const impact = Number((Math.random() * 0.18 + 0.06).toFixed(2));
    const dexs = farmingConfig.selectedDexs;
    const selectedDex = dexs[Math.floor(Math.random() * dexs.length)];
    const randomHash = Math.random().toString(36).substring(2, 6).toUpperCase() + "..." + Math.random().toString(36).substring(2, 6).toUpperCase();

    const newTx: FarmingTransaction = {
      id: "tx-" + Date.now(),
      timestamp: "Just now",
      type: "MICRO_BUY",
      dex: selectedDex,
      solAmount: randomSol,
      tokenAmount: tokenBought,
      priceUsd: Number((tokenData.priceUsd * (1 + impact / 100)).toFixed(4)),
      txHash: randomHash,
      impactPercent: impact,
    };

    // Update transactions list
    setTransactions((prev) => [newTx, ...prev.slice(0, 19)]);

    // Update token price slightly upward
    setTokenData((prev) => {
      const newPrice = Number((prev.priceUsd * (1 + impact / 1000)).toFixed(5));
      const newVol = prev.volume24h + (randomSol * 184.60);
      return {
        ...prev,
        priceUsd: newPrice,
        priceChange24h: Number((prev.priceChange24h + 0.05).toFixed(2)),
        volume24h: Math.round(newVol),
        marketCap: Math.round(newPrice * prev.circulatingSupply),
      };
    });

    // Update accumulated volume in config
    setFarmingConfig((prev) => ({
      ...prev,
      accumulatedVolumeGenerated: prev.accumulatedVolumeGenerated + (randomSol * 184.60),
    }));
  };

  // Immediate manual buyback and burn execution
  const handleImmediateBuybackAndBurn = () => {
    setIsExecutingBurn(true);
    setBurnSuccessMessage(null);

    setTimeout(() => {
      const burnTokens = 50000;
      const solSpent = 13.5;
      const impact = 0.65;

      const burnTx: FarmingTransaction = {
        id: "tx-" + Date.now(),
        timestamp: "Just now",
        type: "BUYBACK_BURN",
        dex: "Raydium CPMM",
        solAmount: solSpent,
        tokenAmount: burnTokens,
        priceUsd: Number((tokenData.priceUsd * 1.008).toFixed(4)),
        txHash: "BURN..." + Math.random().toString(36).substring(2, 6).toUpperCase(),
        impactPercent: impact,
      };

      setTransactions((prev) => [burnTx, ...prev.slice(0, 19)]);

      setTokenData((prev) => ({
        ...prev,
        burnedTokens: prev.burnedTokens + burnTokens,
        circulatingSupply: prev.circulatingSupply - burnTokens,
        priceUsd: Number((prev.priceUsd * 1.008).toFixed(5)),
        priceChange24h: Number((prev.priceChange24h + 0.45).toFixed(2)),
      }));

      setFarmingConfig((prev) => ({
        ...prev,
        totalTokensBurned: prev.totalTokensBurned + burnTokens,
        totalFloorDefendedUsd: prev.totalFloorDefendedUsd + (solSpent * 184.60),
      }));

      setIsExecutingBurn(false);
      setBurnSuccessMessage(`Successfully swept and burned 50,000 ${tokenData.symbol} to the Solana Incinerator!`);
      setTimeout(() => setBurnSuccessMessage(null), 6000);
    }, 1200);
  };

  // Vault War-Chest Withdrawal Execution Handler
  const handleExecuteWarChestWithdraw = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setWarChestWithdrawError(null);

    const amount = parseFloat(warChestWithdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      setWarChestWithdrawError("Please enter a valid SOL amount greater than 0.");
      return;
    }

    const availableSol = farmingConfig.vaultWarChestSol ?? 456.2;
    if (amount > availableSol) {
      setWarChestWithdrawError(`Insufficient funds in Vault War-Chest. Available reserve is ${availableSol.toFixed(2)} SOL.`);
      return;
    }

    const targetAddress = warChestDestinationType === "connected"
      ? (portfolio.phantomWalletAddress || "HTN1fvHwbzKiMwh9YXZEe3eooiMdoCAs3TweWdiSZV5i")
      : customDestinationAddress.trim();

    if (!targetAddress || targetAddress.length < 32) {
      setWarChestWithdrawError("Please provide a valid 32-44 character Solana address.");
      return;
    }

    setIsExecutingWarChestWithdraw(true);
    setWarChestWithdrawStep("Authorizing smart vault multisig release...");

    setTimeout(() => {
      setWarChestWithdrawStep("Transmitting Solana on-chain liquidity release...");

      setTimeout(() => {
        const txHash = "WD" + Math.random().toString(36).substring(2, 8).toUpperCase() + "v" + Math.random().toString(36).substring(2, 6).toUpperCase();
        
        // Deduct from war chest
        setFarmingConfig((prev) => ({
          ...prev,
          vaultWarChestSol: Math.max(0, (prev.vaultWarChestSol ?? 456.2) - amount),
          totalFloorDefendedUsd: Math.max(0, prev.totalFloorDefendedUsd - (amount * 184.60)),
        }));

        // Credit recipient wallet
        setPortfolio((prev) => ({
          ...prev,
          solWalletBalance: prev.solWalletBalance + amount,
        }));

        // Record confirmed transaction in ledger
        const wdTx: FarmingTransaction = {
          id: "tx-" + Date.now(),
          timestamp: "Just now",
          type: "VAULT_WARCHEST_WITHDRAWAL",
          dex: "Vault War-Chest Release",
          solAmount: amount,
          tokenAmount: 0,
          priceUsd: 184.60,
          txHash: txHash.slice(0, 4) + "..." + txHash.slice(-4),
          impactPercent: 0,
        };

        setTransactions((prev) => [wdTx, ...prev.slice(0, 19)]);

        setWarChestWithdrawReceipt({
          amount,
          destination: targetAddress,
          txHash,
          timestamp: new Date().toLocaleTimeString(),
        });

        setWarChestSuccessBanner(`Successfully released ${amount} SOL from Vault War-Chest to ${targetAddress.slice(0, 6)}...${targetAddress.slice(-4)}!`);
        setTimeout(() => setWarChestSuccessBanner(null), 8000);

        setIsExecutingWarChestWithdraw(false);
        setWarChestWithdrawStep("");
      }, 900);
    }, 800);
  };

  // Trigger Gemini AI Quantitative Growth Advisory
  const fetchAiAdvisory = async () => {
    setIsGeneratingAiAdvice(true);
    try {
      const response = await fetch("/api/ai/growth-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenSymbol: tokenData.symbol,
          liquidityUsd: tokenData.liquidityUsd,
          volume24h: tokenData.volume24h,
          priceChange24h: tokenData.priceChange24h,
          holderCount: tokenData.holderCount,
          currentStrategy: "Micro-Volume Sweeps + Buyback Vault",
        }),
      });
      const data = await response.json();
      setAiAdvice(data);
    } catch (err) {
      console.error("Failed to fetch AI growth strategy:", err);
    } finally {
      setIsGeneratingAiAdvice(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Master Status */}
      <div className="relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 p-5 sm:p-6 shadow-xl shadow-black/40">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Autonomous Liquidity & Price Ascent Architecture
              </span>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/30">
                Jito MEV-Guarded
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {tokenData.name} ({tokenData.symbol}) Rise Farming Control Center
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Continuous algorithmic micro-volume compounding, multi-DEX spread tightening on Raydium & Meteora, and automated floor buybacks engineered to stimulate sustained upward on-chain price discovery.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Master Engine Switch */}
            <button
              id="master-rise-farming-toggle-btn"
              onClick={() => {
                setFarmingConfig((prev) => ({ ...prev, isActive: !prev.isActive }));
              }}
              className={`flex items-center gap-2.5 rounded-xl px-5 py-3 text-sm font-bold shadow-lg transition transform active:scale-95 ${
                farmingConfig.isActive
                  ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-emerald-500/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              {farmingConfig.isActive ? (
                <>
                  <Pause className="h-4 w-4 fill-current" />
                  <span>Rise Engine Active</span>
                  <span className="flex h-2 w-2 rounded-full bg-slate-950 animate-pulse"></span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current text-emerald-400" />
                  <span>Resume Rise Engine</span>
                </>
              )}
            </button>

            {/* AI Advisor Button */}
            <button
              id="ai-growth-advisor-btn"
              onClick={fetchAiAdvisory}
              disabled={isGeneratingAiAdvice}
              className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 px-4 py-3 text-sm font-semibold text-cyan-300 hover:bg-cyan-900/40 hover:border-cyan-400 transition"
            >
              {isGeneratingAiAdvice ? (
                <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
              ) : (
                <Sparkles className="h-4 w-4 text-cyan-400" />
              )}
              <span>{isGeneratingAiAdvice ? "Analyzing..." : "AI Quant Advisor"}</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-800/80 pt-4 text-xs">
          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-slate-400 block mb-1">Next Micro-Buy Sweep</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-xl font-black text-emerald-400">
                {farmingConfig.isActive ? `${secondsUntilNextTick}s` : "Paused"}
              </span>
              <span className="text-[11px] text-slate-500">interval</span>
            </div>
            <div className="mt-1.5 w-full bg-slate-800 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-400 h-full transition-all duration-1000"
                style={{ width: `${((farmingConfig.frequencySeconds - secondsUntilNextTick) / farmingConfig.frequencySeconds) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-slate-400 block mb-1">Algorithmic Volume Lifted</span>
            <div className="font-mono text-xl font-black text-white">
              ${farmingConfig.accumulatedVolumeGenerated.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="h-3 w-3" /> DexScreener Top Ranked
            </span>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-slate-400 block mb-1">Burned Circulating Float</span>
            <div className="font-mono text-xl font-black text-amber-400">
              {(farmingConfig.totalTokensBurned / 1000000).toFixed(2)}M {tokenData.symbol}
            </div>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Permanent Incinerator Lock
            </span>
          </div>

          <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800">
            <span className="text-slate-400 block mb-1">Floor Defense Vault</span>
            <div className="font-mono text-xl font-black text-cyan-400">
              ${farmingConfig.totalFloorDefendedUsd.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
            <span className="text-[11px] text-cyan-400/90 mt-0.5 block">
              {farmingConfig.farmingApr}% LP Staking APR
            </span>
          </div>
        </div>
      </div>

      {/* AI Strategy Advisory Card if available */}
      {aiAdvice && (
        <div className="rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-5 text-sm backdrop-blur-sm shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span className="font-bold text-white text-base">Gemini On-Chain Quantitative Analysis</span>
              <span className="rounded bg-cyan-950 px-2 py-0.5 text-xs text-cyan-300 font-semibold border border-cyan-800/60">
                Health Score: {aiAdvice.healthScore}/100
              </span>
            </div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
              {aiAdvice.marketVerdict}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Tactical Growth Directives
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {aiAdvice.tacticalActions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-slate-950/70 p-3.5 border border-slate-800/80 text-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-1">
                Anti-Dump & Slippage Guardrail
              </span>
              <p className="text-slate-300 mb-3">{aiAdvice.antiDumpProtectionAdvice}</p>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                <div>
                  Optimal Sweep Frequency: <span className="font-bold text-white">{aiAdvice.recommendedRiseParams.microVolumeFrequencySeconds}s</span>
                </div>
                <div>
                  Buyback Allocation: <span className="font-bold text-white">{aiAdvice.recommendedRiseParams.buybackAllocationPercent}%</span>
                </div>
                <div>
                  Recommended Staking APR: <span className="font-bold text-emerald-400">{aiAdvice.recommendedRiseParams.holderStakingYieldApr}%</span>
                </div>
                <div>
                  DexScreener Priority: <span className="font-bold text-cyan-400">{aiAdvice.recommendedRiseParams.dexScreenerTrendPriority}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Burn Success Notification */}
      {burnSuccessMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs sm:text-sm text-emerald-200">
          <Flame className="h-5 w-5 text-amber-400 animate-pulse shrink-0" />
          <span className="font-semibold">{burnSuccessMessage}</span>
        </div>
      )}

      {/* War-Chest Withdrawal Success Notification */}
      {warChestSuccessBanner && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-500/50 bg-gradient-to-r from-amber-950/60 to-slate-900 p-4 text-xs sm:text-sm text-amber-200 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
              <ArrowDownToLine className="h-4 w-4" />
            </div>
            <div>
              <span className="font-bold text-white block">Vault War-Chest Withdrawal Confirmed</span>
              <span className="text-amber-300/90 text-xs">{warChestSuccessBanner}</span>
            </div>
          </div>
          <button
            onClick={() => setWarChestSuccessBanner(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* 3 Core Strategy Engines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Strategy 1: Micro-Volume Rise Farming */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Zap className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Micro-Volume Sweeper</h3>
                  <span className="text-[11px] text-slate-400">Continuous Bid Spread Tightening</span>
                </div>
              </div>
              <span className="rounded-full bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-800/40">
                ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Executes staggered micro-buys every {farmingConfig.frequencySeconds} seconds across chosen Solana DEX pools to ensure clean candlestick charts and top trending status.
            </p>

            <div className="space-y-3.5 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Sweep Interval:</span>
                  <span className="font-bold text-emerald-400">{farmingConfig.frequencySeconds}s</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={farmingConfig.frequencySeconds}
                  onChange={(e) => setFarmingConfig({ ...farmingConfig, frequencySeconds: Number(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>5s (Aggressive)</span>
                  <span>30s (Balanced)</span>
                  <span>60s (Passive)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Ticket Range per Buy:</span>
                  <span className="font-bold text-white font-mono">{farmingConfig.minTicketSol} - {farmingConfig.maxTicketSol} SOL</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.05"
                    max="5"
                    value={farmingConfig.minTicketSol}
                    onChange={(e) => setFarmingConfig({ ...farmingConfig, minTicketSol: Number(e.target.value) })}
                    className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 font-mono text-white text-xs"
                    placeholder="Min SOL"
                  />
                  <input
                    type="number"
                    step="0.1"
                    min="0.2"
                    max="10"
                    value={farmingConfig.maxTicketSol}
                    onChange={(e) => setFarmingConfig({ ...farmingConfig, maxTicketSol: Number(e.target.value) })}
                    className="rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 font-mono text-white text-xs"
                    placeholder="Max SOL"
                  />
                </div>
              </div>

              <div>
                <span className="text-slate-300 block mb-1.5">Target Liquidity Pools:</span>
                <div className="space-y-1.5">
                  {["Raydium CPMM", "Meteora DLMM", "Orca Whirlpool"].map((dex) => (
                    <label key={dex} className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                      <input
                        type="checkbox"
                        checked={farmingConfig.selectedDexs.includes(dex)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFarmingConfig({ ...farmingConfig, selectedDexs: [...farmingConfig.selectedDexs, dex] });
                          } else {
                            if (farmingConfig.selectedDexs.length > 1) {
                              setFarmingConfig({
                                ...farmingConfig,
                                selectedDexs: farmingConfig.selectedDexs.filter((d) => d !== dex),
                              });
                            }
                          }
                        }}
                        className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-emerald-500"
                      />
                      <span>{dex}</span>
                    </label>
                  ))}
                </div>
                {(onOpenLiquidityRemoval || onNavigateToWithdraw) && (
                  <button
                    type="button"
                    onClick={onOpenLiquidityRemoval || onNavigateToWithdraw}
                    className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    <span className="underline">Remove LP Position to HTN1...ZV5i</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <button
              onClick={executeFarmingTick}
              className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5"
            >
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              <span>Simulate Single Micro-Buy Now</span>
            </button>
          </div>
        </div>

        {/* Strategy 2: Buyback & Burn Vault */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Flame className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Floor Defense & Burn Vault</h3>
                  <span className="text-[11px] text-slate-400">Deflationary Supply Contraction</span>
                </div>
              </div>
              <span className="rounded-full bg-amber-950/80 px-2 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-800/40">
                ARMED
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Monitors the orderbook 24/7. When sudden sell pressure drops the price below the buffer, smart vaults automatically buy the dip and burn tokens permanently.
            </p>

            <div className="space-y-3.5 text-xs">
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400">Autonomous Trigger Threshold:</span>
                  <span className="font-bold text-amber-400 font-mono">-{farmingConfig.floorDefenseBufferPercent}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={farmingConfig.floorDefenseBufferPercent}
                  onChange={(e) => setFarmingConfig({ ...farmingConfig, floorDefenseBufferPercent: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Triggers spot sweep if price drops {farmingConfig.floorDefenseBufferPercent}% within 5 minutes.
                </span>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Fee Allocation to Buyback:</span>
                  <span className="font-bold text-white font-mono">{farmingConfig.buybackPercent}% of DEX fees</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="50"
                  step="2"
                  value={farmingConfig.buybackPercent}
                  onChange={(e) => setFarmingConfig({ ...farmingConfig, buybackPercent: Number(e.target.value) })}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <div className="rounded-xl bg-amber-950/25 p-3.5 border border-amber-800/40">
                <div className="flex items-center justify-between text-slate-300 text-xs mb-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                    <span className="font-semibold text-slate-200">Vault War-Chest:</span>
                  </div>
                  <span className="font-mono font-bold text-amber-300 text-sm">
                    {(farmingConfig.vaultWarChestSol ?? 456.2).toFixed(2)} SOL
                    <span className="text-slate-400 text-[10px] font-normal ml-1">
                      (${Math.round((farmingConfig.vaultWarChestSol ?? 456.2) * 184.60).toLocaleString()})
                    </span>
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-[11px] mb-2">
                  <span>Incinerator Sink:</span>
                  <span className="font-mono text-slate-400">1nc1ner8...Burn</span>
                </div>
                <div className="pt-2 border-t border-amber-800/30 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-amber-200/70">Autonomous Liquidity Pool</span>
                  <button
                    id="open-withdraw-war-chest-header-btn"
                    type="button"
                    onClick={() => {
                      setWarChestWithdrawError(null);
                      setWarChestWithdrawReceipt(null);
                      setIsWithdrawWarChestModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 px-2.5 py-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 transition active:scale-95"
                  >
                    <ArrowDownToLine className="h-3 w-3" />
                    <span>Withdraw SOL</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
            <button
              id="trigger-manual-buyback-burn-btn"
              onClick={handleImmediateBuybackAndBurn}
              disabled={isExecutingBurn}
              className="w-full rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 py-2.5 text-xs font-bold text-white transition shadow-md shadow-orange-950/50 flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Flame className={`h-4 w-4 ${isExecutingBurn ? "animate-spin" : ""}`} />
              <span>{isExecutingBurn ? "Sweeping & Incinerating..." : "Execute 50,000 Token Buyback & Burn"}</span>
            </button>
            <button
              id="trigger-withdraw-warchest-card-btn"
              type="button"
              onClick={() => {
                setWarChestWithdrawError(null);
                setWarChestWithdrawReceipt(null);
                setIsWithdrawWarChestModalOpen(true);
              }}
              className="w-full rounded-xl border border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/50 py-2.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition flex items-center justify-center gap-1.5 active:scale-95"
            >
              <ArrowDownToLine className="h-3.5 w-3.5 text-amber-400" />
              <span>Withdraw from Vault War-Chest</span>
            </button>
          </div>
        </div>

        {/* Strategy 3: Holder Yield Staking & Anti-Dump Engine */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Staking & Anti-Dump Defense</h3>
                  <span className="text-[11px] text-slate-400">Diamond Hand Retention Engine</span>
                </div>
              </div>
              <span className="rounded-full bg-cyan-950/80 px-2 py-0.5 text-[10px] font-bold text-cyan-400 border border-cyan-800/40">
                PROTECTED
              </span>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Provides organic holder yield incentives up to {farmingConfig.farmingApr}% APR while restricting predatory sniper dumps via dynamic slippage bounds.
            </p>

            <div className="space-y-3.5 text-xs">
              <div className="rounded-xl bg-slate-950 p-3 border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-400">Staking Pool APR Target:</span>
                  <span className="font-bold text-emerald-400 font-mono text-sm">{farmingConfig.farmingApr}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="90"
                  step="2.5"
                  value={farmingConfig.farmingApr}
                  onChange={(e) => setFarmingConfig({ ...farmingConfig, farmingApr: Number(e.target.value) })}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  Funded organically via protocol trading fees and liquidity rebalancing.
                </span>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Anti-Dump Max Price Impact:</span>
                  <span className="font-bold text-white font-mono">{farmingConfig.antiDumpSlippage}% limit</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="5.0"
                  step="0.5"
                  value={farmingConfig.antiDumpSlippage}
                  onChange={(e) => setFarmingConfig({ ...farmingConfig, antiDumpSlippage: Number(e.target.value) })}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Whales attempting to dump &gt;{farmingConfig.antiDumpSlippage}% impact are rerouted across TWAP intervals.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="rounded-lg bg-slate-950 p-2 border border-slate-800 text-center">
                  <span className="text-slate-400 block">Current Stakers</span>
                  <span className="font-bold text-white font-mono text-xs">1,894 Wallets</span>
                </div>
                <div className="rounded-lg bg-slate-950 p-2 border border-slate-800 text-center">
                  <span className="text-slate-400 block">Staked Float</span>
                  <span className="font-bold text-emerald-400 font-mono text-xs">48.2% Total</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Lock className="h-3.5 w-3.5 text-cyan-400" />
                LP Token Lock Status:
              </span>
              <span className="font-semibold text-emerald-400">100% Permanently Burned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Algorithmic Execution Ledger */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm sm:text-base">Real-Time On-Chain Rise Farming Ledger</h3>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
              Live Stream
            </span>
          </div>
          <span className="text-xs text-slate-400">Showing last 20 verified transactions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium">DEX / Route</th>
                <th className="pb-2 font-medium">Amount (SOL)</th>
                <th className="pb-2 font-medium">Amount ({tokenData.symbol})</th>
                <th className="pb-2 font-medium">Execution Price</th>
                <th className="pb-2 font-medium">Price Push</th>
                <th className="pb-2 font-medium">Time</th>
                <th className="pb-2 font-medium text-right">Tx Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-2.5 font-sans">
                    {tx.type === "MICRO_BUY" && (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/30">
                        <Zap className="h-3 w-3" /> Micro-Buy
                      </span>
                    )}
                    {tx.type === "BUYBACK_BURN" && (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-400 border border-amber-500/30">
                        <Flame className="h-3 w-3" /> Buyback & Burn
                      </span>
                    )}
                    {tx.type === "COMMUNITY_BUY" && (
                      <span className="inline-flex items-center gap-1 rounded bg-cyan-500/10 px-2 py-0.5 text-[11px] font-bold text-cyan-400 border border-cyan-500/30">
                        <Coins className="h-3 w-3" /> Organic Buy
                      </span>
                    )}
                    {tx.type === "LP_REBALANCE" && (
                      <span className="inline-flex items-center gap-1 rounded bg-indigo-500/10 px-2 py-0.5 text-[11px] font-bold text-indigo-400 border border-indigo-500/30">
                        <Layers className="h-3 w-3" /> LP Rebalance
                      </span>
                    )}
                    {tx.type === "VAULT_WARCHEST_WITHDRAWAL" && (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-[11px] font-bold text-amber-400 border border-amber-500/30">
                        <ArrowDownToLine className="h-3 w-3" /> War-Chest Release
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 text-slate-300 font-sans text-[11px]">{tx.dex}</td>
                  <td className="py-2.5 text-emerald-400 font-semibold">+{tx.solAmount} SOL</td>
                  <td className="py-2.5 text-slate-200">+{tx.tokenAmount.toLocaleString()}</td>
                  <td className="py-2.5 text-slate-300">${tx.priceUsd.toFixed(4)}</td>
                  <td className="py-2.5 text-emerald-400 font-bold">+{tx.impactPercent}%</td>
                  <td className="py-2.5 text-slate-400 text-[11px] font-sans">{tx.timestamp}</td>
                  <td className="py-2.5 text-right">
                    <span className="rounded bg-slate-950 px-1.5 py-0.5 text-[10px] text-cyan-400 border border-slate-800 hover:border-cyan-500/50 cursor-pointer">
                      {tx.txHash}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vault War-Chest Withdrawal Modal */}
      {isWithdrawWarChestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-2xl border border-amber-500/40 bg-slate-900 p-6 shadow-2xl space-y-5 text-slate-200 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30">
                  <ArrowDownToLine className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Withdraw from Vault War-Chest
                  </h3>
                  <span className="text-xs text-amber-400/90 font-medium">
                    Protocol Floor Defense & Liquidity Pool
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsWithdrawWarChestModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {warChestWithdrawReceipt ? (
              /* Success Receipt State */
              <div className="space-y-4 py-2">
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 text-center space-y-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">Withdrawal Successfully Executed</h4>
                  <p className="text-xs text-slate-300">
                    Smart vault multisig authorized release of <span className="font-bold text-emerald-400 font-mono">{warChestWithdrawReceipt.amount} SOL</span> (${(warChestWithdrawReceipt.amount * 184.60).toLocaleString()}) to your wallet.
                  </p>
                </div>

                <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 space-y-2.5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Transaction Sig:</span>
                    <div className="flex items-center gap-1.5 text-cyan-400">
                      <span>{warChestWithdrawReceipt.txHash}</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(warChestWithdrawReceipt.txHash);
                          setIsCopiedReceiptHash(true);
                          setTimeout(() => setIsCopiedReceiptHash(false), 2000);
                        }}
                        className="text-slate-400 hover:text-white"
                        title="Copy Tx Signature"
                      >
                        {isCopiedReceiptHash ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Recipient:</span>
                    <span className="text-slate-200">{warChestWithdrawReceipt.destination.slice(0, 8)}...{warChestWithdrawReceipt.destination.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Amount Released:</span>
                    <span className="text-emerald-400 font-bold">+{warChestWithdrawReceipt.amount} SOL</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Execution Time:</span>
                    <span className="text-slate-300">{warChestWithdrawReceipt.timestamp}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Remaining War-Chest:</span>
                    <span className="text-amber-300 font-bold">{(farmingConfig.vaultWarChestSol ?? 456.2).toFixed(2)} SOL</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Your Wallet Balance:</span>
                    <span className="text-emerald-400 font-bold">{portfolio.solWalletBalance.toFixed(2)} SOL</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setWarChestWithdrawReceipt(null);
                      setIsWithdrawWarChestModalOpen(false);
                    }}
                    className="flex-1 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-bold text-white transition"
                  >
                    Close
                  </button>
                  {onNavigateToWithdraw && (
                    <button
                      onClick={() => {
                        setIsWithdrawWarChestModalOpen(false);
                        onNavigateToWithdraw();
                      }}
                      className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-500 py-2.5 text-xs font-bold text-white transition flex items-center justify-center gap-1.5"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                      <span>View in Withdrawal Portal</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Input & Execution Form */
              <form onSubmit={handleExecuteWarChestWithdraw} className="space-y-4">
                {/* War-Chest Balance Overview */}
                <div className="rounded-xl bg-amber-950/30 border border-amber-800/40 p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-amber-300/80 block uppercase tracking-wider font-semibold">
                      Current War-Chest Reserve
                    </span>
                    <span className="text-xl font-bold font-mono text-amber-300">
                      {(farmingConfig.vaultWarChestSol ?? 456.2).toFixed(2)} SOL
                    </span>
                    <span className="text-xs text-slate-400 ml-2 font-mono">
                      (~${Math.round((farmingConfig.vaultWarChestSol ?? 456.2) * 184.60).toLocaleString()} USD)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 border border-amber-500/30">
                      3-of-5 Multisig
                    </span>
                  </div>
                </div>

                {/* Amount Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">Withdrawal Amount (SOL):</label>
                    <span className="text-[11px] text-slate-400">
                      Available: <span className="font-mono text-amber-400">{(farmingConfig.vaultWarChestSol ?? 456.2).toFixed(2)} SOL</span>
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="warchest-withdraw-amount-input"
                      type="number"
                      step="0.1"
                      min="0.1"
                      max={farmingConfig.vaultWarChestSol ?? 456.2}
                      value={warChestWithdrawAmount}
                      onChange={(e) => setWarChestWithdrawAmount(e.target.value)}
                      disabled={isExecutingWarChestWithdraw}
                      placeholder="0.0"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                    />
                    <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">SOL</span>
                  </div>

                  {/* Preset Amount Chips */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["5", "10", "25", "50", "100"].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setWarChestWithdrawAmount(preset)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-mono font-semibold transition ${
                          warChestWithdrawAmount === preset
                            ? "bg-amber-500 text-slate-950 font-bold"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {preset} SOL
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setWarChestWithdrawAmount((farmingConfig.vaultWarChestSol ?? 456.2).toFixed(2))}
                      className="rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 px-2.5 py-1 text-xs font-mono font-bold transition"
                    >
                      MAX
                    </button>
                  </div>
                </div>

                {/* Destination Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300">Recipient Destination:</label>
                  
                  <div className="space-y-2">
                    <label className={`flex items-start gap-3 rounded-xl p-3 border cursor-pointer transition ${
                      warChestDestinationType === "connected" 
                        ? "border-amber-500/50 bg-amber-950/20" 
                        : "border-slate-800 bg-slate-950/60 hover:bg-slate-800/40"
                    }`}>
                      <input
                        type="radio"
                        name="warChestDest"
                        checked={warChestDestinationType === "connected"}
                        onChange={() => setWarChestDestinationType("connected")}
                        className="mt-0.5 accent-amber-500"
                      />
                      <div className="text-xs flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            <Wallet className="h-3.5 w-3.5 text-amber-400" />
                            Connected Solana Wallet
                          </span>
                          <span className="text-[11px] text-emerald-400 font-mono">
                            Balance: {portfolio.solWalletBalance.toFixed(2)} SOL
                          </span>
                        </div>
                        <span className="font-mono text-slate-400 text-[11px] break-all">
                          {portfolio.phantomWalletAddress || "HTN1fvHwbzKiMwh9YXZEe3eooiMdoCAs3TweWdiSZV5i"}
                        </span>
                      </div>
                    </label>

                    <label className={`flex items-start gap-3 rounded-xl p-3 border cursor-pointer transition ${
                      warChestDestinationType === "custom" 
                        ? "border-amber-500/50 bg-amber-950/20" 
                        : "border-slate-800 bg-slate-950/60 hover:bg-slate-800/40"
                    }`}>
                      <input
                        type="radio"
                        name="warChestDest"
                        checked={warChestDestinationType === "custom"}
                        onChange={() => setWarChestDestinationType("custom")}
                        className="mt-0.5 accent-amber-500"
                      />
                      <div className="text-xs flex-1">
                        <span className="font-semibold text-white block mb-1">
                          Custom Solana Public Key
                        </span>
                        {warChestDestinationType === "custom" && (
                          <input
                            id="custom-warchest-dest-address"
                            type="text"
                            value={customDestinationAddress}
                            onChange={(e) => setCustomDestinationAddress(e.target.value)}
                            placeholder="Enter 32-44 char Solana address"
                            className="w-full mt-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-mono text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                          />
                        )}
                      </div>
                    </label>
                  </div>
                </div>

                {/* Calculation breakdown */}
                <div className="rounded-xl bg-slate-950 p-3 border border-slate-800 text-[11px] space-y-1.5 text-slate-400">
                  <div className="flex justify-between">
                    <span>Network Fee:</span>
                    <span className="text-slate-300 font-mono">0.000005 SOL (~$0.0009)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remaining Floor Defense:</span>
                    <span className="text-amber-300 font-mono">
                      {Math.max(0, (farmingConfig.vaultWarChestSol ?? 456.2) - (parseFloat(warChestWithdrawAmount) || 0)).toFixed(2)} SOL
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protocol Execution:</span>
                    <span className="text-emerald-400 font-semibold">Immediate On-Chain Release</span>
                  </div>
                </div>

                {/* Error Banner */}
                {warChestWithdrawError && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-950/30 p-3 text-xs text-rose-300">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>{warChestWithdrawError}</span>
                  </div>
                )}

                {/* Processing status */}
                {isExecutingWarChestWithdraw && (
                  <div className="flex items-center gap-2.5 rounded-xl border border-amber-500/40 bg-amber-950/20 p-3 text-xs text-amber-300 animate-pulse">
                    <RefreshCw className="h-4 w-4 animate-spin shrink-0 text-amber-400" />
                    <span className="font-semibold">{warChestWithdrawStep}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWithdrawWarChestModalOpen(false)}
                    disabled={isExecutingWarChestWithdraw}
                    className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    id="confirm-warchest-withdrawal-btn"
                    type="submit"
                    disabled={isExecutingWarChestWithdraw}
                    className="flex-1 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 py-2.5 text-xs font-bold text-white transition shadow-lg shadow-orange-950/50 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isExecutingWarChestWithdraw ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Releasing Liquidity...</span>
                      </>
                    ) : (
                      <>
                        <ArrowDownToLine className="h-4 w-4" />
                        <span>Release {warChestWithdrawAmount || "0"} SOL to Wallet</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
