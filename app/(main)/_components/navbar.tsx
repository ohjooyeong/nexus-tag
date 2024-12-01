'use client';

import { Button } from '@/components/ui/button';
import Logo from './logo';
import Link from 'next/link';

const Navbar = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Logo />
        <nav>
          <ul className="flex space-x-5">
            {['Features', 'Pricing', 'Contact'].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium hover:text-blue-600 transition"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex space-x-4">
          <Button
            variant={'outline'}
            size={'lg'}
            className="rounded-xl"
            asChild
          >
            <Link href={'/login'}>Login</Link>
          </Button>
          <Button
            variant={'default'}
            size={'lg'}
            className="rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white
              hover:opacity-80 transition"
            asChild
          >
            <Link href={'/signup'}>Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
