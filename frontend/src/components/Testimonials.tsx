"use client";

import { Star, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TestimonialCardProps {
  name: string;
  role: string;
  avatar: string;
  quote: string;
  savings: string;
  rating: number;
}

function TestimonialCard({ name, role, avatar, quote, savings, rating }: TestimonialCardProps) {
  return (
    <div className="group relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
      {/* Gradient Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl group-hover:opacity-100 opacity-50 transition-opacity" />
      
      <div className="relative">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
            />
          ))}
        </div>

        {/* Quote */}
        <p className="body-md text-foreground mb-6 italic">"{quote}"</p>

        {/* User Info */}
        <div className="flex items-center gap-4">
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full border-2 border-border"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-foreground">{name}</h4>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>

        {/* Savings Badge */}
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-green-500" />
            <span className="text-sm font-semibold text-green-500">{savings} saved</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Designer",
      avatar: "https://i.pravatar.cc/150?img=1",
      quote: "SafeMeet made it so easy for our team to save for our annual retreat. The auto-yield feature is incredible - we earned 12% APY without doing anything!",
      savings: "$8,500",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Software Engineer",
      avatar: "https://i.pravatar.cc/150?img=12",
      quote: "Finally, a DeFi app that my non-crypto friends can actually use. We pooled money for a group gift and everyone loved how simple it was.",
      savings: "$3,200",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Marketing Manager",
      avatar: "https://i.pravatar.cc/150?img=5",
      quote: "The security and transparency give me peace of mind. I can see exactly where our money is invested and withdraw anytime. Best group savings app!",
      savings: "$12,400",
      rating: 5,
    },
    {
      name: "David Kim",
      role: "Entrepreneur",
      avatar: "https://i.pravatar.cc/150?img=14",
      quote: "We use SafeMeet for our startup's emergency fund. The smart routing finds the best yields automatically. It's like having a financial advisor on autopilot.",
      savings: "$25,000",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-background dark:from-gray-900/20 dark:to-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 px-4 py-1.5 gradient-primary text-white">
            Testimonials
          </Badge>
          <h2 className="heading-lg mb-4">
            Loved by{" "}
            <span className="text-gradient">Thousands of Savers</span>
          </h2>
          <p className="body-lg text-muted-foreground max-w-2xl mx-auto">
            Join our growing community of smart savers who are achieving their financial goals together.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>

        {/* Trust Indicator */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-full px-6 py-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/150?img=${i + 20}`}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900"
                />
              ))}
            </div>
            <span className="text-sm font-semibold">
              Join 1,200+ happy savers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}