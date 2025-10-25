import PortfolioLayout from '../layout/PortfolioLayout';
import HeroSection from '../components/HeroSection';
import ProjectList from '../features/projects/ProjectList';
import type { Project } from '../types/projects';

const HomePage = ({ projects }: { projects: Project[] }) => (
  <PortfolioLayout>
    <HeroSection />
    <ProjectList projects={projects} />
  </PortfolioLayout>
);

export default HomePage;
