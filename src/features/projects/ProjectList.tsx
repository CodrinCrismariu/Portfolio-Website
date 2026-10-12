import { useEffect, useRef, useState } from 'react';
import type { Project } from '../../types/projects';
import {
	matchesCategory,
	projectCategories,
	type ProjectCategory,
} from '../../utils/projectCategories';
import ProjectStrip from './ProjectStrip';
const year = (project: Project) => (project.date ? project.date.slice(0, 4) : '');
const ProjectList = ({ projects }: { projects: Project[] }) => {
	const [category, setCategory] = useState<ProjectCategory>('All projects');
	const [query, setQuery] = useState('');
	const [active, setActive] = useState<Project | null>(null);
	const dialog = useRef<HTMLDialogElement>(null);
	useEffect(() => {
		if (active && dialog.current && !dialog.current.open) dialog.current.showModal();
		if (!active && dialog.current?.open) dialog.current.close();
	}, [active]);
	useEffect(() => {
		const openFromHash = () => {
			const id = window.location.hash.replace('#project-', '');
			const project = projects.find((item) => item.id === id);
			if (project) setActive(project);
			else setActive(null);
		};
		openFromHash();
		window.addEventListener('hashchange', openFromHash);
		return () => window.removeEventListener('hashchange', openFromHash);
	}, [projects]);
	const filtered = projects.filter(
		(project) =>
			matchesCategory(project, category) &&
			`${project.title} ${project.tags.join(' ')} ${project.summary ?? ''} ${project.description}`
				.toLowerCase()
				.includes(query.trim().toLowerCase()),
	);
	const selected = filtered
		.filter((project) => project.presentation === 'selected')
		.sort((a, b) => (a.selectionOrder ?? 0) - (b.selectionOrder ?? 0));
	const archive = filtered
		.filter((project) => project.presentation !== 'selected')
		.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? '') || b.order - a.order);
	const close = () => {
		dialog.current?.close();
		setActive(null);
	};
	return (
		<section className="project-list section" id="projects" aria-labelledby="work-title">
			<div className="section-label">
				<span className="eyebrow">04 / Engineering</span>
				<span className="section-label__note">Mechanical design · controls · autonomy</span>
			</div>
			<div className="section-heading-row">
				<h2 id="work-title">Selected engineering projects</h2>
				<p>
					Earlier robotics, research, and vehicle projects. Open a project for technical
					details, resources, and interactive models.
				</p>
			</div>
			<div className="project-list__toolbar">
				<div
					className="project-filters"
					role="group"
					aria-label="Filter projects by discipline"
				>
					{projectCategories.map((item) => (
						<button
							key={item}
							type="button"
							aria-pressed={category === item}
							onClick={() => setCategory(item)}
						>
							{item}
						</button>
					))}
				</div>
				<label className="project-search">
					<span className="sr-only">Search projects</span>
					<span aria-hidden="true">⌕</span>
					<input
						type="search"
						placeholder="Search projects"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
					/>
				</label>
			</div>
			<p className="project-count" role="status" aria-live="polite">
				{filtered.length} of {projects.length} projects
			</p>
			{selected.length ? (
				<div className="selected-projects">
					{selected.map((project) => (
						<article key={project.id} className="selected-project">
							<button
								type="button"
								className="project-thumbnail"
								onClick={() => setActive(project)}
								aria-label={`Open preview for ${project.title}`}
							>
								{project.media ? (
									<img
										src={project.media.poster ?? project.media.src}
										alt=""
										loading="lazy"
									/>
								) : null}
								<span>
									{project.media && project.media.type !== 'image'
										? 'Interactive 3D'
										: 'Project details'}{' '}
									<span aria-hidden="true">↗</span>
								</span>
							</button>
							<div className="selected-project__meta">
								<span>
									{project.kind === 'research'
										? 'Research & coursework'
										: 'Engineering'}
								</span>
								<span>
									{project.status === 'ongoing' ? 'Ongoing' : year(project)}
								</span>
							</div>
							<h3>
								<button
									type="button"
									onClick={() => setActive(project)}
									aria-label={`View ${project.title}`}
								>
									{project.title}
									<span aria-hidden="true">↗</span>
								</button>
							</h3>
							<p>{project.summary ?? project.tags.join(' · ')}</p>
						</article>
					))}
				</div>
			) : null}
			{archive.length ? (
				<div className="project-archive" id="archive">
					<div className="archive-heading">
						<h3>Project archive</h3>
						<span>{archive.length.toString().padStart(2, '0')} entries</span>
					</div>
					<div>
						{archive.map((project) => (
							<button
								type="button"
								className="archive-row"
								key={project.id}
								onClick={() => setActive(project)}
								aria-label={`View ${project.title}`}
							>
								<span className="archive-year">{year(project)}</span>
								<span className="archive-title">{project.title}</span>
								<span className="archive-tags">
									{project.tags.slice(0, 2).join(' · ')}
								</span>
								<span className="archive-action">
									View project <span aria-hidden="true">↗</span>
								</span>
							</button>
						))}
					</div>
				</div>
			) : null}
			{filtered.length === 0 ? (
				<div className="project-list__empty">
					<h3>No projects found.</h3>
					<p>Try another keyword or reset the filters.</p>
					<button
						className="button-link"
						type="button"
						onClick={() => {
							setCategory('All projects');
							setQuery('');
						}}
					>
						Reset filters
					</button>
				</div>
			) : null}
			<dialog
				className="project-dialog"
				ref={dialog}
				aria-labelledby="project-dialog-title"
				onClose={() => setActive(null)}
				onCancel={() => setActive(null)}
			>
				<div className="project-dialog__bar">
					<span className="eyebrow">Project details</span>
					<button type="button" onClick={close} aria-label="Close project details">
						Close <span aria-hidden="true">×</span>
					</button>
				</div>
				{active ? (
					<div className="project-dialog__content">
						<h2 className="sr-only" id="project-dialog-title">
							{active.title}
						</h2>
						<ProjectStrip key={active.id} project={active} index={0} />
					</div>
				) : null}
			</dialog>
		</section>
	);
};
export default ProjectList;
