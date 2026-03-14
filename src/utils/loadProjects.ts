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

const assetModules: GlobAsset = import.meta.glob('../projects/**/*.{gltf,glb,obj,mtl,bin,jpg,jpeg,png,webp,svg,gif,pdf}', {
  eager: true,
  query: '?url',
  import: 'default'
});

const normalizePath = (path: string) => path.replace('../projects/', './');

const createAssetResolver = (folder: string) => (relativePath?: string | null) => {
  const root = folder.endsWith('/') ? folder : `${folder}/`;
  if (!relativePath) return undefined;
  if (/^https?:\/\//.test(relativePath)) {
    return relativePath;
  }
  if (relativePath.startsWith('/')) {
    const base = import.meta.env.BASE_URL ?? '/';
    const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
    return `${trimmedBase}${relativePath}`;
  }
  const normalized = normalizePath(`${root}${relativePath.replace('./', '')}`);
  // normalized starts with ./, slice(2) to remove it. path in glob is ../projects/...
  const asset = assetModules[`../projects/${normalized.slice(2)}`];

  if (!asset) {
    console.warn(`Asset not found for ${relativePath} in ${folder}`);
    return relativePath || undefined;
  }

  return asset;
};

const resolveMedia = (media: ProjectMedia, folder: string): MediaResources => {
  const resolveAsset = createAssetResolver(folder);

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
    const relativeFolder = folder.replace('../projects/', './');
    const descriptionModule = descriptionModules[path.replace('project.json', 'description.md')];
    const description = typeof descriptionModule === 'string' ? descriptionModule : descriptionModule?.default;

    if (!description) {
      console.warn(`Description missing for ${manifest.id}`);
    }

    const media = resolveMedia(manifest.media, relativeFolder);
    const resolveAsset = createAssetResolver(relativeFolder);

    const resolvedLinks = (manifest.links ?? []).map((link) => ({
      ...link,
      url: resolveAsset(link.url) ?? link.url
    }));

    projects.push({
      ...manifest,
      status: manifest.status ?? 'past',
      description: description ?? '',
      awards: manifest.awards ?? [],
      links: resolvedLinks,
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
