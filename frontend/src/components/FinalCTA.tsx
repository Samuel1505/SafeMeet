"use client";

import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="py-24 bg-black relative overflow-hidden scanline">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 via-black to-purple-500/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-3xl p-12 md:p-16 overflow-hidden shadow-2xl">
          {/* Gradient Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-3xl" />
          
          <div className="relative text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-cyan-500/20 to-purple-500/20 rounded-full px-5 py-2 mb-6 border border-cyan-500/30 backdrop-blur-sm">
              <Sparkles size={18} className="text-cyan-400" />
              <span className="text-sm font-bold text-cyan-400 font-mono">START SAVING TODAY</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
              READY TO{" "}
              <span className="text-gradient font-mono">GROW YOUR WEALTH?</span>
            </h2>
            
            {/* Description */}
            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed font-mono">
              Join thousands of smart savers who are already earning up to 12.5% APY on their stablecoins. 
              No credit card required. Start with as little as $10.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button size="lg" className="gradient-primary text-black text-base font-bold group px-8 h-12 hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all font-mono border border-cyan-400/50">
                GET STARTED FREE
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-base font-bold h-12 px-8 border-2 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 font-mono">
                VIEW DEMO
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 border-t border-cyan-500/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-cyan-400" />
                <span className="text-sm text-gray-300 font-mono">NO CREDIT CARD REQUIRED</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-cyan-400" />
                <span className="text-sm text-gray-300 font-mono">START WITH $10</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-cyan-400" />
                <span className="text-sm text-gray-300 font-mono">WITHDRAW ANYTIME</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
