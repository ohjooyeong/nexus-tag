import { Button } from '@/components/ui/button';
import Pointer from './pointer';

const Heroes = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto relative">
        <div className="absolute left-56 top-96 hidden lg:block">
          <Pointer name="Andres" />
        </div>
        <div className="absolute right-80 -top-4 hidden lg:block">
          <Pointer name="Bryan" color="red" />
        </div>
        <div className="flex justify-center">
          <div
            className="inline-flex py-1 px-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full
              text-neutral-950 font-semibold"
          >
            ✨ The Future of AI Data Labeling
          </div>
        </div>
        <h1 className="text-5xl md:text-7xl font-medium text-center mt-6">
          Smarter, Faster Data Labeling
          <br /> Great AI Models Start with Great Data
        </h1>
        <p className="text-center text-lg md:text-xl text-black/50 mt-8 max-w-4xl mx-auto">
          Elevate your data quality and accelerate model training with our
          cutting-edge AI labeling solution.
          <br />
          The new standard in data labeling—achieve more with less effort.
        </p>
        <form className="flex border border-black/15 rounded-full p-2 mt-8 max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-transparent px-4 flex-1 outline-none"
          />
          <Button
            type="submit"
            className="whitespace-nowrap rounded-full px-6"
            size={'sm'}
          >
            Sign Up
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Heroes;
