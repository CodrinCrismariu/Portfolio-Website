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
  media: ProjectMedia;
  order: number;
};

export type ProjectManifest = Omit<Project, 'description'>;
