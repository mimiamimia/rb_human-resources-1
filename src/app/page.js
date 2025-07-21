import FounderSection from './FounderSection';
import './globals.css'
import Header from "./Header";
import HeroSection from './HeroSection';
import RegistrationSection from './RegistrationSection';
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
      <RegistrationSection />
      <Candidate />
      <Footer />
    </div>
  );
}
