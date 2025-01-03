'use client';

import { useEffect, useRef, useState } from 'react';
import Tag from '../_components/tag';
import { useScroll, useTransform } from 'motion/react';
import { twMerge } from 'tailwind-merge';

const text = `Transform how you label data with our intuitive AI-powered solution. From automated workflows to human-in-the-loop reviews, we ensure every label is optimized for excellence.`;
const words = text.split(' ');

const Introduction = () => {
  const scrollTarget = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: scrollTarget,
    offset: ['start end', 'end end'],
  });
  const [currentWord, setCurrentWord] = useState(0);
  const wordIndex = useTransform(scrollYProgress, [0, 1], [0, words.length]);

  useEffect(() => {
    wordIndex.on('change', (latest) => {
      setCurrentWord(latest);
    });
  }, [wordIndex]);

  return (
    <section className="py-24">
      <div className="container mx-auto">
        <div className="sticky top-20 md:top-28 lg:top-40">
          <div className="flex justify-center">
            <Tag>Introducing Next-tag</Tag>
          </div>

          <div className="text-[33px]/[38px] md:text-6xl lg:text-7xl text-center font-medium mt-10">
            <span>It makes your labeling even better.</span>{' '}
            <span className="">
              {words.map((word, wordIndex) => (
                <span
                  key={wordIndex}
                  className={twMerge(
                    'transition duration-500 text-black/25',
                    wordIndex < currentWord && 'text-black',
                  )}
                >{`${word} `}</span>
              ))}
            </span>
            <span className="text-blue-400 block">
              That&apos;s why we built Next-Tag
            </span>
          </div>
        </div>
        <div className="h-[150vh]" ref={scrollTarget}></div>
      </div>
    </section>
  );
};

export default Introduction;
