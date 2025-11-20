"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Users, TrendingUp, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Subtle Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 dark:from-emerald-950/10 dark:via-background dark:to-teal-950/10" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-teal-200/20 dark:bg-teal-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex">
              <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 text-sm font-medium border-0">
                <Sparkles size={14} className="mr-1.5" />
                Built on Base
              </Badge>
            </div>

            {/* Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
                Save Together,{" "}
                <span className="text-gradient">Grow Together</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
                SafeMeet is your group savings platform for the Web3 era. Pool stablecoins with friends 
                and watch our smart router optimize yields automatically.
              </p>
            </div>

            {/* Value Props */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Shield size={24} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-semibold text-base">Secure</h3>
                <p className="text-sm text-muted-foreground">Bank-grade security</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Users size={24} className="text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-base">Social</h3>
                <p className="text-sm text-muted-foreground">Save with friends</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <TrendingUp size={24} className="text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-base">Smart Yield</h3>
                <p className="text-sm text-muted-foreground">Auto-optimized</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gradient-primary text-white text-base font-semibold h-12 px-8 hover:shadow-lg transition-all">
                Start Saving Now
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-base font-semibold h-12 px-8 border-2">
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 pt-6">
              <div>
                <div className="text-3xl font-bold text-foreground">$2.5M+</div>
                <div className="text-sm text-muted-foreground mt-1">Total Saved</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-3xl font-bold text-foreground">1,200+</div>
                <div className="text-sm text-muted-foreground mt-1">Active Users</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-3xl font-bold text-foreground">98%</div>
                <div className="text-sm text-muted-foreground mt-1">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative lg:block hidden">
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border">
                <img
                  src="https://images.unsplash.com/photo-1565350897149-38dfafa81d83?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxjb2xsYWJvcmF0aW9uJTIwdGVhbXdvcmslMjBmaW5hbmNlJTIwZGlnaXRhbHxlbnwwfDB8fHwxNzYyNDUxMzAwfDA&ixlib=rb-4.1.0&q=85"
                  alt="Modern 3D illustration of people collaborating around digital coins or savings concept, colorful, friendly, representing group savings and community - Van Tay Media on Unsplash"
                  className="w-full h-auto"
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-card border border-border rounded-2xl shadow-xl p-5 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center">
                    <TrendingUp size={28} color="white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">+12.5% APY</div>
                    <div className="text-xs text-muted-foreground">This Month</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-card border border-border rounded-2xl shadow-xl p-5 animate-float delay-500">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Users size={28} className="text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">5 Friends</div>
                    <div className="text-xs text-muted-foreground">In Your Puddle</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </section>
  );
}
