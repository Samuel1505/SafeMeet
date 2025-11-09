"use client";

import { Badge } from "@/components/ui/badge";

interface PartnerLogoProps {
  name: string;
  gradient: string;
}

function PartnerLogo({ name, gradient }: PartnerLogoProps) {
  return (
    <div className="group relative">
      <div className="relative bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
        {/* Gradient Background */}
        <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
        
        {/* Logo/Name */}
        <div className="relative flex items-center justify-center h-16">
          <span className="text-xl font-bold text-muted-foreground group-hover:text-gradient transition-all">
            {name}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Partners() {
  const partners = [
    { name: "Aave", gradient: "bg-gradient-to-br from-blue-500 to-purple-600" },
    { name: "Compound", gradient: "bg-gradient-to-br from-green-500 to-cyan-600" },
    { name: "Uniswap", gradient: "bg-gradient-to-br from-pink-500 to-purple-600" },
    { name: "Curve", gradient: "bg-gradient-to-br from-blue-500 to-cyan-600" },
    { name: "Yearn", gradient: "bg-gradient-to-br from-blue-500 to-blue-600" },
    { name: "Balancer", gradient: "bg-gradient-to-br from-gray-700 to-gray-900" },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-background dark:from-gray-900/20 dark:to-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 gradient-primary text-white">
            Integrations
          </Badge>
          <h2 className="heading-lg mb-4">
            Powered by{" "}
            <span className="text-gradient">Leading DeFi Protocols</span>
          </h2>
          <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
            SafeMeet integrates with the most trusted and battle-tested DeFi protocols on Base to maximize your yields safely.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {partners.map((partner, index) => (
            <PartnerLogo key={index} {...partner} />
          ))}
        </div>

        {/* Trust Indicator */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            All protocols are audited and vetted for security
          </p>
        </div>
      </div>
    </section>
  );
}