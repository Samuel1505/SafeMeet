"use client";

import { Plane, Heart, Home, GraduationCap, Gift, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UseCaseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  exampleGoal: string;
  iconBg: string;
  borderColor: string;
}

function UseCaseCard({ icon, title, description, exampleGoal, iconBg, borderColor }: UseCaseCardProps) {
  return (
    <div className={`group relative bg-black/40 backdrop-blur-sm border ${borderColor} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
      <div className="relative">
        {/* Icon */}
        <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border ${borderColor}`}>
          {icon}
        </div>

        {/* Content */}
        <h3 className="font-bold text-xl mb-2 group-hover:text-gradient transition-all text-white font-mono">{title}</h3>
        <p className="text-sm text-gray-300 mb-4 leading-relaxed font-mono">{description}</p>

        {/* Example Goal */}
        <div className="bg-black/60 rounded-lg px-4 py-3 border border-cyan-500/20">
          <p className="text-xs text-gray-400 mb-1 font-medium font-mono">EXAMPLE GOAL</p>
          <p className="text-sm font-semibold text-cyan-400 font-mono">{exampleGoal}</p>
        </div>
      </div>
    </div>
  );
}

export function UseCases() {
  const useCases = [
    {
      icon: <Plane size={28} className="text-cyan-400" />,
      title: "VACATION FUND",
      description: "Save with friends for that dream trip. Pool money together and earn yield while planning.",
      exampleGoal: "Europe Trip - $5,000 in 12 months",
      iconBg: "bg-cyan-500/20",
      borderColor: "border-cyan-500/20",
    },
    {
      icon: <Heart size={28} className="text-pink-400" />,
      title: "WEDDING SAVINGS",
      description: "Couples and families can save together for the big day with transparent tracking.",
      exampleGoal: "Dream Wedding - $15,000 in 18 months",
      iconBg: "bg-pink-500/20",
      borderColor: "border-pink-500/20",
    },
    {
      icon: <Home size={28} className="text-purple-400" />,
      title: "EMERGENCY FUND",
      description: "Build a safety net with your household. Access funds instantly when you need them.",
      exampleGoal: "6-Month Emergency Fund - $10,000",
      iconBg: "bg-purple-500/20",
      borderColor: "border-purple-500/20",
    },
    {
      icon: <GraduationCap size={28} className="text-amber-400" />,
      title: "EDUCATION FUND",
      description: "Parents and relatives can contribute to a child's education fund together.",
      exampleGoal: "College Fund - $25,000 in 5 years",
      iconBg: "bg-amber-500/20",
      borderColor: "border-amber-500/20",
    },
    {
      icon: <Gift size={28} className="text-cyan-400" />,
      title: "GROUP GIFTS",
      description: "Collect money from multiple people for a special gift or celebration.",
      exampleGoal: "Retirement Gift - $2,000 in 3 months",
      iconBg: "bg-cyan-500/20",
      borderColor: "border-cyan-500/20",
    },
    {
      icon: <Sparkles size={28} className="text-purple-400" />,
      title: "SIDE HUSTLE FUND",
      description: "Save profits from your side business and watch them grow with DeFi yields.",
      exampleGoal: "Business Investment - $8,000 in 10 months",
      iconBg: "bg-purple-500/20",
      borderColor: "border-purple-500/20",
    },
  ];

  return (
    <section className="py-24 bg-linear-to-b from-black to-gray-950 relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
            USE CASES
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            SAVE FOR{" "}
            <span className="text-gradient font-mono">ANYTHING, TOGETHER</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-mono">
            Whether it's a vacation, wedding, or emergency fund, SafeMeet makes group savings simple and rewarding.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => (
            <UseCaseCard key={index} {...useCase} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-base text-gray-300 mb-6 font-mono">
            Have a different savings goal in mind?
          </p>
          <button className="gradient-primary text-black px-8 py-4 rounded-xl font-bold text-base hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all font-mono border border-cyan-400/50">
            CREATE CUSTOM PUDDLE
          </button>
        </div>
      </div>
    </section>
  );
}
