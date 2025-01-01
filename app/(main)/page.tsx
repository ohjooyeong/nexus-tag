import Features from './_components/features';
import Footer from './_components/footer';

import Heroes from './_components/heroes';
import Introduction from './_components/introduction';

const LandingPage = () => {
  return (
    <>
      <Heroes />
      <Introduction />
      <Features />

      <Footer />
    </>
  );
};

export default LandingPage;
