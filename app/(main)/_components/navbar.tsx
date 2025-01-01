import { MenuIcon } from 'lucide-react';
import Logo from './logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQs', href: '#faqs' },
];

const Navbar2 = () => {
  return (
    <section className="py-4 lg:py-8">
      <div className="container max-w-5xl mx-auto">
        <div
          className="grid grid-cols-2 lg:grid-cols-3 border border-black/10 shadow-md rounded-full
            p-2 px-4 md:pr-2 items-center"
        >
          <div>
            <Logo />
          </div>
          <div className="lg:flex justify-center items-center hidden">
            <nav className="flex gap-6 font-medium">
              {navLinks.map((link) => (
                <a href={link.href} key={link.label}>
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex justify-end gap-4">
            <MenuIcon className="w-6 h-6 md:hidden" />

            <Button
              variant={'outline'}
              size={'lg'}
              className="rounded-full px-6 hidden md:inline-flex"
              asChild
            >
              <Link href={'/login'}>Log In</Link>
            </Button>
            <Button
              variant={'default'}
              size={'lg'}
              className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white
                hover:opacity-80 transition px-6 hidden md:inline-flex"
              asChild
            >
              <Link href={'/signup'}>Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Navbar2;
