import React from "react";
import { 
  Zap, 
  TrendingUp, 
  Flame, 
  ShieldCheck, 
  Wallet, 
  ChevronDown, 
  Share2, 
  ExternalLink,
  Activity,
  Layers,
  Sparkles,
  Send,
  ArrowUpRight,
  Coins
} from "lucide-react";
import { TokenData, RiseFarmingConfig, PortfolioPosition } from "../types";
import { PRESET_TOKENS } from "../data/defaultToken";

interface HeaderProps {
  activeTab: "farming" | "cash" | "social" | "portfolio" | "website" | "withdraw";
  setActiveTab: (tab: "farming" | "cash" | "social" | "portfolio" | "website" | "withdraw") => void;
  tokenData: TokenData;
  setTokenData: (token: TokenData) => void;
  farmingConfig: RiseFarmingConfig;
  portfolio: PortfolioPosition;
  isWalletConnected: boolean;
  setIsWalletModalOpen: (open: boolean) => void;
  onOpenCustomTokenModal: () => void;
  onOpenLiquidityRemoval?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  tokenData,
  setTokenData,
  farmingConfig,
  portfolio,
  isWalletConnected,
  setIsWalletModalOpen,
  onOpenCustomTokenModal,
}) => {
  const [tokenDropdownOpen, setTokenDropdownOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      {/* Top Ticker Bar */}
      <div className="flex h-9 items-center justify-between border-b border-slate-800/40 bg-slate-900/60 px-4 text-xs font-medium text-slate-400">
        <div className="flex items-center space-x-4 overflow-x-auto py-1 scrollbar-none">
          <div className="flex items-center space-x-1.5 text-slate-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">SOL/USD:</span>
            <span className="text-emerald-400">$184.60</span>
            <span className="text-emerald-500 font-mono text-[11px]">(+4.8%)</span>
          </div>

          <div className="h-3 w-px bg-slate-800"></div>

          <div className="flex items-center space-x-1.5">
            <span className="text-slate-400">Target Token:</span>
            <span className="font-bold text-white tracking-wide">{tokenData.symbol}</span>
            <span className="font-mono text-emerald-400">${tokenData.priceUsd.toFixed(4)}</span>
            <span className="text-emerald-400 font-medium">+{tokenData.priceChange24h}%</span>
          </div>

          <div className="h-3 w-px bg-slate-800"></div>

          <div className="flex items-center space-x-1.5">
            <Zap className={`h-3 w-3 ${farmingConfig.isActive ? "text-emerald-400 animate-bounce" : "text-slate-500"}`} />
            <span>Rise Engine:</span>
            <span className={`font-semibold ${farmingConfig.isActive ? "text-emerald-400" : "text-amber-400"}`}>
              {farmingConfig.isActive ? `ACTIVE (${farmingConfig.frequencySeconds}s Micro-Buys)` : "PAUSED"}
            </span>
          </div>

          <div className="h-3 w-px bg-slate-800"></div>

          <div className="hidden sm:flex items-center space-x-1.5">
            <Flame className="h-3 w-3 text-amber-400" />
            <span>Burned Float:</span>
            <span className="font-mono text-slate-200">{(tokenData.burnedTokens / 1000000).toFixed(2)}M {tokenData.symbol}</span>
          </div>

          <div className="h-3 w-px bg-slate-800"></div>

          <div className="hidden md:flex items-center space-x-1.5">
            <TrendingUp className="h-3 w-3 text-cyan-400" />
            <span>DexScreener:</span>
            <span className="rounded bg-emerald-950/80 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-800/50">
              #{tokenData.dexScreenerRank} Trending Solana
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center space-x-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
            Solana Mainnet Fast RPC (320ms)
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">TPS: 2,840</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Token Switcher */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 shadow-lg shadow-emerald-950/40 border border-emerald-400/30 text-slate-950">
              <Zap className="h-5 w-5 fill-current text-slate-950 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-tight text-white sm:text-lg">
                  SOLANA <span className="text-emerald-400">ASCENT</span>
                </span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">On-Chain Rise Farming & Growth Engine</p>
            </div>
          </div>

          {/* Token Selector Dropdown */}
          <div className="relative">
            <button
              id="token-selector-dropdown-btn"
              onClick={() => setTokenDropdownOpen(!tokenDropdownOpen)}
              className="flex items-center space-x-2 rounded-lg border border-slate-700/80 bg-slate-900/80 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:border-slate-600 hover:bg-slate-850 transition"
            >
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              <span>{tokenData.symbol}</span>
              <span className="text-slate-400 font-normal">({tokenData.name})</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {tokenDropdownOpen && (
              <div className="absolute left-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50">
                <div className="px-2 py-1 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                  Select Solana Token
                </div>
                {PRESET_TOKENS.map((token) => (
                  <button
                    key={token.symbol}
                    onClick={() => {
                      setTokenData(token);
                      setTokenDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition ${
                      token.symbol === tokenData.symbol
                        ? "bg-emerald-500/10 text-emerald-300 font-bold border border-emerald-500/30"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-white">{token.symbol}</div>
                      <div className="text-[10px] text-slate-400">{token.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-emerald-400">${token.priceUsd.toFixed(4)}</div>
                      <div className="text-[10px] text-emerald-500">+{token.priceChange24h}%</div>
                    </div>
                  </button>
                ))}
                <div className="mt-1 border-t border-slate-800 pt-1">
                  <button
                    onClick={() => {
                      setTokenDropdownOpen(false);
                      onOpenCustomTokenModal();
                    }}
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-center text-xs font-medium text-cyan-400 hover:bg-cyan-500/10 transition"
                  >
                    <Sparkles className="h-3 w-3" />
                    + Enter Custom Mint Address
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800/80">
          <button
            id="nav-tab-farming"
            onClick={() => setActiveTab("farming")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "farming"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span>Rise Farming Engine</span>
          </button>

          <button
            id="nav-tab-cash"
            onClick={() => setActiveTab("cash")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "cash"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Coins className="h-3.5 w-3.5" />
            <span>Make Cash (DeFi)</span>
          </button>

          <button
            id="nav-tab-portfolio"
            onClick={() => setActiveTab("portfolio")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "portfolio"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Portfolio & Analytics</span>
          </button>

          <button
            id="nav-tab-social"
            onClick={() => setActiveTab("social")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "social"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Social Blitz</span>
          </button>

          <button
            id="nav-tab-website"
            onClick={() => setActiveTab("website")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "website"
                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Investor Portal</span>
          </button>

          <button
            id="nav-tab-withdraw"
            onClick={() => setActiveTab("withdraw")}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              activeTab === "withdraw"
                ? "bg-emerald-400 text-slate-950 shadow-md shadow-emerald-400/30 font-bold"
                : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-950/40"
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>Withdraw SOL</span>
          </button>
        </nav>

        {/* Action Controls & Wallet Button */}
        <div className="flex items-center space-x-2.5">
          {/* Glowing Green Withdraw / Send SOL Button */}
          <button
            id="glowing-withdraw-green-btn"
            onClick={() => setActiveTab("withdraw")}
            className={`relative flex items-center space-x-1.5 rounded-xl px-3.5 py-2 text-xs font-black transition shadow-lg ${
              activeTab === "withdraw"
                ? "bg-emerald-400 text-slate-950 ring-2 ring-emerald-300 shadow-emerald-400/50"
                : "bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 shadow-emerald-500/40 animate-pulse hover:animate-none hover:scale-105"
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>WITHDRAW SOL</span>
          </button>

          <button
            id="connect-solana-wallet-btn"
            onClick={() => setIsWalletModalOpen(true)}
            className="flex items-center space-x-2 rounded-lg border border-purple-500/40 bg-gradient-to-r from-purple-950/40 to-slate-900 px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:border-purple-400 hover:text-white transition shadow-sm"
          >
            <span className="text-sm">👻</span>
            {isWalletConnected ? (
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                <span className="font-mono text-purple-300 font-semibold">
                  {(portfolio.phantomWalletAddress || "HTN1fvHwbzKiMwh9YXZEe3eooiMdoCAs3TweWdiSZV5i").slice(0, 4)}...{(portfolio.phantomWalletAddress || "HTN1fvHwbzKiMwh9YXZEe3eooiMdoCAs3TweWdiSZV5i").slice(-4)}
                </span>
                <span className="text-emerald-400 font-mono text-[11px] font-bold">
                  ({portfolio.phantomWalletBalance.toFixed(2)} SOL)
                </span>
              </span>
            ) : (
              <span className="font-semibold text-purple-200">Connect Phantom</span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex md:hidden border-t border-slate-800 bg-slate-900/95 px-2 py-1.5 justify-around text-xs">
        <button
          onClick={() => setActiveTab("farming")}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            activeTab === "farming" ? "text-emerald-400 font-bold" : "text-slate-400"
          }`}
        >
          <Zap className="h-4 w-4" />
          <span className="text-[10px] mt-0.5">Rise Engine</span>
        </button>

        <button
          onClick={() => setActiveTab("cash")}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            activeTab === "cash" ? "text-emerald-400 font-bold" : "text-slate-400"
          }`}
        >
          <Coins className="h-4 w-4" />
          <span className="text-[10px] mt-0.5">DeFi Cash</span>
        </button>

        <button
          onClick={() => setActiveTab("portfolio")}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            activeTab === "portfolio" ? "text-emerald-400 font-bold" : "text-slate-400"
          }`}
        >
          <Activity className="h-4 w-4" />
          <span className="text-[10px] mt-0.5">Portfolio</span>
        </button>

        <button
          onClick={() => setActiveTab("website")}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            activeTab === "website" ? "text-emerald-400 font-bold" : "text-slate-400"
          }`}
        >
          <Layers className="h-4 w-4" />
          <span className="text-[10px] mt-0.5">Investor Web</span>
        </button>

        <button
          id="mobile-nav-withdraw-btn"
          onClick={() => setActiveTab("withdraw")}
          className={`flex flex-col items-center py-1 px-2 rounded-lg ${
            activeTab === "withdraw" ? "text-emerald-400 font-bold" : "text-emerald-500 font-medium"
          }`}
        >
          <Send className="h-4 w-4 text-emerald-400" />
          <span className="text-[10px] mt-0.5">Withdraw</span>
        </button>
      </div>
    </header>
  );
};
