import { useState, useEffect } from "react";
import { Unlock, Key, FileText, Download, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { downloadFileApi } from "@/services/api";

interface DecryptPanelProps {
  formState: {
    fileName: string;
    fileHash: string;
    decryptionKey: string;
  };
  onFormStateChange: (state: { fileName: string; fileHash: string; decryptionKey: string }) => void;
}

const DecryptPanel = ({ formState, onFormStateChange }: DecryptPanelProps) => {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Local state synced with parent
  const [fileName, setFileName] = useState(formState.fileName);
  const [fileHash, setFileHash] = useState(formState.fileHash);
  const [decryptionKey, setDecryptionKey] = useState(formState.decryptionKey);

  // Sync local state with parent state when it changes
  useEffect(() => {
    setFileName(formState.fileName);
    setFileHash(formState.fileHash);
    setDecryptionKey(formState.decryptionKey);
  }, [formState]);

  // Update parent state when local state changes
  const updateFormState = (field: string, value: string) => {
    const newState = { fileName, fileHash, decryptionKey, [field]: value };
    
    if (field === "fileName") setFileName(value);
    if (field === "fileHash") setFileHash(value);
    if (field === "decryptionKey") setDecryptionKey(value);
    
    onFormStateChange(newState);
    setError("");
    setSuccess(false);
  };

  const handleDecrypt = async () => {
    setError("");
    setSuccess(false);

    // Validation
    if (!fileHash.trim()) {
      setError("Please enter a file hash");
      return;
    }

    if (!decryptionKey.trim()) {
      setError("Please enter your decryption key");
      return;
    }

    if (!fileName.trim()) {
      setError("Please enter the file name");
      return;
    }

    setIsDecrypting(true);

    try {
      await downloadFileApi(fileHash, fileName, decryptionKey);

      setSuccess(true);
      toast({
        title: "File Decrypted",
        description: "Your file has been successfully decrypted and downloaded",
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setFileName("");
        setFileHash("");
        setDecryptionKey("");
        onFormStateChange({ fileName: "", fileHash: "", decryptionKey: "" });
        setSuccess(false);
      }, 3000);

    } catch (err: any) {
      console.error("Decryption error:", err);
      
      const errorMessage = err.message || "Decryption failed";
      setError(errorMessage);
      
      toast({
        title: "Decryption Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/30 mb-4">
          <Unlock className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-3xl font-display font-bold mb-2">Decrypt Your Files</h2>
        <p className="text-muted-foreground">
          Enter your file hash and decryption key to retrieve your original file
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
        <div className="space-y-6">
          {/* File Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              File Name
            </label>
            <Input
              type="text"
              placeholder="Enter the original file name (e.g., document.pdf)"
              value={fileName}
              onChange={(e) => updateFormState("fileName", e.target.value)}
              className={`h-12 bg-muted/50 border-border focus:border-accent focus:ring-accent/20 ${
                error ? "border-red-500" : ""
              }`}
              disabled={isDecrypting}
            />
          </div>

          {/* File Hash Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-accent" />
              File Hash (IPFS/Blockchain)
            </label>
            <Input
              type="text"
              placeholder="Enter the file hash from blockchain"
              value={fileHash}
              onChange={(e) => updateFormState("fileHash", e.target.value)}
              className={`h-12 bg-muted/50 border-border focus:border-accent focus:ring-accent/20 font-mono text-sm ${
                error ? "border-red-500" : ""
              }`}
              disabled={isDecrypting}
            />
          </div>

          {/* Decryption Key Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Key className="w-4 h-4 text-accent" />
              Decryption Key
            </label>
            <Input
              type="password"
              placeholder="Enter your decryption key..."
              value={decryptionKey}
              onChange={(e) => updateFormState("decryptionKey", e.target.value)}
              className={`h-12 bg-muted/50 border-border focus:border-accent focus:ring-accent/20 font-mono text-sm ${
                error ? "border-red-500" : ""
              }`}
              disabled={isDecrypting}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isDecrypting) {
                  handleDecrypt();
                }
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500">
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">File Decrypted Successfully!</span>
            </div>
          )}

          {/* Decrypt Button */}
          <Button
            variant="neon"
            className="w-full h-12"
            onClick={handleDecrypt}
            disabled={isDecrypting || !fileHash.trim() || !decryptionKey.trim() || !fileName.trim()}
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
        </div>
      </div>

      {/* How it works section */}
      <div className="mt-8 p-6 bg-muted/30 border border-border rounded-xl">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <span className="text-primary">💡</span>
          How it works:
        </h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
              1
            </span>
            <span>Go to "My Files" tab and click the copy button next to the file you want to decrypt</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
              2
            </span>
            <span>The file name and hash will be automatically filled in this form</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
              3
            </span>
            <span>Enter your decryption key that you saved when uploading</span>
          </li>
          <li className="flex gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
              4
            </span>
            <span>Click "Decrypt & Download" to retrieve your original file</span>
          </li>
        </ol>
      </div>

      {/* Security notice */}
      <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
        <p className="text-xs text-amber-500/90">
          <strong>⚠️ Security Notice:</strong> Make sure you have the correct file hash and decryption key. 
          Wrong credentials will result in decryption failure.
        </p>
      </div>
    </div>
  );
};

export default DecryptPanel;