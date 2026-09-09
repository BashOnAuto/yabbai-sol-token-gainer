import React, { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { RiseFarmingEngine } from "./components/RiseFarmingEngine";
import { SocialGrowthHub } from "./components/SocialGrowthHub";
import { PortfolioAnalytics } from "./components/PortfolioAnalytics";
import { PromptedWebsiteBuilder } from "./components/PromptedWebsiteBuilder";
import { WithdrawSolView } from "./components/WithdrawSolView";
import { SolanaNetworkStatsBar } from "./components/SolanaNetworkStatsBar";
import { RealCashDeFiHub } from "./components/RealCashDeFiHub";
import { LiquidityPoolRemovalModal } from "./components/LiquidityPoolRemovalModal";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { WalletModal } from "./components/WalletModal";
import { CustomTokenModal } from "./components/CustomTokenModal";
import { 
  PRESET_TOKENS, 
  INITIAL_FARMING_CONFIG, 
  INITIAL_TRANSACTIONS, 
  INITIAL_SOCIAL_CAMPAIGN, 
  INITIAL_WEBSITE_COPY 
} from "./data/defaultToken";
import { TokenData, RiseFarmingConfig, FarmingTransaction, SocialCampaignData, WebsiteCopy, PortfolioPosition } from "./types";

export default function App() {
  const [activeTab, setActiveTab] = useState<"farming" | "cash" | "social" | "portfolio" | "website" | "withdraw">(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        hash.includes("withdraw") || 
        hash.includes("send") || 
        path.includes("withdraw") || 
        path.includes("send") || 
        search.includes("withdraw")
      ) {
        return "withdraw";
      }
      if (hash.includes("cash") || hash.includes("defi") || search.includes("cash")) {
        return "cash";
      }
    }
    return "farming";
  });
  const [tokenData, setTokenData] = useState<TokenData>(PRESET_TOKENS[0]);
  const [farmingConfig, setFarmingConfig] = useState<RiseFarmingConfig>(INITIAL_FARMING_CONFIG);
  const [transactions, setTransactions] = useState<FarmingTransaction[]>(INITIAL_TRANSACTIONS);
  const [campaignData, setCampaignData] = useState<SocialCampaignData>(INITIAL_SOCIAL_CAMPAIGN);
  const [websiteCopy, setWebsiteCopy] = useState<WebsiteCopy>(INITIAL_WEBSITE_COPY);

  // User simulated Solana wallet & portfolio
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(true);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isCustomTokenModalOpen, setIsCustomTokenModalOpen] = useState<boolean>(false);
  const [isLpRemovalModalOpen, setIsLpRemovalModalOpen] = useState<boolean>(false);

  const [portfolio, setPortfolio] = useState<PortfolioPosition>({
    tokenBalance: 185000,
    stakedLpBalance: 24500,
    averageBuyPrice: 0.0392,
    currentValueUsd: 185000 * 0.0482,
    unrealizedPnlUsd: 185000 * (0.0482 - 0.0392),
    unrealizedPnlPercent: ((0.0482 - 0.0392) / 0.0392) * 100,
    pendingYieldRewards: 3240,
    solWalletBalance: 34.8,
    phantomWalletAddress: "HTN1fvHwbzKiMwh9YXZEe3eooiMdoCAs3TweWdiSZV5i",
    phantomWalletBalance: 0.0576,
  });

  // Fetch real on-chain balance from Solana Mainnet RPC for Phantom wallet
  useEffect(() => {
    const fetchOnChainBalance = async () => {
      try {
        const address = portfolio.phantomWalletAddress || "HTN1fvHwbzKiMwh9YXZEe3eooiMdoCAs3TweWdiSZV5i";
        const res = await fetch(`/api/solana/wallet/${address}`);
        if (res.ok) {
          const data = await res.json();
          if (typeof data.solBalance === "number") {
            setPortfolio((prev) => ({
              ...prev,
              phantomWalletBalance: data.solBalance,
            }));
          }
        }
      } catch (err) {
        console.warn("Could not query Solana RPC balance:", err);
      }
    };

    fetchOnChainBalance();
    const interval = setInterval(fetchOnChainBalance, 15000);
    return () => clearInterval(interval);
  }, [portfolio.phantomWalletAddress]);

  useEffect(() => {
    const handleLocation = () => {
      const hash = window.location.hash.toLowerCase();
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        hash.includes("withdraw") || 
        hash.includes("send") || 
        path.includes("withdraw") || 
        path.includes("send") || 
        search.includes("withdraw")
      ) {
        setActiveTab("withdraw");
      }
    };

    window.addEventListener("hashchange", handleLocation);
    window.addEventListener("popstate", handleLocation);
    return () => {
      window.removeEventListener("hashchange", handleLocation);
      window.removeEventListener("popstate", handleLocation);
    };
  }, []);

  const handleTabChange = (tab: "farming" | "social" | "portfolio" | "website" | "withdraw") => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      if (tab === "withdraw") {
        window.history.replaceState(null, "", "#withdraw");
      } else if (window.location.hash === "#withdraw") {
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Header with Navigation & Live Solana Ticker */}
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        tokenData={tokenData}
        setTokenData={setTokenData}
        farmingConfig={farmingConfig}
        portfolio={portfolio}
        isWalletConnected={isWalletConnected}
        setIsWalletModalOpen={setIsWalletModalOpen}
        onOpenCustomTokenModal={() => setIsCustomTokenModalOpen(true)}
        onOpenLiquidityRemoval={() => setIsLpRemovalModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Real Solana Network Statistics Telemetry Bar */}
        <SolanaNetworkStatsBar />

        {activeTab === "farming" && (
          <RiseFarmingEngine
            tokenData={tokenData}
            setTokenData={setTokenData}
            farmingConfig={farmingConfig}
            setFarmingConfig={setFarmingConfig}
            transactions={transactions}
            setTransactions={setTransactions}
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            onNavigateToWithdraw={() => handleTabChange("withdraw")}
            onOpenLiquidityRemoval={() => setIsLpRemovalModalOpen(true)}
          />
        )}

        {activeTab === "cash" && (
          <RealCashDeFiHub
            tokenData={tokenData}
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            onOpenLiquidityRemoval={() => setIsLpRemovalModalOpen(true)}
          />
        )}

        {activeTab === "social" && (
          <SocialGrowthHub
            tokenData={tokenData}
            campaignData={campaignData}
            setCampaignData={setCampaignData}
          />
        )}

        {activeTab === "portfolio" && (
          <PortfolioAnalytics
            tokenData={tokenData}
            portfolio={portfolio}
            setPortfolio={setPortfolio}
            onOpenLiquidityRemoval={() => setIsLpRemovalModalOpen(true)}
          />
        )}

        {activeTab === "website" && (
          <PromptedWebsiteBuilder
            tokenData={tokenData}
            farmingConfig={farmingConfig}
            websiteCopy={websiteCopy}
            setWebsiteCopy={setWebsiteCopy}
          />
        )}

        {activeTab === "withdraw" && (
          <ErrorBoundary fallbackTitle="Unable to load Solana Withdrawal Portal">
            <WithdrawSolView
              portfolio={portfolio}
              setPortfolio={setPortfolio}
              isWalletConnected={isWalletConnected}
              setIsWalletModalOpen={setIsWalletModalOpen}
              farmingConfig={farmingConfig}
              setFarmingConfig={setFarmingConfig}
              setTransactions={setTransactions}
              tokenData={tokenData}
            />
          </ErrorBoundary>
        )}
      </main>

      {/* Persistent Floating Quick Withdraw Button (Visible if not already on withdraw tab) */}
      {activeTab !== "withdraw" && (
        <div className="fixed bottom-16 md:bottom-6 right-6 z-40 flex items-center gap-2">
          <button
            id="floating-lp-removal-btn"
            onClick={() => setIsLpRemovalModalOpen(true)}
            className="flex items-center gap-1.5 rounded-full bg-cyan-950/90 hover:bg-cyan-900 text-cyan-300 font-bold text-xs px-4 py-3 shadow-xl border border-cyan-500/40 backdrop-blur transition"
          >
            <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
            <span>REMOVE POOL LP</span>
          </button>

          <button
            id="floating-glowing-green-withdraw-btn"
            onClick={() => handleTabChange("withdraw")}
            className="flex items-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs px-5 py-3 shadow-2xl shadow-emerald-500/50 border border-emerald-300 animate-pulse hover:animate-none hover:scale-105 transition"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-slate-950"></span>
            <span>SEND / WITHDRAW SOL</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <LiquidityPoolRemovalModal
        isOpen={isLpRemovalModalOpen}
        onClose={() => setIsLpRemovalModalOpen(false)}
        portfolio={portfolio}
        setPortfolio={setPortfolio}
        setTransactions={setTransactions}
        tokenData={tokenData}
      />

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        isWalletConnected={isWalletConnected}
        setIsWalletConnected={setIsWalletConnected}
        portfolio={portfolio}
        setPortfolio={setPortfolio}
      />

      <CustomTokenModal
        isOpen={isCustomTokenModalOpen}
        onClose={() => setIsCustomTokenModalOpen(false)}
        onSaveToken={(customToken) => {
          setTokenData(customToken);
          setPortfolio((prev) => ({
            ...prev,
            currentValueUsd: prev.tokenBalance * customToken.priceUsd,
            averageBuyPrice: customToken.priceUsd * 0.85,
            unrealizedPnlUsd: prev.tokenBalance * (customToken.priceUsd * 0.15),
          }));
        }}
      />
    </div>
  );
}
