import type { Project } from '../types/projects';
export const projectCategories = [
	'All projects',
	'Robotics',
	'Research & AI',
	'Mobility',
	'Engineering',
] as const;
export type ProjectCategory = (typeof projectCategories)[number];
export const matchesCategory = (project: Project, category: ProjectCategory) => {
	const tags = project.tags.join(' ').toLowerCase();
	if (category === 'All projects') return true;
	if (category === 'Robotics') return /quadruped|ftc|robotics/.test(tags);
	if (category === 'Research & AI')
		return project.kind === 'research' || /learning|embedded ai|openmv/.test(tags);
	if (category === 'Mobility') return /solar|quadcopter/.test(tags);
	return /dlp|volumetric|fea/.test(tags);
};
