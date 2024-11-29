import ContactDemo from './_components/contact-demo';
import Features from './_components/features';
import Footer from './_components/footer';
import Heroes from './_components/heroes';

const LandingPage = () => {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <main>
        <Heroes />
        <Features />
        <ContactDemo />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
