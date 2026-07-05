import { Shield, Globe, Key, Zap } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Military-Grade Encryption",
    description: "256-bit AES encryption protects your files.",
  },
  {
    icon: Globe,
    title: "Decentralized Storage",
    description: "Files distributed across thousands of nodes.",
  },
  {
    icon: Key,
    title: "Zero-Knowledge",
    description: "Only you hold the encryption keys.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for rapid uploads and downloads.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-3">
            <span className="text-foreground">Why </span>
            <span className="cyber-gradient">D-LOCK</span>
          </h2>
          <p className="text-muted-foreground">
            Built from the ground up with security and privacy at its core.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card/50 border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
