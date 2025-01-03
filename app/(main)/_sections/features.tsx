import Tag from '../_components/tag';
import FeatureCard from '../_components/feature-card';
import avatar1 from '@/assets/images/avatar-ashwin-santiago.jpg';
import avatar2 from '@/assets/images/avatar-lula-meyers.jpg';
import avatar3 from '@/assets/images/avatar-florence-shaw.jpg';
import avatar4 from '@/assets/images/avatar-owen-garcia.jpg';
import Image from 'next/image';
import Avatar from '../_components/avatar';
import Key from '../_components/key';

const features = [
  'AI Tool',
  'Smart Sync',
  'Auto Layout',
  'Fast Search',
  'Smart Guides',
];

const Features = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto">
        <div className="flex justify-center">
          <Tag>Features</Tag>
        </div>
        <h2 className="text-6xl font-medium text-center mt-6 max-w-2xl mx-auto">
          Where power meets <span className="text-blue-500">simplicity</span>
        </h2>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="High-Quality Annotations"
            description="Achieve unparalleled accuracy with robust quality checks and
                human-in-the-loop reviews."
            className="md:col-span-2 lg:col-span-1 group"
          >
            <div className="aspect-video flex items-center justify-center">
              <Avatar className="z-40">
                <Image src={avatar1} alt="Avatar 1" className="rounded-full" />
              </Avatar>
              <Avatar className="-ml-6 border-indigo-500 z-30">
                <Image src={avatar2} alt="Avatar 2" className="rounded-full" />
              </Avatar>
              <Avatar className="-ml-6 border-amber-500 z-20">
                <Image src={avatar3} alt="Avatar 3" className="rounded-full" />
              </Avatar>
              <Avatar className="-ml-6 border-transparent group-hover:border-green-500 transition">
                <div
                  className="size-full bg-neutral-500 rounded-full inline-flex items-center justify-center
                    gap-1 relative"
                >
                  <Image
                    src={avatar4}
                    alt="Avatar 4"
                    className="absolute size-full rounded-full opacity-0 group-hover:opacity-100 transition"
                  />
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span
                      className="size-1.5 rounded-full bg-white inline-flex"
                      key={i}
                    ></span>
                  ))}
                </div>
              </Avatar>
            </div>
          </FeatureCard>
          <FeatureCard
            title="Interactive Prototyping"
            description="Engage your clients with prototypes that react to user actions"
            className="md:col-span-2 lg:col-span-1 group"
          >
            <div className="aspect-video flex items-center justify-center">
              <p
                className="text-4xl font-extrabold text-black/20 group-hover:text-black/10 transition
                  duration-500 text-center"
              >
                We&apos;ve achieved{' '}
                <span
                  className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent
                    relative"
                >
                  <span>incredible</span>
                  <video
                    src={'/assets/gif-incredible.mp4'}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute bottom-full left-1/2 -translate-x-1/2 rounded-2xl shadow-xl opacity-0
                      pointer-events-none group-hover:opacity-100 transition duration-500"
                  ></video>
                </span>{' '}
                growth this year
              </p>
            </div>
          </FeatureCard>
          <FeatureCard
            title="Keyboard Quick Actions"
            description="Powerful commands to help you create label more quickly"
            className="md:col-span-2 md:col-start-2 lg:col-span-1 lg:col-start-auto group"
          >
            <div className="aspect-video flex items-center justify-center gap-4">
              <Key
                className="w-28 outline outline-2 outline-offset-4 outline-transparent
                  group-hover:outline-blue-500 transition-all duration-500
                  group-hover:translate-y-1"
              >
                shift
              </Key>
              <Key
                className="outline outline-2 outline-offset-4 outline-transparent
                  group-hover:outline-blue-500 transition-all duration-500
                  group-hover:translate-y-1 delay-150"
              >
                alt
              </Key>
              <Key
                className="outline outline-2 outline-offset-4 outline-transparent
                  group-hover:outline-blue-500 transition-all duration-500
                  group-hover:translate-y-1 delay-300"
              >
                C
              </Key>
            </div>
          </FeatureCard>
        </div>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          {features.map((feature) => (
            <div
              key={feature}
              className="bg-neutral-100 border-white/10 inline-flex px-3 md:px-5 py-1.5 md:py-2
                rounded-2xl gap-3 items-center hover:scale-105 transition duration-500 group"
            >
              <span
                className="bg-blue-500 text-neutral-100 size-5 rounded-full inline-flex items-center
                  justify-center text-xl group-hover:rotate-45 transition duration-500"
              >
                &#10038;
              </span>
              <span className="font-medium md:text-lg">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
