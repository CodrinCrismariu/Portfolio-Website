# Codrin Crismariu — Robotics Research & Engineering

Research and engineering portfolio built with React, TypeScript, Vite, and Three.js. The homepage prioritizes humanoid locomotion and ongoing research, followed by experience, publications, selected engineering work, and a compact project archive.

## Development

Run `npm install` and `npm run dev`. Open `http://localhost:3000/Portfolio-Website/`.

- `npm run build`: TypeScript validation and production output in `dist/`.
- `npm run lint`: React, TypeScript, hooks, and accessibility checks.
- `npm run test -- --run`: content relationships, result contexts, archive browsing, dialogs, and asset paths.

## Content model

Projects continue to load from `src/projects/<folder>/project.json` and `description.md` through `src/utils/loadProjects.ts`. Existing project assets and interactive models remain in their original folders.

Each manifest can define:

- `kind`: `research` or `engineering`.
- `presentation`: `featured`, `current`, `selected`, or `archive`.
- `selectionOrder`: ordering within the selected-project grid.
- `role`, `affiliation`, and `publicationIds`: research metadata and relationships.
- Optional `media`: image or 3D asset; research without approved media does not need a fabricated image.
- Optional `research`: method steps, explicitly scoped results, hardware demonstration details, sourced figures, and an embedded video with its poster and caption track.

The featured research renderer uses the `featured` project. Ongoing entries use `current`. Other projects appear in selected work or the archive; a shared native dialog provides full descriptions, resources, and on-demand 3D models.

Structured content:

- `src/data/profile.json`: introduction, contact links, education, and grouped technical skills.
- `src/data/publications.json`: authors, venue, status, and verified resource links; each entry references a project ID, so its title is not duplicated.
- `src/data/experience.json`: roles, dates, locations, contributions, and related project IDs.

## Add a project or publication

1. Create a folder with a manifest and description. Reference local images/models using relative paths.
2. Set `kind` and `presentation`. Add approved media only when it is available.
3. For a publication, add its record to `publications.json` and its ID to the project’s `publicationIds`.
4. For experience, add a record referencing related project IDs.
5. Run build, lint, and tests.

## Research provenance

MARCH paper: https://arxiv.org/abs/2606.10288. The complete author-provided demonstration is hosted at `public/media/march/march-demo.mp4` and embedded at `#march-video`. Both experiment links stay on this page. The original 1080p video and audio are preserved; MP4 metadata is moved to the start for playback while downloading. Its poster is an actual frame from the physical experiment.

The MARCH images are original figures from the author’s public paper. Figure 1 shows physical hardware and depth observations; Figures 2 and 4 show the method and simulation comparison. Source links and captions are retained in the manifest.

CoRL 2026 acceptance, first-author/lead-developer role, 66.7% success over 1,024 randomized simulation trials, internship information, tactile research direction, and education details are supplied by the portfolio owner. The public preprint corroborates the framework, hardware demonstration, 50 Hz pipeline, simulation scale, and baseline comparisons. Simulation performance is presented separately from physical hardware results.

## GitHub Pages

Vite uses `/Portfolio-Website/` as its base. Asset references, the résumé, favicon, research figures, PDFs, and Draco decoder paths respect this prefix. The site requires no backend. Build before deployment; publishing is a separate action.
