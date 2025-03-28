import { Metadata } from 'next';
import ProjectSetupForm from './_components/project-setup-form';

export const metadata: Metadata = {
  title: 'Project Setup',
  description: 'Project Setup',
};

const ProjectSetupPage = () => {
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between min-h-9 gap-2">
          <h1 className="text-2xl font-bold">Project Setup</h1>
        </div>
        <div className="lg:max-w-3xl">
          <ProjectSetupForm />
        </div>
      </div>
    </div>
  );
};

export default ProjectSetupPage;
