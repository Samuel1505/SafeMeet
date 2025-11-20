"use client";

import { PiggyBank, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-cyan-500/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg border border-cyan-400/50">
              <PiggyBank size={28} color="white" />
            </div>
            <span className="text-2xl font-bold text-gradient font-mono tracking-wider">SAFEMEET</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-base text-gray-300 hover:text-cyan-400 transition-colors font-medium font-mono border-b-2 border-transparent hover:border-cyan-400">
              FEATURES
            </a>
            <a href="#how-it-works" className="text-base text-gray-300 hover:text-cyan-400 transition-colors font-medium font-mono border-b-2 border-transparent hover:border-cyan-400">
              HOW IT WORKS
            </a>
            <a href="#security" className="text-base text-gray-300 hover:text-cyan-400 transition-colors font-medium font-mono border-b-2 border-transparent hover:border-cyan-400">
              SECURITY
            </a>
            <a href="#about" className="text-base text-gray-300 hover:text-cyan-400 transition-colors font-medium font-mono border-b-2 border-transparent hover:border-cyan-400">
              ABOUT
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button className="gradient-primary text-black text-base font-bold px-6 h-11 hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] transition-all font-mono border border-cyan-400/50">
              CONNECT
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-cyan-400"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-cyan-500/20 bg-black/95 backdrop-blur-xl">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-base text-gray-300 hover:text-cyan-400 transition-colors font-medium font-mono">
                FEATURES
              </a>
              <a href="#how-it-works" className="text-base text-gray-300 hover:text-cyan-400 transition-colors font-medium font-mono">
                HOW IT WORKS
              </a>
              <a href="#security" className="text-base text-gray-300 hover:text-cyan-400 transition-colors font-medium font-mono">
                SECURITY
              </a>
              <a href="#about" className="text-base text-gray-300 hover:text-cyan-400 transition-colors font-medium font-mono">
                ABOUT
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-cyan-500/20">
                <Button className="w-full gradient-primary text-black text-base font-bold h-11 font-mono border border-cyan-400/50">
                  CONNECT WALLET
                </Button> 
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
