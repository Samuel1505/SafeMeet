"use client";

import { PiggyBank, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
              <PiggyBank size={28} color="white" />
            </div>
            <span className="text-2xl font-bold text-gradient">SafeMeet</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium">
              Features
            </a>
            <a href="#how-it-works" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium">
              How It Works
            </a>
            <a href="#security" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium">
              Security
            </a>
            <a href="#about" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium">
              About
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button className="gradient-primary text-white text-base font-semibold px-6 h-11 hover:shadow-lg transition-all">
              Connect Wallet
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-border">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium">
                Features
              </a>
              <a href="#how-it-works" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium">
                How It Works
              </a>
              <a href="#security" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium">
                Security
              </a>
              <a href="#about" className="text-base text-muted-foreground hover:text-foreground transition-colors font-medium">
                About
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button className="w-full gradient-primary text-white text-base font-semibold h-11">
                  Connect Wallet
                </Button> 
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
