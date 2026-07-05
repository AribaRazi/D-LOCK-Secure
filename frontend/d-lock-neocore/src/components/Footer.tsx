import { Lock, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-8 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <span className="font-bold">
              <span className="neon-text">D</span>
              <span className="text-foreground">-LOCK</span>
            </span>
          </a>
          
          <p className="text-sm text-muted-foreground">
            Decentralized file storage • Built for the future
          </p>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="w-5 h-5" />
            <span className="text-sm">View on GitHub</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
