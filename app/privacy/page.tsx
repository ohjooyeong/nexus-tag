const Privacy = () => {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Nexus-Tag Privacy Policy
      </h1>

      <div className="space-y-6 text-gray-600">
        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            1. Information We Collect
          </h2>
          <p>
            We collect information that you provide directly to us, including:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Account information (email, username)</li>
            <li>Images and annotations you upload</li>
            <li>Usage data and interaction with our services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            2. How We Use Your Information
          </h2>
          <p>We use the collected information to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Provide and maintain our services</li>
            <li>Process and store your annotations</li>
            <li>Improve and optimize our platform</li>
            <li>Communicate with you about our services</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            3. Data Security
          </h2>
          <p>
            We implement appropriate security measures to protect your personal
            information. However, no method of transmission over the Internet is
            100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            4. Data Sharing
          </h2>
          <p>
            We do not sell your personal information. We may share your
            information only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent misuse</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            5. Your Rights
          </h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Access your personal information</li>
            <li>Request correction of your data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of marketing communications</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3 text-gray-800">
            6. Contact Us
          </h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at brb1111@naver.com
          </p>
        </section>

        <section className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>

        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base
              font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              transition-colors"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
