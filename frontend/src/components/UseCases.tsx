"use client";

import { Plane, Heart, Home, GraduationCap, Gift, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UseCaseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  exampleGoal: string;
  gradient: string;
  iconBg: string;
}

function UseCaseCard({ icon, title, description, exampleGoal, gradient, iconBg }: UseCaseCardProps) {
  return (
    <div className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Gradient Accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
      
      <div className="relative">
        {/* Icon */}
        <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>

        {/* Content */}
        <h3 className="font-semibold text-lg mb-2 group-hover:text-gradient transition-all">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>

        {/* Example Goal */}
        <div className="bg-muted/50 rounded-lg px-3 py-2">
          <p className="text-xs text-muted-foreground mb-1">Example Goal</p>
          <p className="text-sm font-semibold">{exampleGoal}</p>
        </div>
      </div>
    </div>
  );
}

export function UseCases() {
  const useCases = [
    {
      icon: <Plane size={28} className="text-blue-600 dark:text-blue-400" />,
      title: "Vacation Fund",
      description: "Save with friends for that dream trip. Pool money together and earn yield while planning.",
      exampleGoal: "Europe Trip - $5,000 in 12 months",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: <Heart size={28} className="text-pink-600 dark:text-pink-400" />,
      title: "Wedding Savings",
      description: "Couples and families can save together for the big day with transparent tracking.",
      exampleGoal: "Dream Wedding - $15,000 in 18 months",
      gradient: "bg-gradient-to-br from-pink-500 to-pink-600",
      iconBg: "bg-pink-100 dark:bg-pink-900/30",
    },
    {
      icon: <Home size={28} className="text-green-600 dark:text-green-400" />,
      title: "Emergency Fund",
      description: "Build a safety net with your household. Access funds instantly when you need them.",
      exampleGoal: "6-Month Emergency Fund - $10,000",
      gradient: "bg-gradient-to-br from-green-500 to-green-600",
      iconBg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      icon: <GraduationCap size={28} className="text-purple-600 dark:text-purple-400" />,
      title: "Education Fund",
      description: "Parents and relatives can contribute to a child's education fund together.",
      exampleGoal: "College Fund - $25,000 in 5 years",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: <Gift size={28} className="text-amber-600 dark:text-amber-400" />,
      title: "Group Gifts",
      description: "Collect money from multiple people for a special gift or celebration.",
      exampleGoal: "Retirement Gift - $2,000 in 3 months",
      gradient: "bg-gradient-to-br from-amber-500 to-amber-600",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      icon: <Sparkles size={28} className="text-cyan-600 dark:text-cyan-400" />,
      title: "Side Hustle Fund",
      description: "Save profits from your side business and watch them grow with DeFi yields.",
      exampleGoal: "Business Investment - $8,000 in 10 months",
      gradient: "bg-gradient-to-br from-cyan-500 to-cyan-600",
      iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
    },
  ];

  return (
    <section className="py-24 bg-linear-to-b from-background to-gray-50 dark:to-gray-900/20 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 gradient-primary text-white">
            Use Cases
          </Badge>
          <h2 className="heading-lg mb-4">
            Save for{" "}
            <span className="text-gradient">Anything, Together</span>
          </h2>
          <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
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
          <p className="body-md text-muted-foreground mb-4">
            Have a different savings goal in mind?
          </p>
          <button className="gradient-primary text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all">
            Create Custom Puddle
          </button>
        </div>
      </div>
    </section>
  );
}