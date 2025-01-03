'use client';

import Logo from '../_components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'motion/react';

const navLinks = [
  { label: 'Home', href: '#' },
  { label: 'Features', href: '#features' },
  { label: 'FAQs', href: '#faqs' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section className="py-4 lg:py-8 fixed w-[calc(100%-24px)] top-0 z-50">
        <div className="container max-w-5xl mx-auto">
          <div
            className="border border-black/10 shadow-md rounded-[27px] md:rounded-full bg-white/70
              backdrop-blur"
          >
            <div className="grid grid-cols-2 lg:grid-cols-3 p-2 px-4 md:pr-2 items-center">
              <div>
                <Logo />
              </div>
              <div className="lg:flex justify-center items-center hidden">
                <nav className="flex gap-6 font-medium">
                  {navLinks.map((link) => (
                    <Link href={link.href} key={link.label}>
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
              <div className="flex justify-end gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-menu md:hidden cursor-pointer"
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  <line
                    x1="3"
                    y1="6"
                    x2="21"
                    y2="6"
                    className={twMerge(
                      'origin-left transition',
                      isOpen && 'rotate-45 -translate-y-1',
                    )}
                  ></line>
                  <line
                    x1="3"
                    y1="12"
                    x2="21"
                    y2="12"
                    className={twMerge('transition', isOpen && 'opacity-0')}
                  ></line>
                  <line
                    x1="3"
                    y1="18"
                    x2="21"
                    y2="18"
                    className={twMerge(
                      'origin-left transition',
                      isOpen && '-rotate-45 translate-y-1',
                    )}
                  ></line>
                </svg>

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
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col items-center gap-4 py-4">
                    {navLinks.map((link) => (
                      <Link href={link.href} key={link.label}>
                        {link.label}
                      </Link>
                    ))}
                    <Button
                      variant={'outline'}
                      size={'lg'}
                      className="rounded-full px-6"
                      asChild
                    >
                      <Link href={'/login'}>Log In</Link>
                    </Button>
                    <Button
                      variant={'default'}
                      size={'lg'}
                      className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white
                        hover:opacity-80 transition px-6"
                      asChild
                    >
                      <Link href={'/signup'}>Sign Up</Link>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
      <div className="pb-[86px] md:pb-[98px] lg:px-[130px]"></div>
    </>
  );
};

export default Navbar;
