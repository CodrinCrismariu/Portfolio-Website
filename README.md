# Codrin Crismariu · Robotics Portfolio

Immersive, narrative-first portfolio that showcases Codrin Crismariu’s robotics and computer-vision work. Built with React, TypeScript, and Three.js to blend long-form storytelling with interactive 3D media.

## Features

- **Project strips** pair descriptive copy with either high-fidelity glTF scenes or lightweight imagery.
- **Dynamic ingestion**: `loadProjects.ts` eagerly loads every project manifest, description, and asset via `import.meta.glob`.
- **3D rendering**: `@react-three/fiber` + `@react-three/drei` bring the Zoro V2 quadruped to life, with shadows, floating animation, and orbit controls.
- **Responsive layout**: Alternating strips, sticky navigation, and polished dark-mode styling.
- **Tooling**: Vite 5, React 18, TypeScript, ESLint, Prettier, and Vitest ready for authoring and testing.

## Getting started

```powershell
npm install
npm run dev
```

- Visit <http://localhost:5173/> (Vite opens automatically) to explore the portfolio.
- `npm run build` performs a TypeScript check and creates a production bundle.
- `npm run preview` serves the built app locally.
- `npm run lint` and `npm run test` keep quality in check.

## Project structure

```
src/
	App.tsx                 # Routes + data bootstrapping
	components/             # Site header, hero, tech stack cluster
	features/projects/      # ProjectStrip + Three.js media renderers
	hooks/                  # Accessibility helpers (reduced motion, etc.)
	layout/                 # Shared layout shell
	pages/                  # Route-level components
	projects/               # Manifest-driven robotics projects + assets
	styles/global.css       # Theme + layout primitives
	utils/loadProjects.ts   # import.meta.glob data ingestion
```

## Adding a project

1. Create a folder in `src/projects/<slug>/`.
2. Add `project.json` (metadata), `description.md` (narrative), and any assets (images, glTF/glb, OBJ/MTL).
3. Reference assets in `project.json` using relative paths (e.g., `"src": "./robot.gltf"`).
4. Run `npm run dev` — the project appears automatically, sorted by the `order` field.

glTF projects can include `resources` such as `.bin` buffers or textures; the loader maps hashed URLs at build time so Three.js finds every dependency.

## Testing & linting

- `npm run test` runs Vitest (tests live in `src/**/*.test.ts(x)`).
- `npm run lint` checks TypeScript/React best practices and accessibility hints.
- `npm run format` uses Prettier to verify formatting.

## Deployment

Use `npm run build` to produce the optimized bundle in `dist/`. Deploy the contents of `dist/` to any static host (Netlify, Vercel, GitHub Pages, S3, …).

---

Made with resilient design principles so the robots — and the portfolio that celebrates them — keep running.
