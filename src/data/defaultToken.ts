import { TokenData, RiseFarmingConfig, FarmingTransaction, WebsiteCopy, SocialCampaignData } from "../types";

export const PRESET_TOKENS: TokenData[] = [
  {
    name: "Solana Ascent",
    symbol: "$ASCENT",
    mintAddress: "Ascnt3k9Vb4qE81hM2L7rUoP45W9jZ2kX6qF8vTy2nB",
    priceUsd: 0.0482,
    priceChange24h: 18.64,
    marketCap: 4820000,
    liquidityUsd: 685000,
    volume24h: 1420500,
    holderCount: 4210,
    fdv: 4820000,
    circulatingSupply: 100000000,
    totalSupply: 100000000,
    burnedTokens: 3420000,
    allTimeHigh: 0.0542,
    dexScreenerRank: 1,
  },
  {
    name: "Solstice Horizon",
    symbol: "$SOLSTICE",
    mintAddress: "SLSTc7mYpQ8wE41xN9LrTuOp32KaV9mB7zD4wEqX1vL",
    priceUsd: 0.1245,
    priceChange24h: 9.32,
    marketCap: 12450000,
    liquidityUsd: 1480000,
    volume24h: 2890000,
    holderCount: 8930,
    fdv: 12450000,
    circulatingSupply: 100000000,
    totalSupply: 100000000,
    burnedTokens: 6150000,
    allTimeHigh: 0.138,
    dexScreenerRank: 3,
  },
  {
    name: "Aura Quantum",
    symbol: "$AURA",
    mintAddress: "AuRA9pL1vZxKwE58NmQrTuOp64BcX1mD9yF2tWqZ8kP",
    priceUsd: 0.00892,
    priceChange24h: 32.15,
    marketCap: 1784000,
    liquidityUsd: 390000,
    volume24h: 890400,
    holderCount: 2340,
    fdv: 1784000,
    circulatingSupply: 200000000,
    totalSupply: 200000000,
    burnedTokens: 11200000,
    allTimeHigh: 0.0104,
    dexScreenerRank: 5,
  },
];

export const INITIAL_FARMING_CONFIG: RiseFarmingConfig = {
  isActive: true,
  frequencySeconds: 15,
  minTicketSol: 0.25,
  maxTicketSol: 1.8,
  buybackPercent: 28,
  farmingApr: 44.5,
  floorDefenseBufferPercent: 4.2,
  antiDumpSlippage: 2.5,
  selectedDexs: ["Raydium CPMM", "Meteora DLMM", "Orca Whirlpool"],
  targetDailyVolume: 2500000,
  accumulatedVolumeGenerated: 642890,
  totalTokensBurned: 3420000,
  totalFloorDefendedUsd: 84200,
  vaultWarChestSol: 456.2,
};

export const INITIAL_TRANSACTIONS: FarmingTransaction[] = [
  {
    id: "tx-1",
    timestamp: "10s ago",
    type: "MICRO_BUY",
    dex: "Raydium CPMM",
    solAmount: 0.85,
    tokenAmount: 2640,
    priceUsd: 0.0482,
    txHash: "5K2y...9JbQ",
    impactPercent: 0.12,
  },
  {
    id: "tx-2",
    timestamp: "24s ago",
    type: "COMMUNITY_BUY",
    dex: "Meteora DLMM",
    solAmount: 2.5,
    tokenAmount: 7780,
    priceUsd: 0.0481,
    txHash: "3mN8...7VxP",
    impactPercent: 0.35,
  },
  {
    id: "tx-3",
    timestamp: "45s ago",
    type: "BUYBACK_BURN",
    dex: "Raydium CPMM",
    solAmount: 1.45,
    tokenAmount: 4520,
    priceUsd: 0.0480,
    txHash: "8qL4...2ZwD",
    impactPercent: 0.22,
  },
  {
    id: "tx-4",
    timestamp: "1m ago",
    type: "LP_REBALANCE",
    dex: "Orca Whirlpool",
    solAmount: 4.2,
    tokenAmount: 13080,
    priceUsd: 0.0479,
    txHash: "9wT1...6MbK",
    impactPercent: 0.58,
  },
  {
    id: "tx-5",
    timestamp: "1m 30s ago",
    type: "MICRO_BUY",
    dex: "Meteora DLMM",
    solAmount: 0.65,
    tokenAmount: 2025,
    priceUsd: 0.0478,
    txHash: "4yB7...1NkR",
    impactPercent: 0.09,
  },
];

export const INITIAL_WEBSITE_COPY: WebsiteCopy = {
  heroTitle: "The Algorithmic Rise Engine for Solana",
  heroSubtitle: "Engineered on-chain momentum, sustainable liquidity farming, and unstoppable community power. Built for lasting market dominance.",
  stats: [
    { label: "Rise Farming APR", value: "44.5%" },
    { label: "Floor Defense Vault", value: "$84.2K Active" },
    { label: "Liquidity Burned", value: "100% SPL Lock" },
    { label: "On-Chain Buy Pressure", value: "81.4% Ratio" },
  ],
  valueProps: [
    {
      title: "Algorithmic Rise Farming",
      description: "Automated micro-volume liquidity sweeps tighten DEX spreads across Raydium & Meteora, triggering high-ranking DexScreener visibility and continuous green buy candles.",
    },
    {
      title: "Deflationary Buyback & Burn Vault",
      description: "Dynamic protocol fees automatically trigger targeted market buybacks on dips, sweeping tokens into the Solana incinerator address to permanently reduce float.",
    },
    {
      title: "Diamond-Hand Staking Multiplier",
      description: "Generous LP farming yields and holder rewards incentivize organic retention, shielding the community from predatory mercenary dumps.",
    },
  ],
  faq: [
    {
      question: "How does the Rise Farming engine actively lift the on-chain price?",
      answer: "The protocol operates automated algorithmic liquidity bots that execute micro-rebalancing buys across Raydium CPMM and Meteora DLMM pools. By staggering volume and absorbing sell walls, it produces steady upward price discovery.",
    },
    {
      question: "How do I participate in community raids and staking?",
      answer: "Connect your Solana wallet, enter the Staking Vault to begin earning up to 44.5% APR in yield rewards, and use our one-click Social Hub to amplify viral community raids on X and Telegram.",
    },
    {
      question: "Is the liquidity locked and verified?",
      answer: "Yes, 100% of the initial liquidity pool tokens have been burned and the smart contract mint authority is permanently revoked.",
    },
  ],
};

export const INITIAL_SOCIAL_CAMPAIGN: SocialCampaignData = {
  headline: "$ASCENT On-Chain Momentum & Liquidity Expansion Blitz",
  narrativeHook: "Building the premier algorithmic liquidity standard on Solana. Sustainable rise farming meets unstoppable community growth.",
  twitterCampaign: [
    {
      type: "Viral Alpha Thread (Opener)",
      content: `🚨 The Solana on-chain liquidity playbook is changing forever.\n\nWhile most tokens rely on empty hype, $ASCENT is powered by continuous algorithmic Rise Farming and automated floor buybacks.\n\nCurrently trading at $0.0482 with $4.8M MC. A thread on why this is just starting 🧵👇\n\n#Solana #SOL $ASCENT`,
      callToAction: "Retweet, bookmark, and enter the live DEX liquidity pool.",
    },
    {
      type: "Ecosystem & Rise Farming Breakdown",
      content: `What actually makes $ASCENT tick?\n\n1️⃣ Constant Rise Farming: Micro-volume compounding on Raydium & Meteora\n2️⃣ Vault Sweeper: Protocol revenues sweep sell walls into permanent burn\n3️⃣ High-Yield Staking: Organic holders earn SOL-denominated rewards\n\nPure mathematical resilience.\n\nChart: live on DexScreener 📈`,
      callToAction: "Check on-chain analytics and verify contracts.",
    },
    {
      type: "Community Raid & Cashtag Push",
      content: `COMMUNITY NOTICE ⚡️\n\nNew liquidity milestone smashed! The orderbook is primed. Drop a '🔥' in comments if you hold $ASCENT.\n\nTag your favorite Solana Chad. We are sending this to valhalla.\n\n$SOL $ASCENT #SolanaGems`,
      callToAction: "Post your cashtags and like all comments.",
    },
  ],
  telegramBlasts: [
    {
      title: "🟢 ON-CHAIN BUY PRESSURE TRIGGERED | Rise Farming Active",
      body: `🏆 Solana Ascent ($ASCENT) Status Update:\n\n• Price: $0.0482 (+18.64%)\n• Market Cap: $4.82M\n• Strategy: Perpetual Rise Farming & Multi-Pool Rebalance\n• Verified Contract: Ascnt3k9...2nB on Solana Mainnet\n\n👉 Join the ongoing Twitter raid and claim your staking multiplier today!`,
    },
    {
      title: "📢 DAILY PROTOCOL BRIEF & COMMUNITY WAR ROOM",
      body: `Salute holders! The automated buyback engine just absorbed another chunk of circulating float.\n\nOur ad campaigns are going live across DexScreener, Telegram channels, and Twitter Spaces.\n\nKeep cashtags trending: $ASCENT #Solana`,
    },
  ],
  shortVideoScript: {
    title: "30-Sec TikTok / Instagram Reels / YouTube Shorts Script",
    hook: "Show a fast-motion Solana candlestick chart rocketing green with sound effect 'Wait, what is Rise Farming?'",
    bodyScenes: [
      {
        second: "0:00 - 0:05",
        visual: "Close up on DexScreener chart showing consistent green buy dots and tight bid-ask spread.",
        audio: "If you're still chasing pump and dumps on Solana, you're doing it backwards.",
      },
      {
        second: "0:05 - 0:15",
        visual: "Animated graphic of automated liquidity farming feeding back into token price.",
        audio: "Look at this token. It uses algorithmic Rise Farming to generate perpetual buy pressure.",
      },
      {
        second: "0:15 - 0:25",
        visual: "Screen capture of the official intuitive dashboard showing live portfolio tracking and community raids.",
        audio: "Every trade fuels automated buybacks and permanent burn. Real on-chain yield.",
      },
      {
        second: "0:25 - 0:30",
        visual: "Clean brand logo, website URL, and 'Link in bio' graphic.",
        audio: "Check the website, inspect the smart contract, and see for yourself. Don't fade it.",
      },
    ],
    suggestedSound: "High-energy cyberpunk synthwave or viral electronic bassline",
  },
  paidAdCopies: [
    {
      platform: "DexScreener Banner (600x120)",
      headline: "$ASCENT: Algorithmic Rise Farming on Solana",
      subtitle: "Persistent On-Chain Buy Volume & High-Yield Staking",
      ctaButton: "View Live Chart",
    },
    {
      platform: "Coinzilla & Bitmedia Native Crypto Ad",
      headline: "Next-Gen Solana Liquidity Architecture",
      subtitle: "Discover how Solana Ascent creates verifiable, automated upward liquidity momentum.",
      ctaButton: "Explore Protocol",
    },
  ],
  raidHashtags: ["#Solana", "#SOLGems", "$ASCENT", "#RiseFarming", "#DeFi", "#CryptoGains"],
};

export const INITIAL_CHART_DATA = [
  { time: "00:00", price: 0.0395, volume: 45000, buyVolume: 32000, sellVolume: 13000 },
  { time: "02:00", price: 0.0408, volume: 62000, buyVolume: 48000, sellVolume: 14000 },
  { time: "04:00", price: 0.0402, volume: 38000, buyVolume: 24000, sellVolume: 14000 },
  { time: "06:00", price: 0.0421, volume: 89000, buyVolume: 71000, sellVolume: 18000 },
  { time: "08:00", price: 0.0435, volume: 112000, buyVolume: 92000, sellVolume: 20000 },
  { time: "10:00", price: 0.0429, volume: 74000, buyVolume: 51000, sellVolume: 23000 },
  { time: "12:00", price: 0.0448, volume: 156000, buyVolume: 128000, sellVolume: 28000 },
  { time: "14:00", price: 0.0462, volume: 184000, buyVolume: 149000, sellVolume: 35000 },
  { time: "16:00", price: 0.0457, volume: 121000, buyVolume: 93000, sellVolume: 28000 },
  { time: "18:00", price: 0.0474, volume: 210000, buyVolume: 178000, sellVolume: 32000 },
  { time: "20:00", price: 0.0482, volume: 328500, buyVolume: 279000, sellVolume: 49500 },
];
