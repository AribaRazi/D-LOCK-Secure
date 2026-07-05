import { useState } from "react";
import { ShieldCheck, ShieldAlert, Loader2, ExternalLink } from "lucide-react";
import { verifyTransactionApi } from "@/services/fileService";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BlockchainVerifyBadgeProps {
  txHash: string;
  fileName: string;
}

interface VerifyResult {
  success: boolean;
  vm_status: string;
  hash: string;
  gas_used?: string;
  sender?: string;
  timestamp?: string;
  payload?: {
    function?: string;
    arguments?: string[];
  };
}

export function BlockchainVerifyBadge({ txHash, fileName }: BlockchainVerifyBadgeProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    setOpen(true);
    if (result) return; // already fetched once, don't re-fetch
    setLoading(true);
    setError("");
    try {
      const data = await verifyTransactionApi(txHash);
      setResult(data);
    } catch (err: any) {
      setError(err?.response?.data?.error || err?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 text-xs"
        onClick={handleVerify}
      >
        <ShieldCheck className="w-3.5 h-3.5" />
        Verify on-chain
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-purple-500" />
              On-Chain Verification
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground truncate">{fileName}</p>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {result && !loading && (
              <div className="space-y-3">
                <div
                  className={`flex items-center gap-2 p-3 rounded-lg text-sm font-medium ${
                    result.success
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {result.success ? (
                    <ShieldCheck className="w-4 h-4" />
                  ) : (
                    <ShieldAlert className="w-4 h-4" />
                  )}
                  {result.success ? "Confirmed on Aptos testnet" : "Transaction failed"}
                </div>

                <div className="text-xs space-y-1.5 text-muted-foreground">
                  <p><span className="text-foreground">VM Status:</span> {result.vm_status}</p>
                  {result.gas_used && (
                    <p><span className="text-foreground">Gas used:</span> {result.gas_used}</p>
                  )}
                  {result.timestamp && (
                    <p><span className="text-foreground">Timestamp:</span> {result.timestamp}</p>
                  )}
                  <p className="break-all"><span className="text-foreground">Tx hash:</span> {result.hash}</p>
                </div>

                <a
                  href={`https://explorer.aptoslabs.com/txn/${txHash}?network=testnet`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm text-purple-400 hover:text-purple-300"
                >
                  View on Aptos Explorer
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}