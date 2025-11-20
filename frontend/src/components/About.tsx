"use client";

import { Users, Zap, Layout, ArrowRight, CheckCircle2, Coins, Shield, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg: string;
}

function FeatureCard({ icon, title, description, iconBg }: FeatureCardProps) {
  return (
    <div className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
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
      <div className="shrink-0">
        <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-lg">
          {number}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-emerald-600 dark:text-emerald-400">{icon}</div>
          <h4 className="text-xl font-bold">{title}</h4>
        </div>
        <p className="text-base text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="py-24 bg-linear-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0">
            How It Works
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple Savings,{" "}
            <span className="text-gradient">Powerful Results</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            SafeMeet makes DeFi savings as easy as using a traditional bank account. 
            No crypto expertise required.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={<Users size={32} className="text-emerald-600 dark:text-emerald-400" />}
            title="Group Saving"
            description="Create or join savings 'puddles' with friends and family. Pool your stablecoins together and watch your collective savings grow."
            iconBg="bg-emerald-100 dark:bg-emerald-900/30"
          />
          <FeatureCard
            icon={<Zap size={32} className="text-purple-600 dark:text-purple-400" />}
            title="Smart Yield Routing"
            description="Our intelligent router automatically finds the safest, highest-yield opportunities across Base. Your money works harder, automatically."
            iconBg="bg-purple-100 dark:bg-purple-900/30"
          />
          <FeatureCard
            icon={<Layout size={32} className="text-amber-600 dark:text-amber-400" />}
            title="GUI Mode"
            description="Beautiful, intuitive interface that hides all the complexity. Manage your savings with simple clicks—no wallet addresses or gas fees to worry about."
            iconBg="bg-amber-100 dark:bg-amber-900/30"
          />
        </div>

        {/* How It Works Steps */}
        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-lg">
          <h3 className="text-3xl font-bold mb-12 text-center">Get Started in 3 Simple Steps</h3>
          
          <div className="space-y-10 max-w-3xl mx-auto">
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
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <CheckCircle2 size={28} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Audited Smart Contracts</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">Security-first architecture reviewed by top auditors</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 size={28} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Non-Custodial</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">You always maintain full control of your funds</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 size={28} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1">Transparent Fees</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">No hidden costs, clear fee structure</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-linear-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-8 border border-border">
            <Shield size={48} className="text-emerald-600 dark:text-emerald-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Bank-Grade Security</h3>
            <p className="text-base text-muted-foreground mb-6 leading-relaxed">
              Built on Base, a secure Layer 2 solution by Coinbase. Your funds are protected by battle-tested smart contracts and multi-signature wallets.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                <span>Multi-signature security</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                <span>Regular security audits</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                <span>Insurance coverage</span>
              </li>
            </ul>
          </div>

          <div className="bg-linear-to-br from-purple-50 to-amber-50 dark:from-purple-950/20 dark:to-amber-950/20 rounded-2xl p-8 border border-border">
            <TrendingUp size={48} className="text-purple-600 dark:text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3">Optimized Returns</h3>
            <p className="text-base text-muted-foreground mb-6 leading-relaxed">
              Our smart router analyzes dozens of DeFi protocols in real-time to maximize your yield while minimizing risk.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                <span>Automated rebalancing</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                <span>Risk-adjusted strategies</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                <span>Compound interest optimization</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
