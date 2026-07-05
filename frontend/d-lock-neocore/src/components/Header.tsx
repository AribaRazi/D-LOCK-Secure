import { Shield } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between border-b border-border/30">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-12 h-12 rounded-lg border-2 border-primary/60 flex items-center justify-center bg-card">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <div className="absolute inset-0 rounded-lg bg-primary/20 blur-md -z-10" />
        </div>
        <div>
          <h1 className="font-display text-xl font-bold text-foreground tracking-wide">
            D-LOCK
          </h1>
          <p className="text-sm text-muted-foreground">
            Blockchain Encrypted Storage
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-neon-cyan/40 bg-neon-cyan/5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neon-cyan"></span>
        </span>
        <span className="text-sm font-medium text-neon-cyan">
          Blockchain Active
        </span>
      </div>
    </header>
  );
};

export default Header;
