export interface TokenData {
  name: string;
  symbol: string;
  mintAddress: string;
  priceUsd: number;
  priceChange24h: number;
  marketCap: number;
  liquidityUsd: number;
  volume24h: number;
  holderCount: number;
  fdv: number;
  circulatingSupply: number;
  totalSupply: number;
  burnedTokens: number;
  allTimeHigh: number;
  dexScreenerRank: number;
}

export interface RiseFarmingConfig {
  isActive: boolean;
  frequencySeconds: number;
  minTicketSol: number;
  maxTicketSol: number;
  buybackPercent: number;
  farmingApr: number;
  floorDefenseBufferPercent: number;
  antiDumpSlippage: number;
  selectedDexs: string[]; // ["Raydium CPMM", "Meteora DLMM", "Orca Whirlpool"]
  targetDailyVolume: number;
  accumulatedVolumeGenerated: number;
  totalTokensBurned: number;
  totalFloorDefendedUsd: number;
  vaultWarChestSol: number;
}

export interface FarmingTransaction {
  id: string;
  timestamp: string;
  type: "MICRO_BUY" | "BUYBACK_BURN" | "LP_REBALANCE" | "STAKING_YIELD" | "COMMUNITY_BUY" | "VAULT_WARCHEST_WITHDRAWAL" | "LP_REMOVAL";
  dex: string;
  solAmount: number;
  tokenAmount: number;
  priceUsd: number;
  txHash: string;
  impactPercent: number;
}

export interface SocialPost {
  type: string;
  content: string;
  callToAction: string;
}

export interface TelegramBlast {
  title: string;
  body: string;
}

export interface VideoScriptScene {
  second: string;
  visual: string;
  audio: string;
}

export interface VideoScript {
  title: string;
  hook: string;
  bodyScenes: VideoScriptScene[];
  suggestedSound: string;
}

export interface PaidAdCopy {
  platform: string;
  headline: string;
  subtitle: string;
  ctaButton: string;
}

export interface SocialCampaignData {
  headline: string;
  narrativeHook: string;
  twitterCampaign: SocialPost[];
  telegramBlasts: TelegramBlast[];
  shortVideoScript: VideoScript;
  paidAdCopies: PaidAdCopy[];
  raidHashtags: string[];
}

export interface PortfolioPosition {
  tokenBalance: number;
  stakedLpBalance: number;
  averageBuyPrice: number;
  currentValueUsd: number;
  unrealizedPnlUsd: number;
  unrealizedPnlPercent: number;
  pendingYieldRewards: number;
  solWalletBalance: number;
  phantomWalletAddress: string;
  phantomWalletBalance: number;
}

export interface UserTransaction {
  id: string;
  date: string;
  type: "BUY" | "SELL" | "STAKE" | "CLAIM_YIELD" | "LP_REMOVAL";
  tokenAmount: number;
  solAmount: number;
  priceUsd: number;
  status: "Confirmed" | "Processing";
}

export interface WebsiteCopy {
  heroTitle: string;
  heroSubtitle: string;
  stats: { label: string; value: string }[];
  valueProps: { title: string; description: string }[];
  faq: { question: string; answer: string }[];
}

export interface SolanaNetworkStats {
  tps: number;
  slot: number;
  blockHeight: number;
  epoch: number;
  epochProgressPercent: number;
  activeValidators: number;
  delinquentValidators: number;
  solPriceUsd: number;
  solPriceChange24h: number;
  priorityFeeMicroLamports: number;
  network: string;
  rpcEndpoint: string;
  timestamp: string;
}
