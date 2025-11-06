"use client";

import { PiggyBank, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <PiggyBank size={24} color="white" />
            </div>
            <span className="text-xl font-bold text-gradient">SafeMeet</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="body-md text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="body-md text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </a>
            <a href="#security" className="body-md text-muted-foreground hover:text-foreground transition-colors">
              Security
            </a>
            <a href="#about" className="body-md text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button className="gradient-primary text-white body-md font-semibold">
              <appkit-button />
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
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <a href="#features" className="body-md text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="body-md text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#security" className="body-md text-muted-foreground hover:text-foreground transition-colors">
                Security
              </a>
              <a href="#about" className="body-md text-muted-foreground hover:text-foreground transition-colors">
                About
              </a>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button className="w-full gradient-primary text-white body-md font-semibold">
                  <appkit-button />
                </Button> 
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}