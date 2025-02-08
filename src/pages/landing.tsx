import HeroSection from "../components/landing/HeroSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
}
