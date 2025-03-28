'use client';

const Terms = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Nexus-Tag Terms of Service
        </h1>

        <div className="space-y-6 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Nexus-Tag, you agree to be bound by these
              Terms of Service. If you do not agree to these terms, please do
              not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              2. Description of Service
            </h2>
            <p>
              Nexus-Tag provides an image annotation and labeling platform. The
              service allows users to upload, annotate, and manage images for
              various purposes including but not limited to machine learning and
              data analysis.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              3. User Responsibilities
            </h2>
            <p>Users are responsible for:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Maintaining the confidentiality of their account</li>
              <li>All activities that occur under their account</li>
              <li>
                Ensuring their use of the service complies with applicable laws
              </li>
              <li>The content they upload and annotate</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              4. Intellectual Property
            </h2>
            <p>
              Users retain all rights to their content. By using Nexus-Tag, you
              grant us a license to host and process your content for the
              purpose of providing our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              5. Privacy
            </h2>
            <p>
              We respect your privacy and handle your data in accordance with
              our Privacy Policy. By using Nexus-Tag, you agree to our data
              handling practices as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-gray-800">
              6. Modifications to Service
            </h2>
            <p>
              We reserve the right to modify or discontinue Nexus-Tag at any
              time, with or without notice. We shall not be liable to you or any
              third party for any modification, suspension, or discontinuance of
              the service.
            </p>
          </section>

          <section className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </section>

          {/* Add Home button */}
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
    </div>
  );
};

export default Terms;
