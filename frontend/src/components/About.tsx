"use client";

import { Users, Zap, Layout, ArrowRight, CheckCircle2, Coins, Shield, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}

function FeatureCard({ icon, title, description, gradient }: FeatureCardProps) {
  return (
    <div className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className={`w-16 h-16 rounded-xl ${gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="heading-sm mb-3">{title}</h3>
      <p className="body-md text-muted-foreground">{description}</p>
    </div>
  );
}

interface HowItWorksStepProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

function HowItWorksStep({ number, title, description, icon }: HowItWorksStepProps) {
  return (
    <div className="flex gap-6 items-start">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
          {number}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-primary">{icon}</div>
          <h4 className="heading-sm">{title}</h4>
        </div>
        <p className="body-md text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-background to-gray-50 dark:to-gray-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5">How It Works</Badge>
          <h2 className="heading-lg mb-4">
            Simple Savings,{" "}
            <span className="text-gradient">Powerful Results</span>
          </h2>
          <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
            SafeMeet makes DeFi savings as easy as using a traditional bank account. 
            No crypto expertise required.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={<Users size={32} color="white" />}
            title="Group Saving"
            description="Create or join savings 'puddles' with friends and family. Pool your stablecoins together and watch your collective savings grow."
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <FeatureCard
            icon={<Zap size={32} color="white" />}
            title="Smart Yield Routing"
            description="Our intelligent router automatically finds the safest, highest-yield opportunities across Base. Your money works harder, automatically."
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <FeatureCard
            icon={<Layout size={32} color="white" />}
            title="GUI Mode"
            description="Beautiful, intuitive interface that hides all the complexity. Manage your savings with simple clicks—no wallet addresses or gas fees to worry about."
            gradient="bg-gradient-to-br from-cyan-500 to-cyan-600"
          />
        </div>

        {/* How It Works Steps */}
        <div className="bg-card border border-border rounded-3xl p-8 md:p-12">
          <h3 className="heading-md mb-8 text-center">Get Started in 3 Simple Steps</h3>
          
          <div className="space-y-8 max-w-3xl mx-auto">
            <HowItWorksStep
              number="1"
              title="Create Your Puddle"
              description="Set up a savings group in seconds. Invite friends or join an existing puddle. Choose your savings goal and timeline."
              icon={<Users size={24} />}
            />
            
            <div className="flex justify-center">
              <ArrowRight size={24} className="text-muted-foreground rotate-90" />
            </div>

            <HowItWorksStep
              number="2"
              title="Deposit Stablecoins"
              description="Add USDC, USDT, or other stablecoins to your puddle. Our smart contracts keep everything secure and transparent on Base blockchain."
              icon={<Coins size={24} />}
            />
            
            <div className="flex justify-center">
              <ArrowRight size={24} className="text-muted-foreground rotate-90" />
            </div>

            <HowItWorksStep
              number="3"
              title="Watch It Grow"
              description="Our AI-powered router continuously finds the best yield opportunities. Track your earnings in real-time with beautiful dashboards."
              icon={<TrendingUp size={24} />}
            />
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={24} className="text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Audited Smart Contracts</h4>
                  <p className="text-sm text-muted-foreground">Security-first architecture reviewed by top auditors</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={24} className="text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Non-Custodial</h4>
                  <p className="text-sm text-muted-foreground">You always maintain full control of your funds</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 size={24} className="text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold mb-1">Transparent Fees</h4>
                  <p className="text-sm text-muted-foreground">No hidden costs, clear fee structure</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl p-8">
            <Shield size={40} className="text-blue-600 dark:text-blue-400 mb-4" />
            <h3 className="heading-sm mb-3">Bank-Grade Security</h3>
            <p className="body-md text-muted-foreground mb-4">
              Built on Base, a secure Layer 2 solution by Coinbase. Your funds are protected by battle-tested smart contracts and multi-signature wallets.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Multi-signature security</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Regular security audits</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Insurance coverage</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-purple-950/20 dark:to-cyan-950/20 rounded-2xl p-8">
            <TrendingUp size={40} className="text-purple-600 dark:text-purple-400 mb-4" />
            <h3 className="heading-sm mb-3">Optimized Returns</h3>
            <p className="body-md text-muted-foreground mb-4">
              Our smart router analyzes dozens of DeFi protocols in real-time to maximize your yield while minimizing risk.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Automated rebalancing</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Risk-adjusted strategies</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <CheckCircle2 size={16} className="text-green-500" />
                <span>Compound interest optimization</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}