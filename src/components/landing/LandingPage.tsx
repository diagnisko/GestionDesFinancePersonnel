import Navbar from "./Navbar";
import Hero from "./Hero";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import Security from "./Security";
import Footer from "./Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-ink-950 text-paper font-sans">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Security />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
