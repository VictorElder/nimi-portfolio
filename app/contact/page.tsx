import ContactSection from "@/components/portfolio/ContactSection";
import RevealObserver from "@/components/portfolio/RevealObserver";

export const metadata = {
  title: "Contact — Nimi",
  description: "Get in touch with Nimi about your next design project.",
};

export default function ContactPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[1440px] overflow-hidden bg-black text-[#fdcc1e] pb-12">
      <RevealObserver />
      <ContactSection />
    </main>
  );
}

