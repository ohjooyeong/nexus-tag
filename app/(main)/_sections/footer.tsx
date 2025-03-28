import Link from 'next/link';
import Logo from '../_components/logo';

const footerLinks = [
  { href: 'mailto:brb1111@naver.com', label: 'Contact' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
];

const Footer = () => {
  return (
    <section className="py-16 border-t border-black/10">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-6">
          <div>
            <Logo />
          </div>
          <div>
            <nav className="flex gap-6">
              {footerLinks.map((link) => (
                <Link
                  href={link.href}
                  key={link.label}
                  className="text-black/50 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
