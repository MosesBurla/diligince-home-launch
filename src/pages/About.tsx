import PublicHeader from "../components/PublicHeader";
import Footer from "../components/Footer";
import AboutHero from "@/components/about/AboutHero";
import CompanyStory from "@/components/about/CompanyStory";
import ProductVision from "@/components/about/ProductVision";
import ValuesGrid from "@/components/about/ValuesGrid";
import TeamSection from "@/components/about/TeamSection";
import TechnologyHub from "@/components/about/TechnologyHub";
import ContactCTA from "@/components/about/ContactCTA";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicHeader />
      <main className="flex-grow pt-16">
        <AboutHero />
        <CompanyStory />
        <ProductVision />
        <ValuesGrid />
        <TeamSection />
        <TechnologyHub />
        <ContactCTA />
      </main>
      <Footer />
    </div>
  );
};

export default About;
