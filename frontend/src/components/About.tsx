"use client";

import { Users, Zap, Layout, ArrowRight, CheckCircle2, Coins, Shield, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg: string;
  borderColor: string;
}

function FeatureCard({ icon, title, description, iconBg, borderColor }: FeatureCardProps) {
  return (
    <div className={`group relative bg-black/40 backdrop-blur-sm border ${borderColor} rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
      <div className={`w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border ${borderColor}`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-white font-mono">{title}</h3>
      <p className="text-base text-gray-300 leading-relaxed font-mono">{description}</p>
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
        <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-lg shadow-lg border border-cyan-400/50">
          {number}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-cyan-400">{icon}</div>
          <h4 className="text-xl font-bold text-white font-mono">{title}</h4>
        </div>
        <p className="text-base text-gray-300 leading-relaxed font-mono">{description}</p>
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="py-24 bg-linear-to-b from-black to-gray-950 relative">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
            HOW IT WORKS
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            SIMPLE SAVINGS,{" "}
            <span className="text-gradient font-mono">POWERFUL RESULTS</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-mono">
            SafeMeet makes DeFi savings as easy as using a traditional bank account. 
            No crypto expertise required.
          </p>
        </div>

        {/* Core Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={<Users size={32} className="text-cyan-400" />}
            title="GROUP SAVING"
            description="Create or join savings 'puddles' with friends and family. Pool your stablecoins together and watch your collective savings grow."
            iconBg="bg-cyan-500/20"
            borderColor="border-cyan-500/20"
          />
          <FeatureCard
            icon={<Zap size={32} className="text-purple-400" />}
            title="SMART YIELD ROUTING"
            description="Our intelligent router automatically finds the safest, highest-yield opportunities across Base. Your money works harder, automatically."
            iconBg="bg-purple-500/20"
            borderColor="border-purple-500/20"
          />
          <FeatureCard
            icon={<Layout size={32} className="text-pink-400" />}
            title="GUI MODE"
            description="Beautiful, intuitive interface that hides all the complexity. Manage your savings with simple clicks—no wallet addresses or gas fees to worry about."
            iconBg="bg-pink-500/20"
            borderColor="border-pink-500/20"
          />
        </div>

        {/* How It Works Steps */}
        <div className="bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-3xl p-8 md:p-12 shadow-xl">
          <h3 className="text-3xl font-bold mb-12 text-center text-white font-mono">GET STARTED IN 3 SIMPLE STEPS</h3>
          
          <div className="space-y-10 max-w-3xl mx-auto">
            <HowItWorksStep
              number="1"
              title="CREATE YOUR PUDDLE"
              description="Set up a savings group in seconds. Invite friends or join an existing puddle. Choose your savings goal and timeline."
              icon={<Users size={24} />}
            />
            
            <div className="flex justify-center">
              <ArrowRight size={24} className="text-cyan-400 rotate-90" />
            </div>

            <HowItWorksStep
              number="2"
              title="DEPOSIT STABLECOINS"
              description="Add USDC, USDT, or other stablecoins to your puddle. Our smart contracts keep everything secure and transparent on Base blockchain."
              icon={<Coins size={24} />}
            />
            
            <div className="flex justify-center">
              <ArrowRight size={24} className="text-cyan-400 rotate-90" />
            </div>

            <HowItWorksStep
              number="3"
              title="WATCH IT GROW"
              description="Our AI-powered router continuously finds the best yield opportunities. Track your earnings in real-time with beautiful dashboards."
              icon={<TrendingUp size={24} />}
            />
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 pt-8 border-t border-cyan-500/20">
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <CheckCircle2 size={28} className="text-cyan-400 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1 text-white font-mono">AUDITED SMART CONTRACTS</h4>
                  <p className="text-sm text-gray-400 leading-relaxed font-mono">Security-first architecture reviewed by top auditors</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 size={28} className="text-cyan-400 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1 text-white font-mono">NON-CUSTODIAL</h4>
                  <p className="text-sm text-gray-400 leading-relaxed font-mono">You always maintain full control of your funds</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle2 size={28} className="text-cyan-400 shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-lg mb-1 text-white font-mono">TRANSPARENT FEES</h4>
                  <p className="text-sm text-gray-400 leading-relaxed font-mono">No hidden costs, clear fee structure</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <div className="bg-linear-to-br from-cyan-500/10 to-purple-500/10 rounded-2xl p-8 border border-cyan-500/30 backdrop-blur-sm">
            <Shield size={48} className="text-cyan-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-white font-mono">BANK-GRADE SECURITY</h3>
            <p className="text-base text-gray-300 mb-6 leading-relaxed font-mono">
              Built on Base, a secure Layer 2 solution by Coinbase. Your funds are protected by battle-tested smart contracts and multi-signature wallets.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm font-mono">
                <CheckCircle2 size={20} className="text-cyan-400" />
                <span className="text-gray-300">Multi-signature security</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-mono">
                <CheckCircle2 size={20} className="text-cyan-400" />
                <span className="text-gray-300">Regular security audits</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-mono">
                <CheckCircle2 size={20} className="text-cyan-400" />
                <span className="text-gray-300">Insurance coverage</span>
              </li>
            </ul>
          </div>

          <div className="bg-linear-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border border-purple-500/30 backdrop-blur-sm">
            <TrendingUp size={48} className="text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold mb-3 text-white font-mono">OPTIMIZED RETURNS</h3>
            <p className="text-base text-gray-300 mb-6 leading-relaxed font-mono">
              Our smart router analyzes dozens of DeFi protocols in real-time to maximize your yield while minimizing risk.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm font-mono">
                <CheckCircle2 size={20} className="text-cyan-400" />
                <span className="text-gray-300">Automated rebalancing</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-mono">
                <CheckCircle2 size={20} className="text-cyan-400" />
                <span className="text-gray-300">Risk-adjusted strategies</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-mono">
                <CheckCircle2 size={20} className="text-cyan-400" />
                <span className="text-gray-300">Compound interest optimization</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
