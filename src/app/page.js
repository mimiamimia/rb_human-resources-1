import './globals.css'
import FounderSection from './FounderSection';
import Header from "./Header";
import HeroSection from './HeroSection';
import Enterprise from './Enterprise';
import DescriptionSection from './DescriptionSection';
import Footer from './Footer';
import Candidate from './Candidate';

export default function Home() {
  return (

    <div>
      <Header />
      <HeroSection />
      <DescriptionSection />
      <FounderSection />
      <Enterprise />
      <Candidate />
      <Footer />
    </div>
  );
}
