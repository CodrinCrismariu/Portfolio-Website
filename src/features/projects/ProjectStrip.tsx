import { Component, lazy, Suspense, useState, type ReactNode } from 'react';
import Markdown from 'react-markdown';
import type { Project } from '../../types/projects';
import ProjectMetadata from './ProjectStripMetadata';

const ProjectModelViewer = lazy(() => import('./ProjectModelViewer'));
class ModelBoundary extends Component<
	{ children: ReactNode; fallback: ReactNode },
	{ failed: boolean }
> {
	state = { failed: false };
	static getDerivedStateFromError() {
		return { failed: true };
	}
	render() {
		return this.state.failed ? this.props.fallback : this.props.children;
	}
}
const ProjectStrip = ({ project }: { project: Project; index: number }) => {
	const [showModel, setShowModel] = useState(false);
	const media = project.media;
	if (!media)
		return (
			<article>
				<h3>{project.title}</h3>
				<Markdown>{project.description}</Markdown>
			</article>
		);
	const paragraphs = project.description.split(/\r?\n\s*\r?\n/);
	const preview = media.type === 'image' ? media.src : media.poster;
	const renderPreview = () =>
		preview ? (
			<img src={preview} alt={project.title} loading="lazy" />
		) : (
			<div className="project-strip__placeholder">{project.title}</div>
		);
	return (
		<article id={`project-${project.id}`} className="project-strip">
			<div className="project-strip__media">
				{media.type === 'image' || !showModel ? (
					renderPreview()
				) : (
					<ModelBoundary
						key={media.src}
						fallback={
							<>
								{renderPreview()}
								<div className="model-notice" role="status">
									3D view couldn’t load. The project preview is still available.
								</div>
								<button
									className="model-close-button"
									type="button"
									onClick={() => setShowModel(false)}
								>
									Back to preview
								</button>
							</>
						}
					>
						<Suspense
							fallback={
								<>
									{renderPreview()}
									<div className="model-notice" role="status">
										Preparing 3D view…
									</div>
								</>
							}
						>
							<ProjectModelViewer media={media} title={project.title} />
						</Suspense>
						<button
							className="model-close-button"
							type="button"
							onClick={() => setShowModel(false)}
							aria-label={`Close 3D view of ${project.title}`}
						>
							Close 3D <span aria-hidden="true">×</span>
						</button>
					</ModelBoundary>
				)}
				{media.type !== 'image' && !showModel ? (
					<button
						className="model-load-button"
						type="button"
						onClick={() => setShowModel(true)}
						aria-label={`Load 3D view of ${project.title}`}
					>
						Explore in 3D <span aria-hidden="true">↗</span>
					</button>
				) : null}
			</div>
			<div className="project-strip__body">
				<ProjectMetadata project={project} />
				{project.summary ? (
					<p className="project-strip__summary">{project.summary}</p>
				) : (
					<Markdown className="project-strip__summary">{paragraphs[0]}</Markdown>
				)}
				<div className="project-strip__links">
					{project.links.map((link) => (
						<a
							className="text-link"
							key={link.url}
							href={link.url}
							target="_blank"
							rel="noreferrer"
						>
							{link.label} <span aria-hidden="true">↗</span>
						</a>
					))}
				</div>
				{project.description ? (
					<details className="project-details">
						<summary>
							Technical details <span aria-hidden="true">+</span>
						</summary>
						<Markdown
							className="project-strip__description"
							components={{ h1: 'h4', h2: 'h4', h3: 'h4' }}
						>
							{project.summary
								? project.description
								: paragraphs.slice(1).join('\n\n') || project.description}
						</Markdown>
					</details>
				) : null}
			</div>
		</article>
	);
};
export default ProjectStrip;
