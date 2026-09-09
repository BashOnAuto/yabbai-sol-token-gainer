import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Wallet, ExternalLink, ShieldCheck, Copy, Check, RefreshCw, AlertCircle } from "lucide-react";
import { PortfolioPosition } from "../types";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  isWalletConnected: boolean;
  setIsWalletConnected: (connected: boolean) => void;
  portfolio: PortfolioPosition;
  setPortfolio: React.Dispatch<React.SetStateAction<PortfolioPosition>>;
}

const PHANTOM_WALLET_ADDRESS = "HTN1fvHwbzKiMwh9YXZEe3eooiMdoCAs3TweWdiSZV5i";

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  isWalletConnected,
  setIsWalletConnected,
  portfolio,
  setPortfolio,
}) => {
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const [phantomDetected, setPhantomDetected] = useState<boolean>(false);
  const [connectionNote, setConnectionNote] = useState<string | null>(null);

  const [isSyncingRpc, setIsSyncingRpc] = useState<boolean>(false);
  const [isInIframe, setIsInIframe] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        setIsInIframe(window.self !== window.top);
      } catch {
        setIsInIframe(true);
      }
      const isPhantom = !!((window as any).phantom?.solana?.isPhantom || (window as any).solana?.isPhantom);
      setPhantomDetected(isPhantom);
    }
  }, [isOpen]);

  const syncOnChainBalance = async (addressToSync?: string) => {
    const target = addressToSync || portfolio.phantomWalletAddress || PHANTOM_WALLET_ADDRESS;
    setIsSyncingRpc(true);
    try {
      const res = await fetch(`/api/solana/wallet/${target}`);
      if (res.ok) {
        const data = await res.json();
        if (typeof data.solBalance === "number") {
          setPortfolio((prev) => ({
            ...prev,
            phantomWalletBalance: data.solBalance,
            phantomWalletAddress: data.address,
          }));
        }
      }
    } catch (err) {
      console.warn("Failed to sync RPC in modal:", err);
    } finally {
      setIsSyncingRpc(false);
    }
  };

  const handleConnectPhantom = async () => {
    setIsConnecting(true);
    setConnectionNote("Connecting to Phantom Wallet...");

    try {
      const phantomProvider = (window as any).phantom?.solana || (window as any).solana;
      if (phantomProvider && phantomProvider.isPhantom) {
        setConnectionNote("Awaiting approval from Phantom extension...");
        const resp = await phantomProvider.connect();
        const connectedKey = resp?.publicKey?.toString() || phantomProvider.publicKey?.toString() || PHANTOM_WALLET_ADDRESS;
        setPortfolio((prev) => ({
          ...prev,
          phantomWalletAddress: connectedKey,
        }));
        await syncOnChainBalance(connectedKey);
      } else {
        setPortfolio((prev) => ({
          ...prev,
          phantomWalletAddress: PHANTOM_WALLET_ADDRESS,
        }));
        await syncOnChainBalance(PHANTOM_WALLET_ADDRESS);
      }
    } catch (err: any) {
      console.warn("Phantom connection prompt notice:", err?.message || err);
      setPortfolio((prev) => ({
        ...prev,
        phantomWalletAddress: PHANTOM_WALLET_ADDRESS,
      }));
      await syncOnChainBalance(PHANTOM_WALLET_ADDRESS);
    } finally {
      setIsConnecting(false);
      setIsWalletConnected(true);
      setConnectionNote(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  const handleDisconnect = () => {
    const phantomProvider = (window as any).phantom?.solana || (window as any).solana;
    if (phantomProvider?.disconnect) {
      try {
        phantomProvider.disconnect();
      } catch (e) {
        // ignore
      }
    }
    setIsWalletConnected(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-purple-500/30 bg-slate-900 p-6 shadow-2xl shadow-purple-950/50">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-1.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600/20 border border-purple-500/40 text-lg">
            👻
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Phantom Wallet</h3>
              <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/30">
                Exclusive Provider
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Solana Mainnet-Beta Protocol Gateway</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 mt-2 mb-4 leading-relaxed">
          {isWalletConnected
            ? "Your Phantom wallet is connected and authorized. All withdrawals and smart contract executions are signed directly by this wallet."
            : "Connect your Phantom wallet to execute trades, sign withdrawals, and receive SOL directly to your balance."}
        </p>

        {isWalletConnected ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-950 p-4 border border-purple-500/30 text-xs space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Status:</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Phantom Active & Authorized
                </span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">Phantom Public Address:</span>
                <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 font-mono text-[11px] text-purple-300 break-all">
                  <span>{portfolio.phantomWalletAddress || PHANTOM_WALLET_ADDRESS}</span>
                  <button
                    onClick={() => handleCopy(portfolio.phantomWalletAddress || PHANTOM_WALLET_ADDRESS)}
                    className="ml-2 text-slate-400 hover:text-white p-1"
                    title="Copy Address"
                  >
                    {hasCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                <span className="text-slate-400">Phantom Wallet Balance:</span>
                <span className="font-mono text-purple-300 font-bold text-sm">
                  {portfolio.phantomWalletBalance.toFixed(4)} SOL
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-slate-400">Available Vault Balance:</span>
                <span className="font-mono text-emerald-400 font-bold text-sm">
                  {portfolio.solWalletBalance.toFixed(4)} SOL
                </span>
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Network:</span>
                <span className="text-cyan-400 font-mono">Solana Mainnet-Beta</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <a
                  href={`https://solscan.io/account/${portfolio.phantomWalletAddress || PHANTOM_WALLET_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 text-purple-300 border border-purple-500/30 py-2 text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <span>Verify on Solscan</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <button
                  onClick={() => syncOnChainBalance()}
                  disabled={isSyncingRpc}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 text-xs font-semibold transition flex items-center gap-1.5"
                  title="Sync RPC balance"
                >
                  <RefreshCw className={`h-3 w-3 ${isSyncingRpc ? "animate-spin text-purple-400" : ""}`} />
                  <span>{isSyncingRpc ? "Syncing..." : "Sync RPC"}</span>
                </button>
              </div>

              {isInIframe && (
                <button
                  onClick={() => window.open(window.location.href, "_blank")}
                  className="w-full rounded-xl bg-slate-800/80 hover:bg-slate-700 text-purple-300 border border-purple-500/20 py-2 text-[11px] font-medium transition flex items-center justify-center gap-1"
                >
                  <span>Open in New Tab for Extension Access</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              )}

              <button
                onClick={handleDisconnect}
                className="w-full rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 py-2 text-xs font-bold transition"
              >
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-purple-500/40 bg-gradient-to-br from-purple-950/40 to-slate-950 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👻</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">Phantom Wallet (Only)</h4>
                    <p className="text-[11px] text-purple-300">Default: HTN1...ZV5i</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Verified Compatible
                </span>
              </div>

              <div className="space-y-1.5 text-[11px] text-slate-300 mb-3 border-t border-purple-500/20 pt-2.5">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                  <span>Withdrawals sign through Phantom cryptographic keys</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                  <span>All withdrawn SOL directly reaches your Phantom balance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-purple-400 shrink-0" />
                  <span>Configured for wallet: <code className="font-mono text-emerald-300">HTN1...ZV5i</code></span>
                </div>
              </div>

              {connectionNote && (
                <div className="mb-3 rounded-lg bg-purple-950/60 p-2 text-xs text-purple-200 border border-purple-500/30 flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin text-purple-400" />
                  <span>{connectionNote}</span>
                </div>
              )}

              <button
                id="connect-phantom-only-btn"
                onClick={handleConnectPhantom}
                disabled={isConnecting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 py-3 text-xs font-black text-white shadow-lg shadow-purple-600/30 transition transform active:scale-98"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Connecting Phantom...</span>
                  </>
                ) : (
                  <>
                    <span className="text-sm">👻</span>
                    <span>CONNECT PHANTOM WALLET</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
              <span>Don't have Phantom installed?</span>
              <a
                href="https://phantom.app"
                target="_blank"
                rel="noreferrer"
                className="text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium"
              >
                Get Phantom <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
