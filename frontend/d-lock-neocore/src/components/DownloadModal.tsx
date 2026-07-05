import { useState } from "react";
import { Download, Key, Loader2, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
// import { downloadFileApi } from "@/services/api";
import { downloadFileApi } from "@/services/fileService";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileHash: string;
  txHash?: string; // Transaction hash for blockchain explorer
}

const DownloadModal = ({
  isOpen,
  onClose,
  fileName,
  fileHash,
  txHash,
}: DownloadModalProps) => {
  const [decryptionKey, setDecryptionKey] = useState("");
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState("");

  const handleDownload = async () => {
    if (!decryptionKey.trim()) {
      setError("Please enter your decryption key");
      toast({
        title: "Key Required",
        description: "Please enter your decryption key",
        variant: "destructive",
      });
      return;
    }

    setError("");
    setIsDecrypting(true);

    try {
      // Call the actual backend API
      // await downloadFileApi(fileHash, fileName, decryptionKey);
      await downloadFileApi(fileHash, decryptionKey, fileName);

      toast({
        title: "Download Complete",
        description: `${fileName} has been decrypted and downloaded`,
      });
      
      // Reset and close
      setDecryptionKey("");
      onClose();
    } catch (err: any) {
      console.error("Download error:", err);
      
      const errorMessage = err.message || "Download failed";
      setError(errorMessage);
      
      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleClose = () => {
    setDecryptionKey("");
    setError("");
    onClose();
  };

  const viewOnExplorer = () => {
    if (!txHash) {
      toast({
        title: "No Transaction Hash",
        description: "Transaction hash not available for this file",
        variant: "destructive",
      });
      return;
    }
    // Aptos Explorer URL for testnet
    const explorerUrl = `https://explorer.aptoslabs.com/txn/${txHash}?network=testnet`;
    window.open(explorerUrl, "_blank");
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Download className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl text-foreground">
                Download File
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Enter your decryption key
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* File Info */}
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">File</p>
            <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
          </div>

          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-muted-foreground">File Hash</p>
              {txHash && (
                <button
                  onClick={viewOnExplorer}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  View on Explorer
                </button>
              )}
            </div>
            <p className="text-xs font-mono text-primary truncate">{fileHash}</p>
          </div>

          {/* Decryption Key Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Key className="w-4 h-4 text-accent" />
              Decryption Key
            </label>
            <Input
              type="text"
              placeholder="Enter your decryption key..."
              value={decryptionKey}
              onChange={(e) => {
                setDecryptionKey(e.target.value);
                setError(""); // Clear error when typing
              }}
              className={`h-12 bg-muted/50 border-border focus:border-accent focus:ring-accent/20 font-mono text-sm ${
                error ? "border-red-500 focus:border-red-500" : ""
              }`}
              disabled={isDecrypting}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isDecrypting) {
                  handleDownload();
                }
              }}
            />
            
            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <Button
            variant="neon"
            className="w-full"
            onClick={handleDownload}
            disabled={isDecrypting || !decryptionKey.trim()}
          >
            {isDecrypting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Decrypting...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                Decrypt & Download
              </>
            )}
          </Button>

          {/* Security Warning */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <p className="text-xs text-amber-500/90">
              <strong>⚠️ Security Notice:</strong> Wrong decryption key will result in download failure.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DownloadModal;