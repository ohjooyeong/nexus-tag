import CallToAction from './_sections/call-to-action';
import Faqs from './_sections/faqs';
import Features from './_sections/features';
import Footer from './_sections/footer';

import Heroes from './_sections/heroes';
import Introduction from './_sections/introduction';

const LandingPage = () => {
  return (
    <>
      <Heroes />
      <Introduction />
      <Features />
      <Faqs />
      <CallToAction />
      <Footer />
    </>
  );
};

export default LandingPage;
