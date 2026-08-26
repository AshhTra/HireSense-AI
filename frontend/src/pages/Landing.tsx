import Navbar from "../components/layout/Navbar/Navbar";
import Hero from "../components/home/Hero/Hero";
import Features from "../components/home/Features/Features";
import HowItWorks from "../components/home/HowItWorks/HowItWorks";
import Footer from "../components/layout/Footer/Footer";

function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Footer />
    </>
  );
}

export default Landing;