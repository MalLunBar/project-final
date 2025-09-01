import HeroAbout from '../sections/about/HeroAbout'
import Story from '../sections/about/Story'
import Values from '../sections/about/Values'
import WhyUs from '../sections/about/WhyUs'
import HowItWorks from '../sections/about/HowItWorks'
import Team from '../sections/about/Team'
import Faq from '../sections/about/Faq'
import Cta from '../sections/about/Cta'
import HeroImage from '../assets/monstera-1.jpg'
import Divider from '../components/Divider'
import Footer from '../sections/Footer'

const AboutUs = () => {
  const team = [
    { name: 'Malin', role: 'Utvecklare & Grundare', bio: 'Brinner för enkel UX och återbruk.', img: '' },
    { name: 'Mimmi', role: 'Utvecklare & Grundare', bio: 'Har en PhD i kemi och ett öga för detaljer.', img: '' },
  ]

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-[calc(100dvh-var(--nav-height))] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] bg-gradient-to-b bg-[#f5efe5]"
    >
      <HeroAbout heroImage={HeroImage} />
      <Divider />
      <Story />
      <Divider />
      <Values />
      <Divider />
      <WhyUs />
      <Divider />
      <HowItWorks />
      <Divider />
      <Team team={team} />
      <Divider />
      <Faq />
      <Divider />
      <Cta />
      <Footer footerText={`© ${new Date().getFullYear()} Runt hörnet`} />
    </main>
  )
}


export default AboutUs