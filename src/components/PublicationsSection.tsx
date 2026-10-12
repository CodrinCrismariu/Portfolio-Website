import type { Publication } from '../types/portfolio';
import type { Project } from '../types/projects';
import { profile } from '../utils/portfolioData';
const PublicationsSection = ({
	publications,
	projects,
}: {
	publications: Publication[];
	projects: Project[];
}) => (
	<section
		className="publications section"
		id="publications"
		aria-labelledby="publications-title"
	>
		<div className="section-label">
			<span className="eyebrow">03 / Publications</span>
		</div>
		<h2 id="publications-title">Publications</h2>
		<ol className="publication-list">
			{publications.map((publication) => {
				const project = projects.find((item) => item.id === publication.projectId);
				if (!project) return null;
				return (
					<li key={publication.id}>
						<span className="publication-year">{publication.year}</span>
						<div>
							<h3>
								<a href={publication.paperUrl} target="_blank" rel="noreferrer">
									{project.title} <span aria-hidden="true">↗</span>
								</a>
							</h3>
							<p className="publication-authors">
								{publication.authors.map((author, index) => (
									<span key={author}>
										{index > 0 ? ' and ' : ''}
										{author === profile.name ? (
											<strong>{author}</strong>
										) : (
											author
										)}
									</span>
								))}
							</p>
							<p className="publication-venue">
								{publication.venue} ({publication.venueAbbreviation}),{' '}
								{publication.year}{' '}
								<span>
									—{' '}
									{publication.status === 'accepted'
										? 'Accepted'
										: publication.status === 'published'
											? 'Published'
											: 'Preprint'}
								</span>
							</p>
							<div className="research-links">
								<a
									className="text-link"
									href={publication.paperUrl}
									target="_blank"
									rel="noreferrer"
								>
									Paper ↗
								</a>
								{publication.pdfUrl ? (
									<a
										className="text-link"
										href={publication.pdfUrl}
										target="_blank"
										rel="noreferrer"
									>
										PDF ↗
									</a>
								) : null}
								{publication.demonstrationUrl ? (
									<a
										className="text-link"
										href={publication.demonstrationUrl}
										target={
											publication.demonstrationUrl.startsWith('#')
												? undefined
												: '_blank'
										}
										rel={
											publication.demonstrationUrl.startsWith('#')
												? undefined
												: 'noreferrer'
										}
									>
										Watch video ↑
									</a>
								) : null}
								<a className="text-link" href={`#project-${project.id}`}>
									Project overview ↗
								</a>
							</div>
						</div>
					</li>
				);
			})}
		</ol>
	</section>
);
export default PublicationsSection;
