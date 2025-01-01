import Tag from './tag';

const text = `Transform how you label data with our intuitive AI-powered solution. From automated workflows to human-in-the-loop reviews, we ensure every label is optimized for excellence.`;

const Introduction = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <Tag>Introducing Next-tag</Tag>
        </div>

        <div className="text-4xl md:text-6xl lg:text-7xl text-center font-medium mt-10">
          <span>It makes your labeling even better.</span>{' '}
          <span className="text-black/15">{text}</span>
          <span className="text-blue-400 block">
            That&apos;s why we built Next-Tag
          </span>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
