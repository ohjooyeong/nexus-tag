'use client';

import GeneralForm from './_components/general-form';

const GeneralPage = () => {
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between min-h-9">
          <h1 className="text-2xl font-bold">General</h1>
        </div>
        <div className="lg:max-w-3xl">
          <GeneralForm />
        </div>
      </div>
    </div>
  );
};

export default GeneralPage;
