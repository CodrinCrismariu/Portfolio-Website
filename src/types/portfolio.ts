import type { Project } from './projects';

export type Publication = {
	id: string;
	projectId: string;
	authors: string[];
	venue: string;
	venueAbbreviation: string;
	year: number;
	status: 'accepted' | 'published' | 'preprint';
	paperUrl: string;
	pdfUrl?: string;
	demonstrationUrl?: string;
};
export type Experience = {
	id: string;
	kind: 'research' | 'industry';
	organization: string;
	department?: string;
	role: string;
	location: string;
	period: string;
	summary: string;
	highlights: string[];
	relatedProjectIds: string[];
};
export type PortfolioProfile = {
	name: string;
	headline: string;
	introduction: string;
	email: string;
	resumePath: string;
	githubUrl: string;
	linkedinUrl: string;
	education: { institution: string; degree: string; graduationYear: number; gpa: string };
	skills: { label: string; items: string[] }[];
};
export type PortfolioData = {
	projects: Project[];
	publications: Publication[];
	experience: Experience[];
	profile: PortfolioProfile;
};
