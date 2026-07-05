import { useState, useRef } from "react";
import { Upload, FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface UploadZoneProps {
  onFileSelect: (files: FileList) => void | Promise<void>;
}

const UploadZone = ({ onFileSelect }: UploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileSelect(files);
      toast({
        title: "Files Added",
        description: `${files.length} file(s) ready for encryption`,
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files);
      toast({
        title: "Files Added",
        description: `${files.length} file(s) ready for encryption`,
      });
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border-2 border-dashed transition-all duration-300 p-12",
        "flex flex-col items-center justify-center min-h-[400px]",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-muted-foreground/30 hover:border-primary/50 hover:bg-muted/20"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Animated background glow */}
      <div className={cn(
        "absolute inset-0 rounded-2xl transition-opacity duration-500 -z-10",
        isDragging ? "opacity-100" : "opacity-0"
      )}>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-xl" />
      </div>

      {/* Upload Icon */}
      <div className={cn(
        "relative mb-6 transition-all duration-300",
        isDragging && "animate-float"
      )}>
        <div className="w-20 h-20 rounded-2xl bg-muted/50 border border-border flex items-center justify-center">
          <Upload className={cn(
            "w-10 h-10 transition-colors duration-300",
            isDragging ? "text-primary" : "text-muted-foreground"
          )} />
        </div>
        <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-lg -z-10 opacity-50" />
      </div>

      {/* Text */}
      <h3 className="font-display text-xl font-semibold text-foreground mb-2 text-center">
        Drop files here or click to upload
      </h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        All files will be automatically encrypted before storage
      </p>

      {/* Upload Button */}
      <Button
        variant="neon"
        size="lg"
        onClick={handleButtonClick}
        className="px-10"
      >
        <FileUp className="w-5 h-5" />
        Choose Files
      </Button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />

      {/* Supported formats */}
      <p className="text-sm text-muted-foreground mt-8 text-center">
        Supported: Images, PDFs, Videos, Documents (Max 100MB)
      </p>
    </div>
  );
};

export default UploadZone;
