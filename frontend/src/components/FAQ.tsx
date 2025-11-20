"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="border border-cyan-500/20 rounded-xl overflow-hidden bg-black/40 backdrop-blur-sm hover:border-cyan-500/50 hover:shadow-lg transition-all">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-cyan-500/5 transition-colors"
      >
        <span className="font-bold text-lg text-white pr-4 font-mono">{question}</span>
        <ChevronDown
          size={24}
          className={`shrink-0 text-cyan-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        }`}
      >
        <div className="px-6 pb-5 pt-2 text-gray-300 text-base leading-relaxed border-t border-cyan-500/20 font-mono">
          {answer}
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "HOW DOES SAFEMEET WORK?",
      answer: "SafeMeet allows you to create or join savings 'puddles' with friends and family. You deposit stablecoins (like USDC or USDT) into your puddle, and our smart router automatically finds the best yield opportunities across the Base ecosystem. Your funds are always under your control and can be withdrawn anytime.",
    },
    {
      question: "IS MY MONEY SAFE?",
      answer: "Yes! SafeMeet is built on Base, a secure Layer 2 solution by Coinbase. Your funds are protected by audited smart contracts, and we use non-custodial architecture, meaning you always maintain full control. We also implement multi-signature security and regular security audits.",
    },
    {
      question: "WHAT ARE THE FEES?",
      answer: "SafeMeet charges a small 2% performance fee on the yield earned (not on your principal). There are no deposit or withdrawal fees. Gas fees on Base are minimal, typically less than $0.01 per transaction. We believe in transparent pricing with no hidden costs.",
    },
    {
      question: "CAN I WITHDRAW MY MONEY ANYTIME?",
      answer: "Absolutely! Your funds are always accessible. You can withdraw your share from any puddle at any time. The withdrawal process is instant, and you'll receive your principal plus any earned yield directly to your wallet.",
    },
    {
      question: "WHAT CRYPTOCURRENCIES ARE SUPPORTED?",
      answer: "Currently, SafeMeet supports major stablecoins including USDC, USDT, and DAI on the Base network. We're working on adding support for more assets. All deposits are automatically routed to the best yield opportunities.",
    },
    {
      question: "HOW IS THE YIELD GENERATED?",
      answer: "Our AI-powered smart router continuously analyzes DeFi protocols on Base to find the safest, highest-yield opportunities. Your funds are automatically allocated across lending protocols, liquidity pools, and other vetted strategies. The router rebalances as needed to optimize returns.",
    },
    {
      question: "DO I NEED CRYPTO EXPERIENCE TO USE SAFEMEET?",
      answer: "Not at all! SafeMeet is designed with a beautiful, intuitive interface that makes DeFi accessible to everyone. You don't need to understand gas fees, wallet addresses, or complex DeFi concepts. Just connect your wallet and start saving.",
    },
    {
      question: "WHAT ARE NFT REWARDS?",
      answer: "As you save and reach milestones, you'll earn unique NFT badges and achievements. These NFTs can unlock exclusive perks like boosted yield multipliers, early access to new features, and special community benefits. Some NFTs are also tradeable.",
    },
  ];

  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
            FAQ
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            FREQUENTLY ASKED{" "}
            <span className="text-gradient font-mono">QUESTIONS</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed font-mono">
            Everything you need to know about SafeMeet. Can't find what you're looking for? Contact our support team.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-base text-gray-300 mb-4 font-mono">
            Still have questions?
          </p>
          <button className="text-cyan-400 font-bold hover:underline text-base font-mono hover:text-cyan-300 transition-colors">
            CONTACT SUPPORT →
          </button>
        </div>
      </div>
    </section>
  );
}
