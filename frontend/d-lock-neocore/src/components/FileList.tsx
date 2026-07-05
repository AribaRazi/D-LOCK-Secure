import { FileText, Image, Video, File, Lock, Download, Trash2, ShieldCheck, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  encryptedAt: string;
  status: "encrypted" | "pending";
  hash: string;
  verified?: boolean;
  txHash?:string,
}

interface FileListProps {
  files: FileItem[];
  onDownload: (id: string) => void;
  onDelete: (id: string) => void;
  onVerify: (id: string) => void;
}

const getFileIcon = (type: string) => {
  if (type.startsWith("image")) return Image;
  if (type.startsWith("video")) return Video;
  if (type.includes("pdf") || type.includes("document")) return FileText;
  return File;
};

const FileList = ({ files, onDownload, onDelete, onVerify }: FileListProps) => {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const copyHash = async (hash: string, id: string) => {
    await navigator.clipboard.writeText(hash);
    setCopiedHash(id);
    setTimeout(() => setCopiedHash(null), 2000);
    toast({
      title: "Copied!",
      description: "File hash copied to clipboard",
    });
  };

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          No encrypted files yet
        </h3>
        <p className="text-muted-foreground max-w-sm">
          Upload files to encrypt and store them securely on the blockchain
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {files.map((file, index) => {
        const IconComponent = getFileIcon(file.type);
        return (
          <div
            key={file.id}
            className={cn(
              "group relative rounded-xl border border-border bg-card/50 p-4",
              "hover:border-primary/40 hover:bg-card transition-all duration-300",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Hover glow effect */}
            <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                {/* File Icon */}
                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">
                    {file.name}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span>{file.size}</span>
                    <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                    <span>{file.encryptedAt}</span>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium",
                    file.status === "encrypted"
                      ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30"
                      : "bg-accent/10 text-accent border border-accent/30"
                  )}>
                    <Lock className="w-3 h-3" />
                    {file.status === "encrypted" ? "Encrypted" : "Pending"}
                  </div>
                  {file.verified && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30">
                      <ShieldCheck className="w-3 h-3" />
                      Verified
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onVerify(file.id)}
                    className="hover:text-neon-cyan hover:bg-neon-cyan/10"
                    title="Verify on blockchain"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDownload(file.id)}
                    className="hover:text-primary hover:bg-primary/10"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(file.id)}
                    className="hover:text-destructive hover:bg-destructive/10"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Hash Row */}
              <div className="flex items-center gap-2 pl-16">
                <span className="text-xs text-muted-foreground">Hash:</span>
                <code className="text-xs font-mono text-primary/80 truncate flex-1">
                  {file.hash}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 hover:bg-primary/10"
                  onClick={() => copyHash(file.hash, file.id)}
                >
                  {copiedHash === file.id ? (
                    <Check className="w-3 h-3 text-neon-cyan" />
                  ) : (
                    <Copy className="w-3 h-3 text-muted-foreground" />
                  )}
                </Button>
              </div>
  {/* ✅ On-chain link row */}
              {file.txHash && (
                <div className="flex items-center gap-2 pl-16 -mt-1">
                  <span className="text-xs text-muted-foreground">On-chain:</span>
                  <a
                    href={`https://explorer.aptoslabs.com/txn/${file.txHash}?network=testnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neon-cyan underline hover:text-neon-cyan/80"
                  >
                    View on Aptos Explorer
                  </a>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FileList;
