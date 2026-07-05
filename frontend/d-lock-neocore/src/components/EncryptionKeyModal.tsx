import { Copy, Key, Check, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

interface EncryptionKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  encryptionKey: string;
  fileHash: string;
}

const EncryptionKeyModal = ({
  isOpen,
  onClose,
  fileName,
  encryptionKey,
  fileHash,
}: EncryptionKeyModalProps) => {
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const copyToClipboard = async (text: string, type: "key" | "hash") => {
    await navigator.clipboard.writeText(text);
    if (type === "key") {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } else {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
    toast({
      title: "Copied!",
      description: `${type === "key" ? "Decryption key" : "File hash"} copied to clipboard`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 border border-neon-cyan/30 flex items-center justify-center">
              <Shield className="w-6 h-6 text-neon-cyan" />
            </div>
            <div>
              <DialogTitle className="font-display text-xl text-foreground">
                Encryption Complete!
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Save these credentials securely
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* File Name */}
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground mb-1">File</p>
            <p className="text-sm font-medium text-foreground truncate">{fileName}</p>
          </div>

          {/* Decryption Key */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Key className="w-4 h-4 text-accent" />
              Decryption Key
            </label>
            <div className="relative">
              <div className="p-3 pr-12 rounded-lg bg-muted/50 border border-accent/30 font-mono text-sm text-accent break-all">
                {encryptionKey}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-accent/20"
                onClick={() => copyToClipboard(encryptionKey, "key")}
              >
                {copiedKey ? (
                  <Check className="w-4 h-4 text-neon-cyan" />
                ) : (
                  <Copy className="w-4 h-4 text-accent" />
                )}
              </Button>
            </div>
          </div>

          {/* File Hash */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              File Hash (IPFS)
            </label>
            <div className="relative">
              <div className="p-3 pr-12 rounded-lg bg-muted/50 border border-primary/30 font-mono text-sm text-primary break-all">
                {fileHash}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 hover:bg-primary/20"
                onClick={() => copyToClipboard(fileHash, "hash")}
              >
                {copiedHash ? (
                  <Check className="w-4 h-4 text-neon-cyan" />
                ) : (
                  <Copy className="w-4 h-4 text-primary" />
                )}
              </Button>
            </div>
          </div>
<a
  href={`https://explorer.aptoslabs.com/txn/${fileHash}?network=testnet`}
  target="_blank"
  rel="noopener noreferrer"
  className="text-sm text-neon-cyan underline mt-2 block"
>
  🔗 View on Aptos Blockchain Explorer
</a>


          {/* Warning */}
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/30">
            <p className="text-sm text-destructive font-medium">⚠️ Important</p>
            <p className="text-xs text-destructive/80 mt-1">
              Store these credentials safely. You'll need both the file hash and decryption key to retrieve your file. Lost keys cannot be recovered.
            </p>
          </div>

          <Button variant="neon" className="w-full" onClick={onClose}>
            I've Saved My Keys
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EncryptionKeyModal;
