"use client";

import { Users, Zap, Layout, Award, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface FeatureHighlightCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
  iconBg: string;
  accentColor: string;
  borderColor: string;
}

function FeatureHighlightCard({ 
  icon, 
  title, 
  description, 
  benefits, 
  iconBg,
  accentColor,
  borderColor
}: FeatureHighlightCardProps) {
  return (
    <div className={`group relative bg-black/40 backdrop-blur-sm border ${borderColor} rounded-2xl p-8 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 hover:-translate-y-1`}>
      {/* Icon */}
      <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border ${borderColor}`}>
        {icon}
      </div>

      {/* Content */}
      <div>
        <h3 className={`text-2xl font-bold mb-3 group-hover:${accentColor} transition-all font-mono`}>{title}</h3>
        <p className="text-base text-gray-300 mb-6 leading-relaxed font-mono">{description}</p>

        {/* Benefits List */}
        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${accentColor} mt-2 shrink-0`} />
              <span className="text-sm text-gray-400 leading-relaxed font-mono">{benefit}</span>
            </li>
          ))}
        </ul>

        {/* Hover Arrow */}
        <div className="mt-6 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          <span className={accentColor}>LEARN MORE</span>
          <ArrowRight size={16} className={`${accentColor} group-hover:translate-x-1 transition-transform`} />
        </div>
      </div>
    </div>
  );
}

export function Features() {
  const features = [
    {
      icon: <Users size={32} className="text-cyan-400" />,
      title: "GROUP SAVINGS",
      description: "Create savings puddles with friends and family. Pool resources, share goals, and grow together on-chain.",
      benefits: [
        "Invite unlimited members to your puddle",
        "Set collective savings goals and milestones",
        "Real-time contribution tracking",
        "Social accountability features"
      ],
      iconBg: "bg-cyan-500/20",
      accentColor: "text-cyan-400",
      borderColor: "border-cyan-500/20"
    },
    {
      icon: <Zap size={32} className="text-purple-400" />,
      title: "AUTO-YIELD ROUTING",
      description: "Smart AI-powered router that automatically finds the best yield opportunities across Base ecosystem.",
      benefits: [
        "Continuous yield optimization",
        "Risk-adjusted strategy selection",
        "Automatic rebalancing",
        "Gas-efficient transactions"
      ],
      iconBg: "bg-purple-500/20",
      accentColor: "text-purple-400",
      borderColor: "border-purple-500/20"
    },
    {
      icon: <Layout size={32} className="text-pink-400" />,
      title: "GUI MODE",
      description: "Beautiful, intuitive interface that makes DeFi accessible to everyone. No technical knowledge required.",
      benefits: [
        "One-click deposits and withdrawals",
        "Visual portfolio tracking",
        "Mobile-responsive design",
        "Simplified transaction flows"
      ],
      iconBg: "bg-pink-500/20",
      accentColor: "text-pink-400",
      borderColor: "border-pink-500/20"
    },
    {
      icon: <Award size={32} className="text-amber-400" />,
      title: "NFT REWARDS",
      description: "Earn unique NFT badges and achievements as you save. Unlock exclusive perks and benefits.",
      benefits: [
        "Milestone achievement NFTs",
        "Exclusive community access",
        "Boosted yield multipliers",
        "Tradeable reward tokens"
      ],
      iconBg: "bg-amber-500/20",
      accentColor: "text-amber-400",
      borderColor: "border-amber-500/20"
    }
  ];

  return (
    <section id="features" className="py-24 bg-black relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
            <Sparkles size={14} className="mr-1.5" />
            FEATURES
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            EVERYTHING YOU NEED TO{" "}
            <span className="text-gradient font-mono">SAVE SMARTER</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-mono">
            SafeMeet combines the best of DeFi with an intuitive user experience. 
            Save together, earn more, and get rewarded for your financial discipline.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <FeatureHighlightCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              benefits={feature.benefits}
              iconBg={feature.iconBg}
              accentColor={feature.accentColor}
              borderColor={feature.borderColor}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-linear-to-r from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-500/30 backdrop-blur-sm">
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-2 text-white font-mono">READY TO START SAVING?</h3>
              <p className="text-base text-gray-300 font-mono">Join thousands of users already growing their wealth together.</p>
            </div>
            <Button className="gradient-primary text-black px-8 py-6 text-base font-bold hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all whitespace-nowrap font-mono border border-cyan-400/50">
              GET STARTED FREE
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
