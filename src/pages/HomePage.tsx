import PortfolioLayout from '../layout/PortfolioLayout';
import HeroSection from '../components/HeroSection';
import ResearchSection from '../features/research/ResearchSection';
import ExperienceSection from '../components/ExperienceSection';
import PublicationsSection from '../components/PublicationsSection';
import ProjectList from '../features/projects/ProjectList';
import AboutSection from '../components/AboutSection';
import { publications, experience } from '../utils/portfolioData';
import type { Project } from '../types/projects';
const HomePage = ({ projects }: { projects: Project[] }) => (
	<PortfolioLayout>
		<HeroSection />
		<ResearchSection projects={projects} publications={publications} />
		<ExperienceSection experience={experience} projects={projects} />
		<PublicationsSection publications={publications} projects={projects} />
		<ProjectList
			projects={projects.filter(
				(project) =>
					project.presentation !== 'featured' && project.presentation !== 'current',
			)}
		/>
		<AboutSection />
	</PortfolioLayout>
);
export default HomePage;
