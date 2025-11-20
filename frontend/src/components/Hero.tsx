"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Shield, Users, TrendingUp, Sparkles, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 scanline">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 -z-10 grid-pattern opacity-30" />
      
      {/* Neon Glow Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex">
              <Badge className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-4 py-1.5 text-sm font-medium font-mono neon-glow">
                <Zap size={14} className="mr-1.5" />
                BUILT ON BASE
              </Badge>
            </div>

            {/* Heading with Glitch Effect */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight">
                <span className="block">SAVE TOGETHER,</span>
                <span className="text-gradient block font-mono tracking-wider" style={{ textShadow: '0 0 20px rgba(0, 240, 255, 0.5)' }}>
                  GROW TOGETHER
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-xl leading-relaxed font-mono">
                SafeMeet is your decentralized group savings platform. Pool stablecoins with friends 
                and watch our smart router optimize yields on-chain.
              </p>
            </div>

            {/* Value Props */}
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex flex-col gap-3 p-4 rounded-xl border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm hover:border-cyan-500/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                  <Shield size={24} className="text-cyan-400" />
                </div>
                <h3 className="font-bold text-base text-white font-mono">SECURE</h3>
                <p className="text-xs text-gray-400 font-mono">Bank-grade security</p>
              </div>
              <div className="flex flex-col gap-3 p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 backdrop-blur-sm hover:border-purple-500/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <Users size={24} className="text-purple-400" />
                </div>
                <h3 className="font-bold text-base text-white font-mono">SOCIAL</h3>
                <p className="text-xs text-gray-400 font-mono">Save with friends</p>
              </div>
              <div className="flex flex-col gap-3 p-4 rounded-xl border border-pink-500/20 bg-pink-500/5 backdrop-blur-sm hover:border-pink-500/50 transition-all">
                <div className="w-12 h-12 rounded-xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center">
                  <TrendingUp size={24} className="text-pink-400" />
                </div>
                <h3 className="font-bold text-base text-white font-mono">SMART YIELD</h3>
                <p className="text-xs text-gray-400 font-mono">Auto-optimized</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="gradient-primary text-black text-base font-bold h-12 px-8 hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all font-mono border border-cyan-400/50">
                CONNECT WALLET
                <ArrowRight size={18} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-base font-bold h-12 px-8 border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-mono">
                VIEW DOCS
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-8 pt-6 border-t border-cyan-500/20">
              <div>
                <div className="text-3xl font-bold text-cyan-400 font-mono">$2.5M+</div>
                <div className="text-sm text-gray-400 mt-1 font-mono">TOTAL SAVED</div>
              </div>
              <div className="w-px h-12 bg-cyan-500/30" />
              <div>
                <div className="text-3xl font-bold text-purple-400 font-mono">1,200+</div>
                <div className="text-sm text-gray-400 mt-1 font-mono">ACTIVE USERS</div>
              </div>
              <div className="w-px h-12 bg-purple-500/30" />
              <div>
                <div className="text-3xl font-bold text-pink-400 font-mono">98%</div>
                <div className="text-sm text-gray-400 mt-1 font-mono">SATISFACTION</div>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative lg:block hidden">
            <div className="relative">
              {/* Main Image with Glow */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/30">
                <div className="absolute inset-0 bg-linear-to-br from-cyan-500/20 to-purple-500/20 blur-2xl -z-10" />
                <img
                  src="https://images.unsplash.com/photo-1565350897149-38dfafa81d83?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxjb2xsYWJvcmF0aW9uJTIwdGVhbXdvcmslMjBmaW5hbmNlJTIwZGlnaXRhbHxlbnwwfDB8fHwxNzYyNDUxMzAwfDA&ixlib=rb-4.1.0&q=85"
                  alt="Modern 3D illustration of people collaborating around digital coins or savings concept"
                  className="w-full h-auto relative z-10"
                />
              </div>

              {/* Floating Cards with Neon Glow */}
              <div className="absolute -top-4 -left-4 bg-black/80 backdrop-blur-md border border-cyan-500/50 rounded-2xl shadow-xl p-5 animate-float neon-glow" style={{ color: '#00f0ff' }}>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center border border-cyan-400/50">
                    <TrendingUp size={28} color="white" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-cyan-400 font-mono">+12.5% APY</div>
                    <div className="text-xs text-gray-400 font-mono">THIS MONTH</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-black/80 backdrop-blur-md border border-purple-500/50 rounded-2xl shadow-xl p-5 animate-float delay-500 neon-glow" style={{ color: '#8b5cf6' }}>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/20 border border-purple-500/50 flex items-center justify-center">
                    <Users size={28} className="text-purple-400" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-400 font-mono">5 FRIENDS</div>
                    <div className="text-xs text-gray-400 font-mono">IN YOUR PUDDLE</div>
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
            transform: translateY(0px) translateX(0px);
          }
          33% {
            transform: translateY(-15px) translateX(10px);
          }
          66% {
            transform: translateY(10px) translateX(-10px);
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
