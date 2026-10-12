import type { Experience } from '../types/portfolio';
import type { Project } from '../types/projects';
const ExperienceSection = ({
	experience,
	projects,
}: {
	experience: Experience[];
	projects: Project[];
}) => (
	<section className="experience section" id="experience" aria-labelledby="experience-title">
		<div className="section-label">
			<span className="eyebrow">02 / Experience</span>
		</div>
		<div className="section-heading-row">
			<h2 id="experience-title">Research & industry</h2>
			<p>Applied robot learning, control, and hardware development.</p>
		</div>
		{experience.map((entry) => (
			<article className="experience-entry" id={`experience-${entry.id}`} key={entry.id}>
				<div className="experience-entry__meta">
					<p className="eyebrow">
						{entry.kind === 'research' ? 'Research experience' : 'Industry experience'}
					</p>
					<p>{entry.period}</p>
					<span>{entry.location}</span>
				</div>
				<div className="experience-entry__body">
					<h3>{entry.organization}</h3>
					<p className="experience-role">{entry.role}</p>
					{entry.department ? (
						<p className="experience-department">{entry.department}</p>
					) : null}
					<p>{entry.summary}</p>
					<ul>
						{entry.highlights.map((highlight) => (
							<li key={highlight}>{highlight}</li>
						))}
					</ul>
					{entry.relatedProjectIds.length ? (
						<div className="research-links">
							{entry.relatedProjectIds.map((id) => {
								const project = projects.find((item) => item.id === id);
								return project ? (
									<a key={id} href={`#project-${id}`} className="text-link">
										{project.shortTitle ?? project.title}{' '}
										<span aria-hidden="true">↗</span>
									</a>
								) : null;
							})}
						</div>
					) : null}
				</div>
			</article>
		))}
	</section>
);
export default ExperienceSection;
