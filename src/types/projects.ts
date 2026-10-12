export type ExternalLink = {
	label: string;
	url: string;
};

export type MediaType = 'gltf' | 'glb' | 'obj' | 'image';

export type ProjectMediaCamera = {
	position?: [number, number, number];
	target?: [number, number, number];
	rotation?: [number, number, number];
	fov?: number;
	near?: number;
	far?: number;
};

export type ProjectMedia = {
	type: MediaType;
	src: string;
	poster?: string | null;
	resources?: string[];
	offset?: [number, number, number];
	rotation?: [number, number, number];
	rotationDeg?: [number, number, number];
	camera?: ProjectMediaCamera;
	alt?: string;
	caption?: string;
	sourceUrl?: string;
	width?: number;
	height?: number;
};

export type ResearchContent = {
	video?: {
		src: string;
		poster: string;
		captions: string;
		caption: string;
	};
	methods: { label: string; detail: string }[];
	results: {
		value: string;
		label: string;
		context: string;
		environment: 'simulation' | 'hardware';
	}[];
	evaluationNote?: string;
	hardware: { value: string; label: string; detail: string }[];
	figures?: { src: string; alt: string; caption: string; sourceUrl: string }[];
};

export type Project = {
	id: string;
	title: string;
	summary?: string;
	description: string;
	date?: string;
	status?: 'past' | 'ongoing';
	tags: string[];
	links: ExternalLink[];
	awards: string[];
	media?: ProjectMedia;
	order: number;
	shortTitle?: string;
	kind?: 'research' | 'engineering';
	presentation?: 'featured' | 'current' | 'selected' | 'archive';
	selectionOrder?: number;
	role?: string;
	affiliation?: string;
	publicationIds?: string[];
	research?: ResearchContent;
};

export type ProjectManifest = Omit<Project, 'description' | 'awards'> & {
	awards?: string[];
};
