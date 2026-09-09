import React, { useState } from "react";
import { 
  Layers, 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  ShieldCheck, 
  Flame, 
  Zap, 
  TrendingUp, 
  ArrowUpRight, 
  CheckCircle2, 
  HelpCircle,
  Eye,
  Maximize2,
  Minimize2,
  Share2
} from "lucide-react";
import { TokenData, WebsiteCopy, RiseFarmingConfig } from "../types";

interface PromptedWebsiteBuilderProps {
  tokenData: TokenData;
  farmingConfig: RiseFarmingConfig;
  websiteCopy: WebsiteCopy;
  setWebsiteCopy: React.Dispatch<React.SetStateAction<WebsiteCopy>>;
}

export const PromptedWebsiteBuilder: React.FC<PromptedWebsiteBuilderProps> = ({
  tokenData,
  farmingConfig,
  websiteCopy,
  setWebsiteCopy,
}) => {
  const [promptInput, setPromptInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMint, setCopiedMint] = useState(false);
  const [isFullscreenPreview, setIsFullscreenPreview] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://ascent.solana.io/#/${tokenData.symbol.toLowerCase().replace('$', '')}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyMint = () => {
    navigator.clipboard.writeText(tokenData.mintAddress);
    setCopiedMint(true);
    setTimeout(() => setCopiedMint(false), 2500);
  };

  const handleGenerateWebsite = async (customPrompt?: string) => {
    setIsGenerating(true);
    const mission = customPrompt || promptInput || "Algorithmic Rise Farming, perpetual buyback vault, and community staking dominance on Solana.";

    try {
      const response = await fetch("/api/ai/landing-page-copy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenName: tokenData.name,
          tokenSymbol: tokenData.symbol,
          mission: mission,
          features: [
            "Algorithmic Micro-Volume Rise Farming",
            "Deflationary Buyback & Burn Vault",
            `${farmingConfig.farmingApr}% LP Staking APR`,
            "Raydium & Meteora Multi-DEX Routing"
          ],
        }),
      });

      const data = await response.json();
      if (data && data.heroTitle) {
        setWebsiteCopy(data);
      }
    } catch (err) {
      console.error("Failed to generate website copy:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control / Prompting Section */}
      {!isFullscreenPreview && (
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/30 p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Layers className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Prompt-Driven Investor Web Portal & Public Showcase
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Interactive Investor Website Generator
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
                Generate prompt-crafted, user-friendly token landing pages with live tokenomics, DEX swap integration, and verified trust credentials for prospective investors.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="copy-investor-portal-link-btn"
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition"
              >
                {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{copiedLink ? "Link Copied!" : "Copy Investor Link"}</span>
              </button>

              <button
                id="toggle-fullscreen-preview-btn"
                onClick={() => setIsFullscreenPreview(true)}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3.5 py-2 text-xs font-bold text-slate-950 transition shadow-md shadow-emerald-500/20"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Fullscreen Outlook</span>
              </button>
            </div>
          </div>

          {/* Prompt Generator Box */}
          <div className="mt-5 rounded-xl border border-slate-800/80 bg-slate-950/70 p-4">
            <span className="text-xs font-semibold text-slate-300 block mb-2">
              Customize Website Narrative Prompt (AI Generator):
            </span>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="E.g., Emphasize institutional trust, our deflationary burn vault, and high staking yield on Solana..."
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
              />
              <button
                id="generate-website-copy-btn"
                onClick={() => handleGenerateWebsite()}
                disabled={isGenerating}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 px-5 py-2.5 text-xs font-bold text-slate-950 transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 fill-current" />}
                <span>{isGenerating ? "Prompting Copy..." : "Generate Landing Copy"}</span>
              </button>
            </div>

            {/* Quick Prompt Presets */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="text-[11px] text-slate-500 font-medium">Quick Presets:</span>
              <button
                onClick={() => {
                  const p = "Institutional-grade Solana liquidity standard with multi-pool algorithmic floor support.";
                  setPromptInput(p);
                  handleGenerateWebsite(p);
                }}
                className="rounded-lg bg-slate-900 hover:bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 border border-slate-800 hover:border-slate-700 transition"
              >
                🏛 Institutional DeFi
              </button>
              <button
                onClick={() => {
                  const p = "High-energy meme virality and massive community raid culture backed by real rise farming.";
                  setPromptInput(p);
                  handleGenerateWebsite(p);
                }}
                className="rounded-lg bg-slate-900 hover:bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 border border-slate-800 hover:border-slate-700 transition"
              >
                🚀 Community Viral Blitz
              </button>
              <button
                onClick={() => {
                  const p = "Ultra-deflationary supply destruction with daily automated buybacks and permanent burn.";
                  setPromptInput(p);
                  handleGenerateWebsite(p);
                }}
                className="rounded-lg bg-slate-900 hover:bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 border border-slate-800 hover:border-slate-700 transition"
              >
                🔥 Deflationary Vault Focus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fullscreen Bar (when fullscreen preview is active) */}
      {isFullscreenPreview && (
        <div className="sticky top-12 z-30 flex items-center justify-between rounded-xl bg-slate-900/90 border border-slate-800 p-3 shadow-lg">
          <div className="flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            <span className="text-white font-bold">Public Investor Outlook Mode</span>
            <span className="text-slate-400 text-[11px]">Previewing user-friendly live landing portal</span>
          </div>
          <button
            onClick={() => setIsFullscreenPreview(false)}
            className="flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition"
          >
            <Minimize2 className="h-3.5 w-3.5" />
            <span>Exit Fullscreen</span>
          </button>
        </div>
      )}

      {/* Live Interactive Investor Portal Preview */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
        {/* Mock Browser Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/80 px-4 py-2.5 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80"></span>
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></span>
            </div>
            <span className="text-[11px] text-slate-500 ml-2 font-mono">
              https://{tokenData.symbol.toLowerCase().replace('$', '')}.solana.io/portal
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
              Verified SPL Token
            </span>
          </div>
        </div>

        {/* Website Landing Content Container */}
        <div className="p-6 sm:p-10 lg:p-14 space-y-12">
          {/* Website Hero Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-bold text-emerald-300">
              <Zap className="h-3.5 w-3.5" />
              <span>Rise Farming Engine Active on Solana Mainnet</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {websiteCopy.heroTitle}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {websiteCopy.heroSubtitle}
            </p>

            {/* Live Price Pill & Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2 font-mono text-sm">
                <span className="text-slate-400">Live Price:</span>
                <span className="font-bold text-white">${tokenData.priceUsd.toFixed(4)}</span>
                <span className="text-emerald-400 font-semibold">(+{tokenData.priceChange24h}%)</span>
              </div>

              <a
                href={`https://dexscreener.com/solana/${tokenData.mintAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/20 transition flex items-center gap-1.5"
              >
                <span>Buy on Raydium DEX</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <a
                href={`https://dexscreener.com/solana/${tokenData.mintAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5"
              >
                <span>DexScreener Chart</span>
                <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
              </a>
            </div>

            {/* Mint Address Verification Bar */}
            <div className="pt-3 max-w-md mx-auto">
              <div className="flex items-center justify-between rounded-xl bg-slate-900/90 border border-slate-800 px-3 py-1.5 text-xs">
                <span className="text-slate-400 font-medium">Mint Address:</span>
                <span className="font-mono text-slate-300 text-[11px] truncate max-w-[200px]">
                  {tokenData.mintAddress}
                </span>
                <button
                  onClick={handleCopyMint}
                  className="rounded p-1 text-slate-400 hover:text-white"
                  title="Copy Mint Address"
                >
                  {copiedMint ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Key Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {websiteCopy.stats?.map((stat, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center">
                <span className="text-xs text-slate-400 block mb-1">{stat.label}</span>
                <span className="text-lg sm:text-xl font-black text-white font-mono">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Value Propositions Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {websiteCopy.valueProps?.map((prop, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                    {idx === 0 && <Zap className="h-5 w-5" />}
                    {idx === 1 && <Flame className="h-5 w-5 text-amber-400" />}
                    {idx === 2 && <ShieldCheck className="h-5 w-5 text-cyan-400" />}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{prop.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{prop.description}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Audited SPL Mechanism</span>
                </div>
              </div>
            ))}
          </div>

          {/* Tokenomics & Supply Contraction Visualizer */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white">Transparent Solana Tokenomics</h3>
                <p className="text-xs text-slate-400">Zero mint authority, permanently locked LP, and active burn sweeps.</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Total Fixed Supply:</span>
                <div className="font-mono text-base font-bold text-white">
                  {(tokenData.totalSupply / 1000000).toFixed(0)}M {tokenData.symbol}
                </div>
              </div>
            </div>

            {/* Visual Multi-segment Distribution Bar */}
            <div className="space-y-2">
              <div className="w-full bg-slate-800 h-4 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full w-[65%]" title="Circulating Float & Dex Liquidity (65%)"></div>
                <div className="bg-cyan-500 h-full w-[25%]" title="Rise Farming & Staking Vault (25%)"></div>
                <div className="bg-amber-500 h-full w-[10%]" title="Burned Supply (10%)"></div>
              </div>
              <div className="flex flex-wrap justify-between text-xs text-slate-300 pt-2">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  Circulating & Liquidity: <span className="font-bold text-white font-mono">65%</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-500"></span>
                  Rise Farming Staking Vault: <span className="font-bold text-white font-mono">25%</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                  Burned to Incinerator: <span className="font-bold text-amber-400 font-mono">10%</span>
                </span>
              </div>
            </div>
          </div>

          {/* Interactive FAQ Accordion */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base sm:text-lg font-bold text-white">Investor Frequently Asked Questions</h3>
            </div>

            <div className="divide-y divide-slate-800">
              {websiteCopy.faq?.map((item, idx) => (
                <div key={idx} className="py-3.5">
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="flex w-full items-center justify-between text-left text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition"
                  >
                    <span>{item.question}</span>
                    <span className="text-emerald-400 font-bold ml-2">
                      {activeFaq === idx ? "−" : "+"}
                    </span>
                  </button>
                  {activeFaq === idx && (
                    <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {item.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Investor Footer */}
          <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div>
              © 2026 {tokenData.name} ({tokenData.symbol}). All rights reserved on Solana Mainnet.
            </div>
            <div className="flex items-center space-x-4 text-slate-400">
              <a href="https://solscan.io" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">
                SolScan
              </a>
              <a href="https://raydium.io" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">
                Raydium
              </a>
              <a href="https://dexscreener.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">
                DexScreener
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400">
                Twitter / X
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
