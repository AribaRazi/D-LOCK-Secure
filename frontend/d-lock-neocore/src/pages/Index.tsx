import { useState } from "react";
import Header from "@/components/Header";
import TabNavigation from "@/components/TabNavigation";
import UploadZone from "@/components/UploadZone";
import FileList from "@/components/FileList";
import DecryptPanel from "@/components/DecryptPanel";
import EncryptionKeyModal from "@/components/EncryptionKeyModal";
import DownloadModal from "@/components/DownloadModal";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { verifyTransactionApi } from "@/services/fileService";
import { toast } from "@/hooks/use-toast";
// import { uploadFileApi } from "@/api";
// import { uploadFileApi } from "@/services/api";
import { uploadFileApi } from "@/services/fileService";
interface FileItem {
  id: string;
  name: string;
  type: string;
  size: string;
  encryptedAt: string;
  status: "encrypted" | "pending";
  hash: string;
  decryptionKey: string;
  verified?: boolean;
  txHash?: string;
}

// Generate mock hash
const generateHash = () => {
  return "Qm" + Array.from({ length: 44 }, () =>
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 62)]
  ).join("");
};

// Generate mock decryption key
const generateKey = () => {
  return Array.from({ length: 32 }, () =>
    "0123456789abcdef"[Math.floor(Math.random() * 16)]
  ).join("");
};

// Mock data for files
const mockFiles: FileItem[] = [
  {
    id: "1",
    name: "financial_report_2024.pdf",
    type: "application/pdf",
    size: "2.4 MB",
    encryptedAt: "2 hours ago",
    status: "encrypted",
    hash: generateHash(),
    decryptionKey: generateKey(),
    verified: true,
  },
  {
    id: "2",
    name: "project_assets.zip",
    type: "application/zip",
    size: "15.8 MB",
    encryptedAt: "Yesterday",
    status: "encrypted",
    hash: generateHash(),
    decryptionKey: generateKey(),
    verified: false,
  },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [files, setFiles] = useState<FileItem[]>(mockFiles);

  // Encryption modal state
  const [encryptionModal, setEncryptionModal] = useState<{
    isOpen: boolean;
    fileName: string;
    encryptionKey: string;
    fileHash: string;
  }>({ isOpen: false, fileName: "", encryptionKey: "", fileHash: "" });

  // Download modal state
  const [downloadModal, setDownloadModal] = useState<{
    isOpen: boolean;
    fileName: string;
    fileHash: string;
    txHash?: string;
  }>({ isOpen: false, fileName: "", fileHash: "", txHash: "" });

  // ✅ NEW: Decrypt form state (persisted across tab changes)
  const [decryptFormState, setDecryptFormState] = useState({
    fileName: "",
    fileHash: "",
    decryptionKey: "",
  });

  const handleFileSelect = (selectedFiles: FileList) => {
    (async () => {
      const filesArray = Array.from(selectedFiles);
      if (!filesArray.length) return;

      try {
        const uploadedItems: FileItem[] = [];

        for (let i = 0; i < filesArray.length; i++) {
          const file = filesArray[i];

          const res = await uploadFileApi(file);
          console.log("Upload response:", res);

          const newItem: FileItem = {
            id: `onchain-${Date.now()}-${i}`,
            name: res.file_name,
            type: file.type,
            size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            encryptedAt: "Just now",
            status: "encrypted",
            hash: res.file_hash,
            decryptionKey: res.decryption_key,
            verified: true,
            txHash: res.tx_hash,
          };

          uploadedItems.push(newItem);
        }

        setFiles(prev => [...uploadedItems, ...prev]);

        const first = uploadedItems[0];
        setEncryptionModal({
          isOpen: true,
          fileName: first.name,
          encryptionKey: first.decryptionKey,
          fileHash: first.hash,
        });

        toast({
          title: "Encryption Complete",
          description: `${uploadedItems.length} file(s) encrypted and stored on blockchain`,
        });
      } catch (err: any) {
        console.error(err);
        toast({
          title: "Upload Failed",
          description: err.message || "Something went wrong",
          variant: "destructive",
        });
      }
    })();
  };

  const handleDownload = (id: string) => {
    const file = files.find((f) => f.id === id);
    if (file) {
      setDownloadModal({
        isOpen: true,
        fileName: file.name,
        fileHash: file.hash,
        txHash: file.txHash,
      });
    }
  };

  // ✅ NEW: Copy file info to decrypt form
  const handleCopyToDecrypt = (id: string) => {
    const file = files.find((f) => f.id === id);
    if (file) {
      setDecryptFormState({
        fileName: file.name,
        fileHash: file.hash,
        decryptionKey: "", // Don't auto-fill the key for security
      });
      setActiveTab("decrypt");
      toast({
        title: "File Info Copied",
        description: "File details copied to decrypt form",
      });
    }
  };

  const handleDelete = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    toast({
      title: "File Deleted",
      description: "File has been removed from storage",
    });
  };

 const handleVerify = async (id: string) => {
  const file = files.find((f) => f.id === id);

  if (!file?.txHash) {
    toast({
      title: "Cannot verify",
      description: "No transaction hash found for this file",
      variant: "destructive",
    });
    return;
  }

  toast({
    title: "Verifying...",
    description: "Checking transaction on Aptos blockchain",
  });

  try {
    const result = await verifyTransactionApi(file.txHash);

    if (result.success) {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, verified: true } : f))
      );
      toast({
        title: "Verification Complete",
        description: `Confirmed on-chain • VM status: ${result.vm_status}`,
      });
    } else {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, verified: false } : f))
      );
      toast({
        title: "Verification Failed",
        description: `Transaction status: ${result.vm_status}`,
        variant: "destructive",
      });
    }
  } catch (err: any) {
    toast({
      title: "Verification Error",
      description: err?.message || "Could not reach the blockchain verification service",
      variant: "destructive",
    });
  }
};
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto">
        <Header />

        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          fileCount={files.length}
        />

        <DownloadModal
          isOpen={downloadModal.isOpen}
          onClose={() => setDownloadModal((prev) => ({ ...prev, isOpen: false }))}
          fileName={downloadModal.fileName}
          fileHash={downloadModal.fileHash}
          txHash={downloadModal.txHash}
        />

        <main className="p-6 animate-fade-in">
          {activeTab === "upload" && (
            <UploadZone onFileSelect={handleFileSelect} />
          )}

          {activeTab === "files" && (
            <FileList
              files={files}
              onDownload={handleDownload}
              onDelete={handleDelete}
              onVerify={handleVerify}
              // onCopyToDecrypt={handleCopyToDecrypt} // ✅ NEW: Pass handler
            />
          )}

          {activeTab === "decrypt" && (
            <DecryptPanel
              formState={decryptFormState} // ✅ NEW: Pass persisted state
              onFormStateChange={setDecryptFormState} // ✅ NEW: Allow updates
            />
          )}
        </main>
      </div>

      <EncryptionKeyModal
        isOpen={encryptionModal.isOpen}
        onClose={() => setEncryptionModal((prev) => ({ ...prev, isOpen: false }))}
        fileName={encryptionModal.fileName}
        encryptionKey={encryptionModal.encryptionKey}
        fileHash={encryptionModal.fileHash}
      />

      {activeTab === "upload" && (
        <>
          <FeaturesSection />
          <HowItWorksSection />
          <Footer />
        </>
      )}
    </div>
  );
};

export default Index;