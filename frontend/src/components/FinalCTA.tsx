"use client";

import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-cyan-950/20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-3xl p-12 md:p-16 overflow-hidden">
          {/* Gradient Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
          
          <div className="relative text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full px-4 py-2 mb-6">
              <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-semibold">Start Saving Today</span>
            </div>

            {/* Heading */}
            <h2 className="heading-lg mb-4">
              Ready to{" "}
              <span className="text-gradient">Grow Your Wealth?</span>
            </h2>
            
            {/* Description */}
            <p className="body-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of smart savers who are already earning up to 12.5% APY on their stablecoins. 
              No credit card required. Start with as little as $10.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button size="lg" className="gradient-primary text-white text-base font-semibold group px-8">
                Get Started Free
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-base font-semibold">
                View Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-green-500" />
                <span className="text-sm text-muted-foreground">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-green-500" />
                <span className="text-sm text-muted-foreground">Start with $10</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-green-500" />
                <span className="text-sm text-muted-foreground">Withdraw anytime</span>
              </div>
            </div>
          </div>
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