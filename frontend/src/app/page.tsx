import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";
import { Statistics } from "@/components/Statistics";
import { UseCases } from "@/components/UseCases";
import { FAQ } from "@/components/FAQ";
import { Partners } from "@/components/Partners";
import { FinalCTA } from "@/components/FinalCTA";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <About />
      <Testimonials />
      <Statistics />
      <UseCases />
      <FAQ />
      <Partners />
      <FinalCTA />
      <Footer />
    </div>
  );
}