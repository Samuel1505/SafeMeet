"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Users, TrendingUp, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-cyan-950/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="flex items-center gap-2">
              <Badge className="gradient-primary text-white px-4 py-1.5 text-sm font-medium">
                <Sparkles size={14} className="mr-1.5" />
                Built on Base
              </Badge>
            </div>

            {/* Heading */}
            <div className="space-y-4">
              <h1 className="heading-xl text-foreground">
                Save Together,{" "}
                <span className="text-gradient">Grow Together</span>
              </h1>
              <p className="body-lg text-muted-foreground max-w-xl">
                SafeMeet is your group piggy bank for the Web3 era. Drop stablecoins into shared "puddles" 
                and watch our smart router find the safest, best-yield opportunities on-chain.
              </p>
            </div>

            {/* Value Props */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <Shield size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Secure</h3>
                  <p className="text-xs text-muted-foreground">Bank-grade security</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Users size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Social</h3>
                  <p className="text-xs text-muted-foreground">Save with friends</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={20} className="text-cyan-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Smart Yield</h3>
                  <p className="text-xs text-muted-foreground">Auto-optimized</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gradient-primary text-white text-base font-semibold group">
                Start Saving Now
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-base font-semibold">
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="text-center">
                <div className="heading-sm text-foreground">$2.5M+</div>
                <div className="text-xs text-muted-foreground">Total Saved</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="heading-sm text-foreground">1,200+</div>
                <div className="text-xs text-muted-foreground">Active Users</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div className="text-center">
                <div className="heading-sm text-foreground">98%</div>
                <div className="text-xs text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative lg:block hidden">
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1565350897149-38dfafa81d83?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxjb2xsYWJvcmF0aW9uJTIwdGVhbXdvcmslMjBmaW5hbmNlJTIwZGlnaXRhbHxlbnwwfDB8fHwxNzYyNDUxMzAwfDA&ixlib=rb-4.1.0&q=85"
                  alt="Modern 3D illustration of people collaborating around digital coins or savings concept, colorful, friendly, representing group savings and community - Van Tay Media on Unsplash"
                  className="w-full h-auto"
                />
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
                    <TrendingUp size={24} color="white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">+12.5% APY</div>
                    <div className="text-xs text-muted-foreground">This Month</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 animate-float delay-500">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Users size={24} className="text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold">5 Friends</div>
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
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
}