import Navbar from './_sections/navbar';

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full dark:bg-[#1f1f1f] px-3">
      <Navbar />
      <main className="h-full">{children}</main>
    </div>
  );
};

export default LandingLayout;
