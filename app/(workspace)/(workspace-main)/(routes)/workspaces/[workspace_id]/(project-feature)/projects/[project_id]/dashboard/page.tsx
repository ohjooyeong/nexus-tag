import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Metadata } from 'next';
import ProjectOverview from './_components/project-overview';
import ProjectInfo from './_components/project-info';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: '',
};

const DashboardPage = () => {
  return (
    <div className="mt-6">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between min-h-9 gap-2">
          <h1 className="flex items-center text-2xl font-bold">Dashboard</h1>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="project-info">Project Info</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <ProjectOverview />
          </TabsContent>
          <TabsContent value="project-info" className="space-y-4">
            <ProjectInfo />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;
