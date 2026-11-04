import AboutSection from "./AboutSection";
import Footer from "./Footer";
import HeroSection from "./HeroSection";
import RevealObserver from "./RevealObserver";
import ServicesMarquee from "./ServicesMarquee";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-[1440px] overflow-hidden bg-black text-[#fdcc1e] pb-12">
      <RevealObserver />
      <HeroSection />
      <ServicesMarquee />
      <AboutSection />
      <Footer />
    </main>
  );
}
