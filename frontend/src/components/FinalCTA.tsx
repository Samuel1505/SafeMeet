"use client";

import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-br from-emerald-50/50 via-white to-teal-50/30 dark:from-emerald-950/10 dark:via-background dark:to-teal-950/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/20 dark:bg-purple-900/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-3xl p-12 md:p-16 overflow-hidden shadow-xl">
          {/* Gradient Accent */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl" />
          
          <div className="relative text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-linear-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-full px-5 py-2 mb-6 border border-border">
              <Sparkles size={18} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold">Start Saving Today</span>
            </div>

            {/* Heading */}
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Ready to{" "}
              <span className="text-gradient">Grow Your Wealth?</span>
            </h2>
            
            {/* Description */}
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Join thousands of smart savers who are already earning up to 12.5% APY on their stablecoins. 
              No credit card required. Start with as little as $10.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button size="lg" className="gradient-primary text-white text-base font-semibold group px-8 h-12 hover:shadow-lg transition-all">
                Get Started Free
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="text-base font-semibold h-12 px-8 border-2">
                View Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6 border-t border-border">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm text-muted-foreground">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm text-muted-foreground">Start with $10</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm text-muted-foreground">Withdraw anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
