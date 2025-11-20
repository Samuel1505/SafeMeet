"use client";

import { Plane, Heart, Home, GraduationCap, Gift, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UseCaseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  exampleGoal: string;
  iconBg: string;
}

function UseCaseCard({ icon, title, description, exampleGoal, iconBg }: UseCaseCardProps) {
  return (
    <div className="group relative bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="relative">
        {/* Icon */}
        <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          {icon}
        </div>

        {/* Content */}
        <h3 className="font-bold text-xl mb-2 group-hover:text-gradient transition-all">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>

        {/* Example Goal */}
        <div className="bg-muted/50 rounded-lg px-4 py-3 border border-border">
          <p className="text-xs text-muted-foreground mb-1 font-medium">Example Goal</p>
          <p className="text-sm font-semibold text-foreground">{exampleGoal}</p>
        </div>
      </div>
    </div>
  );
}

export function UseCases() {
  const useCases = [
    {
      icon: <Plane size={28} className="text-emerald-600 dark:text-emerald-400" />,
      title: "Vacation Fund",
      description: "Save with friends for that dream trip. Pool money together and earn yield while planning.",
      exampleGoal: "Europe Trip - $5,000 in 12 months",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    },
    {
      icon: <Heart size={28} className="text-pink-600 dark:text-pink-400" />,
      title: "Wedding Savings",
      description: "Couples and families can save together for the big day with transparent tracking.",
      exampleGoal: "Dream Wedding - $15,000 in 18 months",
      iconBg: "bg-pink-100 dark:bg-pink-900/30",
    },
    {
      icon: <Home size={28} className="text-teal-600 dark:text-teal-400" />,
      title: "Emergency Fund",
      description: "Build a safety net with your household. Access funds instantly when you need them.",
      exampleGoal: "6-Month Emergency Fund - $10,000",
      iconBg: "bg-teal-100 dark:bg-teal-900/30",
    },
    {
      icon: <GraduationCap size={28} className="text-purple-600 dark:text-purple-400" />,
      title: "Education Fund",
      description: "Parents and relatives can contribute to a child's education fund together.",
      exampleGoal: "College Fund - $25,000 in 5 years",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: <Gift size={28} className="text-amber-600 dark:text-amber-400" />,
      title: "Group Gifts",
      description: "Collect money from multiple people for a special gift or celebration.",
      exampleGoal: "Retirement Gift - $2,000 in 3 months",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      icon: <Sparkles size={28} className="text-indigo-600 dark:text-indigo-400" />,
      title: "Side Hustle Fund",
      description: "Save profits from your side business and watch them grow with DeFi yields.",
      exampleGoal: "Business Investment - $8,000 in 10 months",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/30",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-teal-200/10 dark:bg-teal-900/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-purple-200/10 dark:bg-purple-900/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-0">
            Use Cases
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Save for{" "}
            <span className="text-gradient">Anything, Together</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
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
          <p className="text-base text-muted-foreground mb-6">
            Have a different savings goal in mind?
          </p>
          <button className="gradient-primary text-white px-8 py-4 rounded-xl font-semibold text-base hover:shadow-lg transition-all">
            Create Custom Puddle
          </button>
        </div>
      </div>
    </section>
  );
}
