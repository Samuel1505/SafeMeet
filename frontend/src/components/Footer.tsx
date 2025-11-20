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
    <footer className="relative bg-linear-to-b from-black to-gray-950 border-t border-cyan-500/20">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-pattern opacity-10" />
      
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg border border-cyan-400/50">
                  <PiggyBank size={28} color="white" />
                </div>
                <span className="text-2xl font-bold text-gradient font-mono tracking-wider">SAFEMEET</span>
              </div>
              <p className="text-base text-gray-300 mb-6 max-w-xs leading-relaxed font-mono">
                Your decentralized group savings platform. Save together, grow together on-chain.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-11 h-11 rounded-xl bg-black/40 hover:bg-cyan-500/20 flex items-center justify-center text-gray-400 hover:text-cyan-400 transition-all hover:scale-110 border border-cyan-500/20 hover:border-cyan-500/50"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h3 className="font-bold text-white mb-4 font-mono">PRODUCT</h3>
              <ul className="space-y-3">
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-mono"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-bold text-white mb-4 font-mono">COMPANY</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-mono"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-bold text-white mb-4 font-mono">RESOURCES</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-mono"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h3 className="font-bold text-white mb-4 font-mono">LEGAL</h3>
              <ul className="space-y-3">
                {footerLinks.legal.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-mono"
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
        <div className="py-8 border-t border-cyan-500/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-bold text-white mb-2 font-mono">STAY UPDATED</h3>
              <p className="text-sm text-gray-400 font-mono">
                Get the latest updates on features and DeFi opportunities.
              </p>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 rounded-xl border border-cyan-500/30 bg-black/40 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 font-mono"
              />
              <Button className="gradient-primary text-black font-bold whitespace-nowrap px-6 font-mono border border-cyan-400/50">
                SUBSCRIBE
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-cyan-500/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 text-center md:text-left font-mono">
              © {currentYear} SAFEMEET. ALL RIGHTS RESERVED. BUILT ON BASE.
            </p>
            <div className="flex items-center gap-6">
              <a href="#privacy" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-mono">
                PRIVACY
              </a>
              <a href="#terms" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-mono">
                TERMS
              </a>
              <a href="#cookies" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors font-mono">
                COOKIES
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
