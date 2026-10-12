import profileData from '../data/profile.json';
import publicationData from '../data/publications.json';
import experienceData from '../data/experience.json';
import type { PortfolioProfile, Publication, Experience } from '../types/portfolio';
export const profile: PortfolioProfile = profileData;
export const publications = publicationData as Publication[];
export const experience = experienceData as Experience[];
export const assetUrl = (path: string) => {
	if (/^(https?:|mailto:|#)/.test(path)) return path;
	const base = import.meta.env.BASE_URL;
	if (path.startsWith(base)) return path;
	return `${base}${path.replace(/^\//, '')}`;
};
