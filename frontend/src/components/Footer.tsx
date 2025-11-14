"use client";

import { PiggyBank, Twitter, Github, MessageCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Security", href: "#security" },
      { label: "Pricing", href: "#pricing" },
    ],
    company: [
      { label: "About Us", href: "#about" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#careers" },
      { label: "Press Kit", href: "#press" },
    ],
    resources: [
      { label: "Documentation", href: "#docs" },
      { label: "API Reference", href: "#api" },
      { label: "Community", href: "#community" },
      { label: "Support", href: "#support" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookie Policy", href: "#cookies" },
      { label: "Disclaimer", href: "#disclaimer" },
    ],
  };

  const socialLinks = [
    { icon: <Twitter size={20} />, href: "#", label: "Twitter" },
    { icon: <Github size={20} />, href: "#", label: "GitHub" },
    { icon: <MessageCircle size={20} />, href: "#", label: "Discord" },
    { icon: <Mail size={20} />, href: "#", label: "Email" },
  ];

  return (
    <footer className="relative bg-linear-to-b from-background to-gray-50 dark:to-gray-900/50 border-t border-border">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                  <PiggyBank size={24} color="white" />
                </div>
                <span className="text-xl font-bold text-gradient">SafeMeet</span>
              </div>
              <p className="body-md text-muted-foreground mb-6 max-w-xs">
                Your group piggy bank for the Web3 era. Save together, grow together.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-muted hover:bg-accent flex items-center justify-center text-muted-foreground hover:text-foreground transition-all hover:scale-110"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Product</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-semibold text-foreground mb-2">Stay Updated</h3>
              <p className="text-sm text-muted-foreground">
                Get the latest updates on features and DeFi opportunities.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button className="gradient-primary text-white font-semibold whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {currentYear} SafeMeet. All rights reserved. Built on Base.
            </p>
            <div className="flex items-center gap-6">
              <a href="#privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}