'use client';

import { PlusIcon } from 'lucide-react';
import Tag from '../_components/tag';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const faqs = [
  {
    question: 'What does an AI labeling solution do?',
    answer:
      'An AI labeling solution automates the process of annotating data, such as images, text, or videos, for machine learning. It uses advanced algorithms and sometimes human-in-the-loop systems to ensure high-quality labels essential for training AI models.',
  },
  {
    question:
      'What measures are in place to guarantee the quality of annotations?',
    answer:
      ' We combine automated quality checks, human-in-the-loop reviews, and customizable validation steps to deliver highly accurate annotations. You can also set specific quality thresholds to match your project requirements.',
  },
  {
    question: 'How do you handle version control?',
    answer:
      'Every change in Layers is automatically saved and versioned. You can review history, restore previous versions, and create named versions for important milestones.',
  },
  {
    question: 'Who can use your AI labeling solution?',
    answer:
      'Our solution is versatile and can be used across various industries, including healthcare, autonomous vehicles, retail, finance, and more. If your project requires labeled data, we can help!',
  },
];

const Faqs = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <section className="py-24" id="faqs">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <Tag>Faqs</Tag>
        </div>
        <h2 className="text-6xl font-medium mt-6 text-center mx-auto max-w-2xl">
          Questions? We&apos;ve got{' '}
          <span className="text-blue-500">answers</span>
        </h2>
        <div className="mt-12 flex flex-col gap-6 max-w-xl mx-auto">
          {faqs.map((faq, faqIndex) => (
            <div
              key={faq.question}
              className="bg-neutral-100 rounded-2xl border border-black/10 p-6 cursor-pointer"
              onClick={() => {
                if (faqIndex === selectedIndex) {
                  setSelectedIndex(-1);
                } else {
                  setSelectedIndex(faqIndex);
                }
              }}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{faq.question}</h3>

                <PlusIcon
                  className={twMerge(
                    'w-6 h-6 text-blue-500 flex-shrink-0 transition duration-300',
                    selectedIndex === faqIndex && 'rotate-45',
                  )}
                />
              </div>
              <AnimatePresence>
                {selectedIndex === faqIndex && (
                  <motion.div
                    initial={{ height: 0, marginTop: 0 }}
                    animate={{ height: 'auto', marginTop: 24 }}
                    exit={{ height: 0, marginTop: 0 }}
                    className={twMerge('overflow-hidden')}
                  >
                    <p className="text-black/50">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faqs;
