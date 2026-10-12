import type { Project } from '../../types/projects';
const ProjectStripMetadata = ({ project }: { project: Project }) => {
	const parsed = project.date ? Date.parse(project.date) : NaN;
	const formattedDate = Number.isNaN(parsed)
		? null
		: new Intl.DateTimeFormat('en-US', {
				year: 'numeric',
				month: 'short',
				timeZone: 'UTC',
			}).format(parsed);
	return (
		<header className="project-strip__header">
			<div className="project-strip__eyebrow">
				{project.status === 'ongoing' ? (
					<span className="project-strip__status">
						<span className="status-dot" />
						In progress
					</span>
				) : (
					<span>{formattedDate ?? 'Project'}</span>
				)}
				<span>{project.tags[0]}</span>
			</div>
			<h3 className="project-strip__title">{project.title}</h3>
			<div className="tag-list">
				{project.tags.map((tag) => (
					<span className="tag" key={tag}>
						{tag}
					</span>
				))}
			</div>
			{project.awards.length > 0 ? (
				<ul className="project-strip__award-list">
					{project.awards.map((award) => (
						<li key={award} className="project-strip__award">
							<span aria-hidden="true">✳</span> {award}
						</li>
					))}
				</ul>
			) : null}
		</header>
	);
};
export default ProjectStripMetadata;
