import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { About } from "@/components/About";
import { UseCases } from "@/components/UseCases";
import { FAQ } from "@/components/FAQ";

import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <UseCases />
      <FAQ />
      <FinalCTA />
      <Footer />
    </div>
  );
}