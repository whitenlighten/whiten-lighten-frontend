import { auth } from "@/auth";
import { ContactSection } from "@/components/homepage/contact-section";
import { Footer } from "@/components/homepage/footer";
import { Header } from "@/components/homepage/header";
import { HeroSection } from "@/components/homepage/hero-section";
import { ServicesSection } from "@/components/homepage/services-section";
import { TestimonialsSection } from "@/components/homepage/testimonials-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Whiten Lighten | Celebrity Dentist",
  description:
    "We're affordable but we're not inexpensive with quality service because we run a dental luxury lounge.",
  openGraph: {
    title: "Whiten Lighten | Celebrity Dentist",
    description:
      "We're affordable but we're not inexpensive with quality service because we run a dental luxury lounge.",
    type: "website",
  },
};

export default async function HomePage() {
  const session = await auth();
  return (
    <main className="min-h-screen">
      <Header session={session} />
      <HeroSection />
      <ServicesSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
