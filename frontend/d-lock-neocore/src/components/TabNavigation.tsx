import { Upload, Lock, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  fileCount: number;
}

const TabNavigation = ({ activeTab, onTabChange, fileCount }: TabNavigationProps) => {
  const tabs = [
    { id: "upload", label: "Upload & Encrypt", icon: Upload },
    { id: "files", label: `My Files (${fileCount})`, icon: Lock },
    { id: "decrypt", label: "Decrypt File", icon: Unlock },
  ];

  return (
    <nav className="flex flex-wrap gap-3 p-6 pb-0">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "neon" : "glass"}
          size="lg"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "transition-all duration-300",
            activeTab === tab.id && "scale-105"
          )}
        >
          <tab.icon className="w-4 h-4" />
          {tab.label}
        </Button>
      ))}
    </nav>
  );
};

export default TabNavigation;
