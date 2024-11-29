const Heroes = () => {
  return (
    <section className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        <div className="w-1/2 pr-12">
          <h2 className="text-5xl font-bold mb-6">
            The Future of AI Data Labeling
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Experience precise and efficient data labeling with cutting-edge AI
            technology. Say goodbye to manual, time-consuming processes!
          </p>
          <div className="flex space-x-4">
            <button
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50
                transition"
            >
              Start Free Trial
            </button>
            <button
              className="border border-white/50 text-white px-6 py-3 rounded-lg font-semibold
                hover:bg-white/10 transition"
            >
              Learn More
            </button>
          </div>
        </div>
        <div className="w-1/2">
          <div className="bg-gray-200 h-[400px] rounded-xl flex items-center justify-center">
            Dashboard Placeholder
          </div>
        </div>
      </div>
    </section>
  );
};

export default Heroes;
