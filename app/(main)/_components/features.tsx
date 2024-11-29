import { Cloud, Lock, Zap } from 'lucide-react';

const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h3 className="text-4xl font-bold text-center mb-16">
          Why Choose Nexus Tag?
        </h3>
        <div className="grid grid-cols-3 gap-8">
          {[
            {
              icon: <Zap className="mx-auto text-blue-600 h-12 w-12" />,
              title: 'High-Speed Processing',
              description:
                'Quickly and accurately label large datasets with advanced AI.',
            },
            {
              icon: <Lock className="mx-auto text-blue-600 h-12 w-12" />,
              title: 'Security-First Approach',
              description:
                'Protect your enterprise data with top-tier security measures.',
            },
            {
              icon: <Cloud className="mx-auto text-blue-600 h-12 w-12" />,
              title: 'AI-Powered Labeling',
              description:
                'Maximize labeling accuracy through advanced machine learning algorithms.',
            },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-gray-50 p-8 rounded-xl text-center border shadow hover:shadow-lg transition"
            >
              {feature.icon}
              <h4 className="text-xl font-semibold my-4">{feature.title}</h4>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
