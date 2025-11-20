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
}

function FeatureHighlightCard({ 
  icon, 
  title, 
  description, 
  benefits, 
  iconBg,
  accentColor 
}: FeatureHighlightCardProps) {
  return (
    <div className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Icon */}
      <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>

      {/* Content */}
      <div>
        <h3 className="text-2xl font-bold mb-3 group-hover:text-gradient transition-all">{title}</h3>
        <p className="text-base text-muted-foreground mb-6 leading-relaxed">{description}</p>

        {/* Benefits List */}
        <ul className="space-y-3">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className={`w-1.5 h-1.5 rounded-full ${accentColor} mt-2 shrink-0`} />
              <span className="text-sm text-muted-foreground leading-relaxed">{benefit}</span>
            </li>
          ))}
        </ul>

        {/* Hover Arrow */}
        <div className="mt-6 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          <span className={accentColor}>Learn more</span>
          <ArrowRight size={16} className={`${accentColor} group-hover:translate-x-1 transition-transform`} />
        </div>
      </div>
    </div>
  );
}

export function Features() {
  const features = [
    {
      icon: <Users size={32} className="text-emerald-600 dark:text-emerald-400" />,
      title: "Group Savings",
      description: "Create savings puddles with friends and family. Pool resources, share goals, and grow together.",
      benefits: [
        "Invite unlimited members to your puddle",
        "Set collective savings goals and milestones",
        "Real-time contribution tracking",
        "Social accountability features"
      ],
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
      accentColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      icon: <Zap size={32} className="text-purple-600 dark:text-purple-400" />,
      title: "Auto-Yield Routing",
      description: "Smart AI-powered router that automatically finds the best yield opportunities across Base ecosystem.",
      benefits: [
        "Continuous yield optimization",
        "Risk-adjusted strategy selection",
        "Automatic rebalancing",
        "Gas-efficient transactions"
      ],
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      accentColor: "text-purple-600 dark:text-purple-400"
    },
    {
      icon: <Layout size={32} className="text-amber-600 dark:text-amber-400" />,
      title: "GUI Mode",
      description: "Beautiful, intuitive interface that makes DeFi accessible to everyone. No technical knowledge required.",
      benefits: [
        "One-click deposits and withdrawals",
        "Visual portfolio tracking",
        "Mobile-responsive design",
        "Simplified transaction flows"
      ],
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
      accentColor: "text-amber-600 dark:text-amber-400"
    },
    {
      icon: <Award size={32} className="text-teal-600 dark:text-teal-400" />,
      title: "NFT Rewards",
      description: "Earn unique NFT badges and achievements as you save. Unlock exclusive perks and benefits.",
      benefits: [
        "Milestone achievement NFTs",
        "Exclusive community access",
        "Boosted yield multipliers",
        "Tradeable reward tokens"
      ],
      iconBg: "bg-teal-100 dark:bg-teal-900/30",
      accentColor: "text-teal-600 dark:text-teal-400"
    }
  ];

  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-emerald-200/10 dark:bg-emerald-900/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-purple-200/10 dark:bg-purple-900/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0">
            <Sparkles size={14} className="mr-1.5" />
            Features
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Save Smarter</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-6 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-8 border border-border">
            <div className="text-left">
              <h3 className="text-2xl font-bold mb-2">Ready to start saving?</h3>
              <p className="text-base text-muted-foreground">Join thousands of users already growing their wealth together.</p>
            </div>
            <Button className="gradient-primary text-white px-8 py-6 text-base font-semibold hover:shadow-lg transition-all whitespace-nowrap">
              Get Started Free
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
