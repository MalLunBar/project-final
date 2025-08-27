import HeroSection from '../sections/HeroAbout'
import StorySection from '../sections/Story'
import ValuesSection from '../sections/Values'
import WhyUsSection from '../sections/WhyUs'
import HowItWorksSection from '../sections/HowItWorks'
import TeamSection from '../sections/Team'
import FaqSection from '../sections/Faq'
import CtaSection from '../sections/Cta'
import HeroImage from '../assets/monstera-1.jpg'
import Divider from '../components/Divider'
import Footer from '../sections/Footer'

const AboutUs = () => {
  const team = [
    { name: 'Malin', role: 'Uttvecklare & Grundare', bio: 'Brinner för enkel UX och återbruk.', img: '' },
    { name: 'Mimmi', role: 'Utvecklare & Grundare', bio: 'Har en PhD i kemi och ett öga för detaljer.', img: '' },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b bg-[#f5efe5]">
      <HeroSection heroImage={HeroImage} />
      <Divider />
      <StorySection />
      <Divider />
      <ValuesSection />
      <Divider />
      <WhyUsSection />
      <Divider />
      <HowItWorksSection />
      <Divider />
      <TeamSection team={team} />
      <Divider />
      <FaqSection />
      <Divider />
      <CtaSection />
      <Footer footerText={`© ${new Date().getFullYear()} Runt hörnet`} />
    </main>
  )
}


export default AboutUs