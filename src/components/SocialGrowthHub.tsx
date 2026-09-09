import React, { useState } from "react";
import { 
  Share2, 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  MessageSquare, 
  Video, 
  Radio, 
  Megaphone, 
  RefreshCw, 
  ArrowUpRight, 
  Flame, 
  ExternalLink,
  Target,
  Users,
  Award
} from "lucide-react";
import { TokenData, SocialCampaignData } from "../types";

interface SocialGrowthHubProps {
  tokenData: TokenData;
  campaignData: SocialCampaignData;
  setCampaignData: React.Dispatch<React.SetStateAction<SocialCampaignData>>;
}

export const SocialGrowthHub: React.FC<SocialGrowthHubProps> = ({
  tokenData,
  campaignData,
  setCampaignData,
}) => {
  const [activeChannel, setActiveChannel] = useState<"twitter" | "telegram" | "scripts" | "ads" | "raids">("twitter");
  const [customPrompt, setCustomPrompt] = useState("");
  const [selectedTone, setSelectedTone] = useState("Classy & Professional");
  const [selectedAudience, setSelectedAudience] = useState("Solana DeFi Degens & Institutional High-Net-Worth Holders");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleGenerateAiCampaign = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/social-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenName: tokenData.name,
          tokenSymbol: tokenData.symbol,
          marketCap: `$${(tokenData.marketCap / 1000000).toFixed(2)}M`,
          currentPrice: `$${tokenData.priceUsd.toFixed(4)}`,
          growthStrategy: "Rise Farming & Automated Deflationary Buybacks",
          tone: selectedTone,
          targetAudience: selectedAudience,
          promptNotes: customPrompt,
        }),
      });
      const data = await response.json();
      if (data && data.twitterCampaign) {
        setCampaignData(data);
      }
    } catch (err) {
      console.error("Failed to generate campaign:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Omni-Channel Viral Community Growth & Advertising Engine
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Social Media Campaigns & Viral Raids
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl">
              Direct and amplify high-converting promotional threads, Telegram war-room alerts, 30-sec short video scripts, and crypto ad banners designed to drive organic liquidity and perpetual on-chain interest.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 text-right">
              <span className="text-[11px] text-slate-400 block">Community Sentiment</span>
              <span className="text-base font-bold text-emerald-400 font-mono">96.4% Bullish</span>
            </div>
            <div className="rounded-xl bg-slate-950/80 p-3 border border-slate-800 text-right">
              <span className="text-[11px] text-slate-400 block">24h Raid Velocity</span>
              <span className="text-base font-bold text-cyan-400 font-mono">3,840 Actions</span>
            </div>
          </div>
        </div>

        {/* AI Prompt & Tone Configurator */}
        <div className="mt-5 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-white mb-2">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>AI Campaign Director (Powered by Gemini)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Brand Voice & Tone:</label>
              <select
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-emerald-500"
              >
                <option value="Classy & Professional">Classy & Professional (Recommended)</option>
                <option value="Institutional High-Status">Institutional High-Status & Visionary</option>
                <option value="DeFi Alpha & Mathematical">DeFi Alpha & Mathematical</option>
                <option value="High-Energy Community Hype">High-Energy Community Hype & Raid</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Target Community:</label>
              <select
                value={selectedAudience}
                onChange={(e) => setSelectedAudience(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 focus:border-emerald-500"
              >
                <option value="Solana DeFi Degens & Institutional High-Net-Worth Holders">
                  Solana DeFi & High-Net-Worth Holders
                </option>
                <option value="Crypto Twitter Viral Audience">Crypto Twitter Viral Audience</option>
                <option value="Yield Farmers & Staking Whales">Yield Farmers & Staking Whales</option>
                <option value="DexScreener Active Traders">DexScreener Active Traders</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                id="generate-social-campaign-ai-btn"
                onClick={handleGenerateAiCampaign}
                disabled={isGenerating}
                className="w-full rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 py-2 px-4 text-xs font-bold text-slate-950 transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 fill-current" />
                )}
                <span>{isGenerating ? "Crafting Campaign..." : "Generate AI Blitz Campaign"}</span>
              </button>
            </div>
          </div>

          <div>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Optional: Enter a specific milestone or news to highlight (e.g. 'Announce $5M market cap and 50K token burn')..."
              className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Channel Tabs */}
      <div className="flex border-b border-slate-800 space-x-2 text-xs font-semibold overflow-x-auto pb-1">
        <button
          id="tab-channel-twitter"
          onClick={() => setActiveChannel("twitter")}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-xl transition border-b-2 ${
            activeChannel === "twitter"
              ? "border-emerald-400 text-emerald-400 bg-slate-900/90 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
          }`}
        >
          <Share2 className="h-4 w-4" />
          <span>X / Twitter Raids ({campaignData.twitterCampaign?.length || 3})</span>
        </button>

        <button
          id="tab-channel-telegram"
          onClick={() => setActiveChannel("telegram")}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-xl transition border-b-2 ${
            activeChannel === "telegram"
              ? "border-emerald-400 text-emerald-400 bg-slate-900/90 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
          }`}
        >
          <Send className="h-4 w-4 text-cyan-400" />
          <span>Telegram Blasts ({campaignData.telegramBlasts?.length || 2})</span>
        </button>

        <button
          id="tab-channel-scripts"
          onClick={() => setActiveChannel("scripts")}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-xl transition border-b-2 ${
            activeChannel === "scripts"
              ? "border-emerald-400 text-emerald-400 bg-slate-900/90 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
          }`}
        >
          <Video className="h-4 w-4 text-amber-400" />
          <span>TikTok / Reels Video Scripts</span>
        </button>

        <button
          id="tab-channel-ads"
          onClick={() => setActiveChannel("ads")}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-xl transition border-b-2 ${
            activeChannel === "ads"
              ? "border-emerald-400 text-emerald-400 bg-slate-900/90 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
          }`}
        >
          <Megaphone className="h-4 w-4 text-pink-400" />
          <span>Paid Crypto Advertising Banners</span>
        </button>

        <button
          id="tab-channel-raids"
          onClick={() => setActiveChannel("raids")}
          className={`flex items-center gap-2 px-4 py-2 rounded-t-xl transition border-b-2 ${
            activeChannel === "raids"
              ? "border-emerald-400 text-emerald-400 bg-slate-900/90 font-bold"
              : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
          }`}
        >
          <Target className="h-4 w-4 text-emerald-400" />
          <span>Community Raid Command</span>
        </button>
      </div>

      {/* Tab 1: X / Twitter Campaign */}
      {activeChannel === "twitter" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>High-engagement posts with hashtags and cashtag optimization:</span>
            <div className="flex gap-1.5">
              {campaignData.raidHashtags?.map((tag) => (
                <span key={tag} className="rounded bg-slate-900 px-2 py-0.5 text-[11px] text-cyan-300 font-mono border border-slate-800">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {campaignData.twitterCampaign?.map((post, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-md">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-bold text-cyan-400 border border-cyan-500/20">
                      {post.type}
                    </span>
                    <span className="text-[11px] text-slate-400">Estimated Reach: 25K+ Impressions</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(post.content, `twitter-${idx}`)}
                      className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition"
                    >
                      {copiedId === `twitter-${idx}` ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.content)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 rounded-lg bg-sky-500 hover:bg-sky-400 px-3 py-1 text-xs font-bold text-slate-950 transition"
                    >
                      <Share2 className="h-3 w-3" />
                      <span>Tweet on X</span>
                    </a>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950/70 p-4 border border-slate-800/70 text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans">
                  {post.content}
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="italic text-emerald-400">Community Action: {post.callToAction}</span>
                  <span>{post.content.length} characters</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Telegram War Room */}
      {activeChannel === "telegram" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ready-to-post announcements for Telegram groups and alpha callers:</span>
            <span className="text-cyan-400 font-semibold">Markdown Formatted</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaignData.telegramBlasts?.map((blast, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                    <h3 className="text-sm font-bold text-white">{blast.title}</h3>
                    <button
                      onClick={() => copyToClipboard(blast.body, `tg-${idx}`)}
                      className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-700 hover:text-white transition"
                    >
                      {copiedId === `tg-${idx}` ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy Message</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="rounded-xl bg-slate-950/80 p-4 border border-slate-800 text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed">
                    {blast.body}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>📌 Pin to Announcement Channel</span>
                  <span className="text-emerald-400">Includes verified links</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Short Video Script Prompts */}
      {activeChannel === "scripts" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">{campaignData.shortVideoScript?.title}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Director-ready script for TikTok creators, Instagram Reels, and YouTube Shorts.
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(JSON.stringify(campaignData.shortVideoScript, null, 2), "script-all")}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 hover:text-white transition"
            >
              {copiedId === "script-all" ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Copied Full Script!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Complete Script</span>
                </>
              )}
            </button>
          </div>

          <div className="mb-4 rounded-xl bg-amber-950/20 border border-amber-800/40 p-3.5 text-xs">
            <span className="font-bold text-amber-300 block mb-1">⚡️ 3-Second Viral Hook:</span>
            <p className="text-slate-200 italic">{campaignData.shortVideoScript?.hook}</p>
            <span className="text-[11px] text-slate-400 mt-2 block">
              Suggested Audio: <span className="text-amber-400 font-mono">{campaignData.shortVideoScript?.suggestedSound}</span>
            </span>
          </div>

          <div className="space-y-3">
            {campaignData.shortVideoScript?.bodyScenes?.map((scene, idx) => (
              <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="font-mono text-emerald-400 font-bold">
                  {scene.second}
                </div>
                <div className="md:col-span-1 text-slate-400">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Visual Scene:</span>
                  {scene.visual}
                </div>
                <div className="md:col-span-2 text-slate-200 font-medium">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">Voiceover Script:</span>
                  "{scene.audio}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Paid Crypto Advertising Banners */}
      {activeChannel === "ads" && (
        <div className="space-y-5">
          <div className="text-xs text-slate-400">
            High-converting banner ads formatted for DexScreener Sponsored Ads, Coinzilla, Bitmedia, and Twitter Promoted Ads:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {campaignData.paidAdCopies?.map((ad, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 flex flex-col justify-between shadow-md">
                <div>
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
                    <span className="rounded-md bg-pink-500/10 px-2 py-0.5 text-xs font-bold text-pink-400 border border-pink-500/20">
                      {ad.platform}
                    </span>
                    <button
                      onClick={() => copyToClipboard(`${ad.headline}\n${ad.subtitle}\nCTA: ${ad.ctaButton}`, `ad-${idx}`)}
                      className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
                    >
                      {copiedId === `ad-${idx}` ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>

                  {/* Visual mockup of the banner */}
                  <div className="my-3 rounded-xl border border-slate-700 bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/60 p-4 relative overflow-hidden">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-white text-sm sm:text-base tracking-tight">{ad.headline}</div>
                        <div className="text-xs text-slate-300 mt-1">{ad.subtitle}</div>
                      </div>
                      <div className="shrink-0">
                        <button className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md">
                          {ad.ctaButton}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex justify-between items-center pt-2">
                  <span>Ready for Ad Network Upload</span>
                  <span className="text-emerald-400">CTR Target: &gt;2.8%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Community Raid Commander */}
      {activeChannel === "raids" && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6 shadow-md space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Community Raid Command Center</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Coordinated targets for community holders to push DexScreener trending, Twitter cashtags, and CoinGecko upvotes.
              </p>
            </div>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/30">
              Active Raid in Progress
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-white">1. DexScreener Upvote Raid</span>
                <span className="text-emerald-400 font-mono font-bold">428 / 500</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-emerald-400 h-full w-[85%]"></div>
              </div>
              <p className="text-slate-400 mb-3">
                Rocket upvote the token page to maintain #1 Trending spot across Solana mainnet.
              </p>
              <button 
                onClick={() => alert("DexScreener raid link opened! Click the rocket reaction on the live chart.")}
                className="w-full rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 py-1.5 font-bold transition flex items-center justify-center gap-1"
              >
                <span>Upvote on DexScreener</span>
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-white">2. Twitter Cashtag Storm</span>
                <span className="text-cyan-400 font-mono font-bold">890 / 1,000</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-cyan-400 h-full w-[89%]"></div>
              </div>
              <p className="text-slate-400 mb-3">
                Quote-tweet the latest alpha thread and tag 3 Solana whales with {tokenData.symbol}.
              </p>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Raiding with the ${tokenData.symbol} community! Rise Farming is setting a new on-chain standard on Solana. 🚀🔥\n\n#Solana #SOL ${tokenData.symbol}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 py-1.5 font-bold transition flex items-center justify-center gap-1"
              >
                <span>Join Twitter Raid</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-xs">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-white">3. Telegram Voice Space</span>
                <span className="text-amber-400 font-mono font-bold">Live Now</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-2">
                <div className="bg-amber-400 h-full w-[100%] animate-pulse"></div>
              </div>
              <p className="text-slate-400 mb-3">
                Community voice session discussing the next automated buyback cycle and staking multiplier.
              </p>
              <button 
                onClick={() => alert("Connecting to Community War Room...")}
                className="w-full rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 py-1.5 font-bold transition flex items-center justify-center gap-1"
              >
                <span>Enter Voice Room</span>
                <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
