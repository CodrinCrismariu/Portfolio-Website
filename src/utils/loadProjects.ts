import type { Project, ProjectManifest, ProjectMedia } from '../types/projects';

type ManifestModule = { default: ProjectManifest };

type GlobManifest = Record<string, ManifestModule>;
type GlobMarkdown = Record<string, { default: string } | string>;
type GlobAsset = Record<string, string>;

type MediaResources = {
  src: string;
  resources: string[];
  poster?: string | null;
};

const manifestModules: GlobManifest = import.meta.glob('../projects/**/project.json', {
  eager: true
});

const descriptionModules: GlobMarkdown = import.meta.glob('../projects/**/description.md', {
  eager: true,
  query: '?raw',
  import: 'default'
});

const assetModules: GlobAsset = import.meta.glob('../projects/**/*.{gltf,glb,obj,mtl,bin,jpg,jpeg,png,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default'
});

const normalizePath = (path: string) => path.replace('../projects/', './');

const resolveMedia = (media: ProjectMedia, folder: string): MediaResources => {
  const root = folder.endsWith('/') ? folder : `${folder}/`;
  const resolveAsset = (relativePath?: string | null) => {
    if (!relativePath) return undefined;
    const normalized = normalizePath(`${root}${relativePath.replace('./', '')}`);
    const asset = assetModules[`../projects/${normalized.slice(2)}`];

    if (!asset) {
      console.warn(`Asset not found for ${relativePath} in ${folder}`);
      return relativePath || undefined;
    }

    return asset;
  };

  const srcAsset = resolveAsset(media.src);
  const resourceAssets = (media.resources || []).map((resource) => resolveAsset(resource) ?? resource);
  const posterAsset = resolveAsset(media.poster ?? undefined);

  if (!srcAsset) {
    throw new Error(`Media source missing for project in ${folder}`);
  }

  return {
    src: srcAsset,
    resources: resourceAssets.filter(Boolean) as string[],
    poster: posterAsset ?? undefined
  };
};

export const loadProjects = (): Project[] => {
  const projects: Project[] = [];

  Object.entries(manifestModules).forEach(([path, module]) => {
    const manifest = module.default;
    const folder = path.replace('/project.json', '');
    const descriptionModule = descriptionModules[path.replace('project.json', 'description.md')];
    const description = typeof descriptionModule === 'string' ? descriptionModule : descriptionModule?.default;

    if (!description) {
      console.warn(`Description missing for ${manifest.id}`);
    }

    const media = resolveMedia(manifest.media, folder.replace('../projects/', './'));

    projects.push({
      ...manifest,
      status: manifest.status ?? 'past',
      description: description ?? '',
      media: {
        ...manifest.media,
        src: media.src,
        resources: media.resources,
        poster: media.poster ?? manifest.media.poster ?? null
      }
    });
  });

  return projects.sort((a, b) => a.order - b.order);
};
