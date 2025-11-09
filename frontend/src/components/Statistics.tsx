"use client";

import { TrendingUp, Users, Wallet, Award } from "lucide-react";

interface StatCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  gradient: string;
  iconBg: string;
}

function StatCard({ icon, value, label, gradient, iconBg }: StatCardProps) {
  return (
    <div className="group relative">
      {/* Card */}
      <div className="relative bg-card border border-border rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
        {/* Gradient Background */}
        <div className={`absolute inset-0 ${gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
        
        {/* Icon */}
        <div className={`relative w-16 h-16 ${iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>

        {/* Value */}
        <div className="relative">
          <div className="heading-lg text-gradient mb-2">{value}</div>
          <p className="body-md text-muted-foreground">{label}</p>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-blue-500/5 to-transparent rounded-tl-full" />
      </div>
    </div>
  );
}

export function Statistics() {
  const stats = [
    {
      icon: <Wallet size={32} className="text-blue-600 dark:text-blue-400" />,
      value: "$2.5M+",
      label: "Total Value Locked",
      gradient: "bg-gradient-to-br from-blue-500 to-blue-600",
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: <Users size={32} className="text-purple-600 dark:text-purple-400" />,
      value: "1,200+",
      label: "Active Puddles",
      gradient: "bg-gradient-to-br from-purple-500 to-purple-600",
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: <TrendingUp size={32} className="text-cyan-600 dark:text-cyan-400" />,
      value: "12.5%",
      label: "Average APY",
      gradient: "bg-gradient-to-br from-cyan-500 to-cyan-600",
      iconBg: "bg-cyan-100 dark:bg-cyan-900/30",
    },
    {
      icon: <Award size={32} className="text-amber-600 dark:text-amber-400" />,
      value: "98%",
      label: "User Satisfaction",
      gradient: "bg-gradient-to-br from-amber-500 to-amber-600",
      iconBg: "bg-amber-100 dark:bg-amber-900/30",
    },
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-cyan-50/50 dark:from-blue-950/10 dark:via-purple-950/10 dark:to-cyan-950/10" />
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">
            Growing Fast,{" "}
            <span className="text-gradient">Trusted by Many</span>
          </h2>
          <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
            Real numbers from real savers building their financial future together.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>

      <style jsx>{`
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
}