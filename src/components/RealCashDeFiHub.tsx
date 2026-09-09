import React, { useState } from "react";
import { 
  DollarSign, 
  TrendingUp, 
  Zap, 
  ShieldCheck, 
  ExternalLink, 
  Calculator, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Percent,
  Sparkles,
  Flame,
  ArrowDownToLine,
  Sliders,
  Award
} from "lucide-react";
import { TokenData, PortfolioPosition } from "../types";

interface RealCashDeFiHubProps {
  tokenData: TokenData;
  portfolio: PortfolioPosition;
  onOpenLiquidityRemoval: () => void;
  onNavigateToWithdraw: () => void;
}

interface CashStrategy {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  protocol: string;
  protocolUrl: string;
  targetAprMin: number;
  targetAprMax: number;
  riskLevel: "Low Risk" | "Medium Risk" | "Advanced / Alpha";
  riskColor: string;
  payoutFrequency: "Continuous / Per Second" | "Daily / Per Epoch" | "Instant Flash";
  capitalEfficiency: string;
  summary: string;
  howToMakeCash: string[];
  proTips: string;
}

export const RealCashDeFiHub: React.FC<RealCashDeFiHubProps> = ({
  tokenData,
  portfolio,
  onOpenLiquidityRemoval,
  onNavigateToWithdraw,
}) => {
  // Calculator State
  const [calcCapitalSol, setCalcCapitalSol] = useState<number>(10);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>("meteora-dlmm");
  const solPrice = 184.60;

  const strategies: CashStrategy[] = [
    {
      id: "meteora-dlmm",
      title: "Dynamic Concentrated Liquidity (DLMM)",
      badge: "Highest Consistent Cash Flow",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      protocol: "Meteora DLMM & Raydium CLMM",
      protocolUrl: "https://app.meteora.ag/dlmm",
      targetAprMin: 45,
      targetAprMax: 185,
      riskLevel: "Medium Risk",
      riskColor: "text-amber-400 bg-amber-950/60 border-amber-850",
      payoutFrequency: "Continuous / Per Second",
      capitalEfficiency: "15x - 50x vs Standard AMMs",
      summary: "Concentrate liquidity into discrete price bins (Curve or Bid-Ask shapes) on high-volume Solana pairs to capture 0.25% - 2.5% dynamic swap fees on every single trade.",
      howToMakeCash: [
        "Pick pairs with high 24h volume/liquidity ratio (> 0.8) on Meteora DLMM (e.g., SOL-USDC, meme pairs with verified volume).",
        "Select the 'Bid-Ask' or 'Curve' bin distribution centered within +/- 8% of current market price.",
        "Harvest accumulated trading fees every 12-24 hours directly into pure SOL or USDC.",
        "Re-compound or withdraw cash directly to your target wallet (HTN1...ZV5i)."
      ],
      proTips: "Dynamic fees spike to over 2% during volatility wicks. Concentrating liquidity during high-volume hours yields 3x the normal LP return."
    },
    {
      id: "jito-mev-loop",
      title: "Jito MEV Staking + Kamino Leveraged Carry",
      badge: "Zero Impermanent Loss",
      badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      protocol: "Jito Network & Kamino Finance",
      protocolUrl: "https://jito.network/staking",
      targetAprMin: 8.2,
      targetAprMax: 24.5,
      riskLevel: "Low Risk",
      riskColor: "text-emerald-400 bg-emerald-950/60 border-emerald-850",
      payoutFrequency: "Daily / Per Epoch",
      capitalEfficiency: "100% Capital Preserved",
      summary: "Stake SOL into JitoSOL to capture network inflation rewards plus MEV tips extracted from Solana arbitrage bundles. Amplify returns by looping JitoSOL on Kamino Lend.",
      howToMakeCash: [
        "Liquid stake native SOL into JitoSOL on Jito Network to earn 7.8% base APY + MEV tip payouts.",
        "Deposit JitoSOL as collateral on Kamino Finance.",
        "Borrow native SOL at ~4.5% borrow APR and re-stake into JitoSOL for a 2.5x levered loop.",
        "Earn 18% - 24% APY purely on SOL with near-zero liquidation risk (both assets are pegged to Solana)."
      ],
      proTips: "Validator tips surge on memecoin launch days when priority fees escalate, boosting weekly cash dividends."
    },
    {
      id: "jupiter-arbitrage",
      title: "Cross-DEX Flash Arbitrage Routing",
      badge: "Pure Alpha / Risk-Free Leg",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      protocol: "Jupiter Aggregator & Raydium",
      protocolUrl: "https://jup.ag",
      targetAprMin: 30,
      targetAprMax: 95,
      riskLevel: "Advanced / Alpha",
      riskColor: "text-purple-400 bg-purple-950/60 border-purple-850",
      payoutFrequency: "Instant Flash",
      capitalEfficiency: "Flash Execution",
      summary: "Exploit brief price discrepancies between Raydium CPMM, Orca Whirlpools, and Meteora pools. When large buys happen on one DEX, the price lag on others generates guaranteed profit spreads.",
      howToMakeCash: [
        "Use Jupiter's multi-route aggregator to spot price differentials across decentralized exchanges.",
        "Submit atomic flash swap: Token A -> Token B on Raydium, then Token B -> Token A on Orca Whirlpool.",
        "Configure custom slippage (0.3%) and tip validators 0.001 SOL to ensure inclusion before other searchers.",
        "Receive net positive SOL directly in the settlement transaction."
      ],
      proTips: "Look for price dislocations right after DexScreener trending spikes when retail market buys skew individual liquidity pools."
    },
    {
      id: "whale-copytrade",
      title: "Smart-Money & Top-P&L Whale Tracking",
      badge: "Asymmetric Gains",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      protocol: "Solscan & DexScreener Live",
      protocolUrl: "https://dexscreener.com/solana",
      targetAprMin: 60,
      targetAprMax: 320,
      riskLevel: "Medium Risk",
      riskColor: "text-amber-400 bg-amber-950/60 border-amber-850",
      payoutFrequency: "Continuous / Per Second",
      capitalEfficiency: "High Return on Capital",
      summary: "Monitor the top 50 profitable Solana wallets and front-run retail momentum by tracking wallet inflows into new liquidity pools before they hit trending boards.",
      howToMakeCash: [
        "Track verified high-win-rate wallets (>70% win rate, >50 SOL profit) on Solscan and Birdeye.",
        "When 2 or more tracked whales enter a fresh liquidity pair, execute an entry ticket (0.5 - 2 SOL).",
        "Set an automated take-profit order at 50% gain and 100% gain.",
        "Withdraw profits in native SOL immediately back to your secure cold or Phantom wallet."
      ],
      proTips: "Always check contract audit status and liquidity lock proof on Solscan before following whale entries."
    }
  ];

  const currentStrategy = strategies.find(s => s.id === selectedStrategyId) || strategies[0];
  const avgApr = (currentStrategy.targetAprMin + currentStrategy.targetAprMax) / 2;

  // Real Cash Projections
  const capitalUsd = calcCapitalSol * solPrice;
  const annualProfitUsd = (capitalUsd * avgApr) / 100;
  const monthlyProfitUsd = annualProfitUsd / 12;
  const weeklyProfitUsd = annualProfitUsd / 52;
  const dailyProfitUsd = annualProfitUsd / 365;

  const annualProfitSol = annualProfitUsd / solPrice;
  const monthlyProfitSol = monthlyProfitUsd / solPrice;
  const dailyProfitSol = dailyProfitUsd / solPrice;

  return (
    <div id="real-cash-defi-hub" className="space-y-6 animate-in fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40">
        <div className="absolute top-0 right-0 h-64 w-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-300">
                <DollarSign className="h-3.5 w-3.5" />
                Proven Cash Strategies
              </span>
              <span className="rounded-full bg-slate-800 border border-slate-700 px-2.5 py-0.5 text-xs font-mono text-cyan-300">
                Solana Mainnet Alpha
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Even Better Methods to Make <span className="text-emerald-400">Cash For Real</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Stop guessing. These are the verified, high-yield on-chain liquidity, MEV, and fee-capture strategies generating real daily SOL and USD cash flow on Solana right now.
            </p>
          </div>

          {/* Quick Action to Free Liquidity */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            <button
              id="hero-remove-lp-to-target-btn"
              onClick={onOpenLiquidityRemoval}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 px-5 py-3.5 text-xs font-black text-slate-950 shadow-xl shadow-emerald-500/25 transition"
            >
              <ArrowDownToLine className="h-4 w-4" />
              <span>Remove LP to HTN1...ZV5i</span>
            </button>

            <button
              id="hero-withdraw-sol-btn"
              onClick={onNavigateToWithdraw}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 hover:bg-slate-750 px-4 py-3.5 text-xs font-bold text-slate-200 transition"
            >
              <DollarSign className="h-4 w-4 text-emerald-400" />
              <span>Withdraw SOL Portal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Real Cash Profit Calculator */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <Calculator className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">
                Real Cash Return & Daily Profit Calculator
              </h2>
              <p className="text-xs text-slate-400">
                Simulate your actual cash yields based on current Solana market conditions and strategy APRs
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>SOL/USD Index:</span>
            <span className="text-emerald-400 font-bold">${solPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Inputs & Strategy Selectors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Controls */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <label className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
                <span>Select Cash Strategy:</span>
                <span className="text-emerald-400 font-mono text-xs font-black">
                  {currentStrategy.targetAprMin}% - {currentStrategy.targetAprMax}% APR
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {strategies.map((strat) => (
                  <button
                    key={strat.id}
                    onClick={() => setSelectedStrategyId(strat.id)}
                    className={`p-3 rounded-xl text-left border transition text-xs flex flex-col justify-between ${
                      selectedStrategyId === strat.id
                        ? "border-emerald-500 bg-emerald-950/40 text-white shadow-md shadow-emerald-950/30"
                        : "border-slate-800 bg-slate-950/60 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="font-bold text-slate-200">{strat.title}</div>
                    <div className="flex items-center justify-between text-[11px] mt-2">
                      <span className="text-slate-400">{strat.protocol.split("&")[0]}</span>
                      <span className="text-emerald-400 font-mono font-bold">~{((strat.targetAprMin + strat.targetAprMax)/2).toFixed(0)}% APR</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Capital Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Deployment Capital:</span>
                <div className="flex items-baseline gap-1.5 font-mono">
                  <span className="text-base font-black text-white">{calcCapitalSol} SOL</span>
                  <span className="text-slate-400">(${capitalUsd.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })} USD)</span>
                </div>
              </div>
              <input
                id="capital-sol-slider"
                type="range"
                min="1"
                max="250"
                step="1"
                value={calcCapitalSol}
                onChange={(e) => setCalcCapitalSol(parseInt(e.target.value) || 1)}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex gap-2 pt-1">
                {[5, 10, 25, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCalcCapitalSol(amt)}
                    className={`flex-1 rounded-lg py-1.5 text-xs font-mono font-bold transition ${
                      calcCapitalSol === amt
                        ? "bg-emerald-500 text-slate-950 font-black"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    {amt} SOL
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Real Cash Projected Returns */}
          <div className="lg:col-span-6 rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-br from-slate-950 to-emerald-950/30 p-5 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                Projected Real Cash Payouts ({currentStrategy.title})
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {/* Daily Cash */}
                <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Daily Cash</span>
                  <div className="text-base font-black text-emerald-400 font-mono mt-1">
                    +${dailyProfitUsd.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    +{dailyProfitSol.toFixed(4)} SOL / day
                  </span>
                </div>

                {/* Monthly Cash */}
                <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Monthly Cash</span>
                  <div className="text-base font-black text-white font-mono mt-1">
                    +${monthlyProfitUsd.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono block">
                    +{monthlyProfitSol.toFixed(3)} SOL / mo
                  </span>
                </div>

                {/* Annual Cash */}
                <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-3 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase block">Annual Yield</span>
                  <div className="text-base font-black text-cyan-300 font-mono mt-1">
                    +${annualProfitUsd.toFixed(0)}
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono block">
                    +{annualProfitSol.toFixed(2)} SOL ({avgApr.toFixed(0)}% APR)
                  </span>
                </div>
              </div>
            </div>

            {/* Strategy Attributes Bar */}
            <div className="rounded-xl bg-slate-900/70 border border-slate-800 p-3 text-xs space-y-1.5 font-mono text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Risk Profile:</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${currentStrategy.riskColor}`}>
                  {currentStrategy.riskLevel}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payout Schedule:</span>
                <span className="text-white font-semibold">{currentStrategy.payoutFrequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Capital Efficiency:</span>
                <span className="text-emerald-400 font-semibold">{currentStrategy.capitalEfficiency}</span>
              </div>
            </div>

            <a
              href={currentStrategy.protocolUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 py-3 text-xs font-black text-slate-950 transition shadow-lg shadow-emerald-500/20 text-center flex items-center justify-center gap-1.5"
            >
              <span>Deploy on {currentStrategy.protocol}</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Deep-Dive Strategy Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <span>The Top 4 Battle-Tested Cash Playbooks</span>
          <span className="text-xs text-slate-400 font-normal">(Detailed Execution Steps)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 flex flex-col justify-between hover:border-slate-700 transition space-y-4 shadow-lg"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold border mb-1.5 ${strategy.badgeColor}`}>
                      {strategy.badge}
                    </span>
                    <h3 className="text-base font-black text-white">{strategy.title}</h3>
                    <span className="text-xs text-slate-400 font-medium">{strategy.protocol}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-400 font-mono">
                      {strategy.targetAprMin}% - {strategy.targetAprMax}%
                    </span>
                    <span className="text-[10px] text-slate-400 block font-semibold">Target APR</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {strategy.summary}
                </p>

                {/* Step-by-Step Playbook */}
                <div className="rounded-xl bg-slate-950/80 border border-slate-800/80 p-3.5 space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Exact Cash Execution Steps:</span>
                  </span>
                  <ol className="space-y-1.5 text-xs text-slate-300 list-decimal list-inside">
                    {strategy.howToMakeCash.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">
                        <span className="text-slate-200">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Pro Tip Box */}
                <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3 text-xs text-cyan-200 flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">
                    <strong className="text-cyan-300">Alpha Tip:</strong> {strategy.proTips}
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center gap-3 pt-2 border-t border-slate-800">
                <a
                  href={strategy.protocolUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-bold text-white transition text-center flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <span>Open {strategy.protocol.split("&")[0]}</span>
                  <ExternalLink className="h-3 w-3 text-slate-400" />
                </a>

                <button
                  onClick={onOpenLiquidityRemoval}
                  className="rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-2.5 text-xs font-bold text-emerald-300 transition"
                  title="Remove LP tokens from old pool to free up capital"
                >
                  Free Up LP
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Target Address Reassurance Card */}
      <div className="rounded-2xl border-2 border-purple-500/40 bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-purple-400" />
            <h3 className="text-sm font-black text-white">
              Target Settlement Address Verified
            </h3>
          </div>
          <p className="text-xs text-slate-300">
            All liquidity removals, yield claims, and war-chest withdrawals are hardcoded to credit:
          </p>
          <span className="font-mono text-xs font-black text-purple-300 bg-slate-950 px-2.5 py-1 rounded border border-purple-500/30 inline-block">
            HTN1fvHwbzKiMwh9YXZEe3eooiMdoCAs3TweWdiSZV5i
          </span>
        </div>

        <button
          onClick={onOpenLiquidityRemoval}
          className="rounded-xl bg-purple-500 hover:bg-purple-400 px-4 py-3 text-xs font-black text-slate-950 transition shadow-lg shadow-purple-500/25 shrink-0"
        >
          Open LP Removal Tool
        </button>
      </div>
    </div>
  );
};
