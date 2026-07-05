import { Upload, Lock, Database, Download } from "lucide-react";

const steps = [
  { icon: Upload, title: "Upload", description: "Select your file" },
  { icon: Lock, title: "Encrypt", description: "AES-256 encryption" },
  { icon: Database, title: "Store", description: "Distributed globally" },
  { icon: Download, title: "Retrieve", description: "Access anytime" },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-4xl font-bold mb-3">
            <span className="text-foreground">How It </span>
            <span className="cyber-gradient">Works</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-4 md:flex-col md:text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <step.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold">{step.title}</div>
                <div className="text-sm text-muted-foreground">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block w-12 h-px bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
