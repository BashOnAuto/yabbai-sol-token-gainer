import React, { useState } from "react";
import { X, Sparkles, CheckCircle2 } from "lucide-react";
import { TokenData } from "../types";

interface CustomTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveToken: (token: TokenData) => void;
}

export const CustomTokenModal: React.FC<CustomTokenModalProps> = ({
  isOpen,
  onClose,
  onSaveToken,
}) => {
  const [mintAddress, setMintAddress] = useState("");
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [priceUsd, setPriceUsd] = useState("0.025");
  const [marketCap, setMarketCap] = useState("2500000");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol || !name) return;

    const formattedSymbol = symbol.startsWith("$") ? symbol.toUpperCase() : "$" + symbol.toUpperCase();
    const parsedPrice = parseFloat(priceUsd) || 0.025;
    const parsedMc = parseFloat(marketCap) || 2500000;

    const newToken: TokenData = {
      name: name.trim(),
      symbol: formattedSymbol,
      mintAddress: mintAddress.trim() || `${formattedSymbol.replace('$', '')}Mint${Math.random().toString(36).substring(2, 8)}`,
      priceUsd: parsedPrice,
      priceChange24h: 14.5,
      marketCap: parsedMc,
      liquidityUsd: Math.round(parsedMc * 0.15),
      volume24h: Math.round(parsedMc * 0.35),
      holderCount: 1420,
      fdv: parsedMc,
      circulatingSupply: Math.round(parsedMc / parsedPrice),
      totalSupply: Math.round(parsedMc / parsedPrice),
      burnedTokens: 500000,
      allTimeHigh: parsedPrice * 1.25,
      dexScreenerRank: 2,
    };

    onSaveToken(newToken);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Target Any Solana Mint</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          Configure the Rise Farming engine, social media blitz, and investor website for your own token.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-300 block mb-1">Token Mint Address (Solana SPL):</label>
            <input
              type="text"
              required
              value={mintAddress}
              onChange={(e) => setMintAddress(e.target.value)}
              placeholder="e.g. 7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-slate-200 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1">Token Symbol:</label>
              <input
                type="text"
                required
                value={symbol}
                onChange={(e) => setSymbol(e.target.value)}
                placeholder="e.g. $MOON"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-bold text-slate-200 uppercase placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Token Name:</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Moonshot Solana"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 block mb-1">Current Price (USD):</label>
              <input
                type="number"
                step="0.00001"
                value={priceUsd}
                onChange={(e) => setPriceUsd(e.target.value)}
                placeholder="0.025"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-slate-200 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1">Market Cap (USD):</label>
              <input
                type="number"
                step="10000"
                value={marketCap}
                onChange={(e) => setMarketCap(e.target.value)}
                placeholder="2500000"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-slate-200 placeholder-slate-600 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 py-2.5 text-xs font-bold text-slate-950 transition shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Load Token into Rise Engine</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
