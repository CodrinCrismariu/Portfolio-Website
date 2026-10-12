import { useState } from 'react';
import Markdown from 'react-markdown';
import type { Project } from '../../types/projects';
import type { Publication } from '../../types/portfolio';
const ResearchSection = ({
	projects,
	publications,
}: {
	projects: Project[];
	publications: Publication[];
}) => {
	const [videoError, setVideoError] = useState(false);
	const featured = projects.find((project) => project.presentation === 'featured');
	const current = projects.filter(
		(project) => project.presentation === 'current' && project.kind === 'research',
	);
	if (!featured && current.length === 0) return null;
	const publication = publications.find((item) => item.projectId === featured?.id);
	return (
		<section className="research section" id="research" aria-labelledby="research-title">
			<div className="section-label">
				<span className="eyebrow">01 / Research</span>
				<span className="section-label__note">Humanoid control & perception</span>
			</div>
			<h2 className="sr-only" id="research-title">
				Featured and current research
			</h2>
			{featured ? (
				<article className="featured-research" id={`project-${featured.id}`}>
					<div className="featured-research__heading">
						<div>
							<p className="publication-line">
								{publication
									? `${publication.venueAbbreviation} ${publication.year} · ${publication.status === 'accepted' ? 'Accepted' : publication.status}`
									: 'Research project'}
							</p>
							<h3>
								<span className="featured-research__name">
									{featured.shortTitle ?? featured.title}
								</span>
								<span className="featured-research__title">
									{featured.shortTitle &&
									featured.title.startsWith(`${featured.shortTitle}: `)
										? featured.title.slice(featured.shortTitle.length + 2)
										: featured.title}
								</span>
							</h3>
						</div>
						<div className="featured-research__summary">
							<p>{featured.summary}</p>
							<p className="research-role">{featured.role}</p>
							<div className="research-links">
								{publication ? (
									<a
										className="text-link"
										href={publication.paperUrl}
										target="_blank"
										rel="noreferrer"
									>
										Read paper <span aria-hidden="true">↗</span>
									</a>
								) : null}
								{publication?.demonstrationUrl ? (
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
										Watch experiments <span aria-hidden="true">↓</span>
									</a>
								) : null}
							</div>
						</div>
					</div>
					{featured.research?.video ? (
						<figure
							className="research-figure research-video"
							id={`${featured.id}-video`}
						>
							<video
								controls
								crossOrigin="anonymous"
								playsInline
								preload="metadata"
								poster={featured.research.video.poster}
								width={1920}
								height={1080}
								aria-label={`${featured.shortTitle ?? featured.title} demonstration video`}
								aria-describedby={`${featured.id}-video-caption`}
								onError={() => setVideoError(true)}
							>
								<source src={featured.research.video.src} type="video/mp4" />
								<track
									kind="captions"
									src={featured.research.video.captions}
									srcLang="en"
									label="English"
								/>
								Your browser does not support embedded video. Use the download link
								below.
							</video>
							{videoError ? (
								<p className="research-video__error" role="status">
									The video could not load. You can download the full
									demonstration below.
								</p>
							) : null}
							<figcaption id={`${featured.id}-video-caption`}>
								<span>{featured.research.video.caption}</span>
								<a
									href={featured.research.video.src}
									download="MARCH-demonstration.mp4"
								>
									Download video ↓
								</a>
							</figcaption>
						</figure>
					) : featured.media ? (
						<figure className="research-figure">
							<a
								href={
									publication?.demonstrationUrl ??
									featured.media.sourceUrl ??
									featured.media.src
								}
								target="_blank"
								rel="noreferrer"
								aria-label={`View ${featured.shortTitle ?? featured.title} hardware experiments`}
							>
								<img
									src={featured.media.src}
									alt={featured.media.alt ?? featured.title}
									loading="eager"
									width={featured.media.width}
									height={featured.media.height}
								/>
							</a>
							<figcaption>
								<span>{featured.media.caption}</span>
								{featured.media.sourceUrl ? (
									<a
										href={featured.media.sourceUrl}
										target="_blank"
										rel="noreferrer"
									>
										Source figure ↗
									</a>
								) : null}
							</figcaption>
						</figure>
					) : (
						<div className="research-media-placeholder">
							Research media to be added.
						</div>
					)}
					{featured.research ? (
						<details className="research-details" id={`${featured.id}-details`}>
							<summary>
								More information
								<svg
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="1.5"
									aria-hidden="true"
									focusable="false"
								>
									<path d="m6 9 6 6 6-6" />
								</svg>
							</summary>
							<div className="research-details__content">
								<div className="research-methods">
									{featured.research.methods.map((method, index) => (
										<div key={method.label}>
											<span className="eyebrow">0{index + 1}</span>
											<h4>{method.label}</h4>
											<p>{method.detail}</p>
										</div>
									))}
								</div>
								<div className="research-evaluation">
									<div className="evaluation-heading">
										<h4>Simulation evaluation</h4>
										<span className="eyebrow">
											Model-free baseline comparison
										</span>
									</div>
									<dl className="research-results">
										{featured.research.results
											.filter((result) => result.environment === 'simulation')
											.map((result) => (
												<div key={result.label}>
													<dt>{result.label}</dt>
													<dd>
														<strong>{result.value}</strong>
														<span>{result.context}</span>
													</dd>
												</div>
											))}
									</dl>
									<p className="evaluation-note">
										{featured.research.evaluationNote}
									</p>
								</div>
								<div className="hardware-results">
									<div>
										<span className="eyebrow">Physical robot</span>
										<h4>Hardware demonstration</h4>
									</div>
									{featured.research.hardware.map((result) => (
										<div key={result.label}>
											<strong>{result.value}</strong>
											<span>{result.label}</span>
											<small>{result.detail}</small>
										</div>
									))}
								</div>
								{featured.research.figures?.length ? (
									<details className="research-supplement">
										<summary>
											Paper figures & simulation comparison{' '}
											<span aria-hidden="true">+</span>
										</summary>
										<div>
											{featured.research.figures.map((figure) => (
												<figure key={figure.src}>
													<img
														src={figure.src}
														alt={figure.alt}
														loading="lazy"
													/>
													<figcaption>
														<a
															href={figure.sourceUrl}
															target="_blank"
															rel="noreferrer"
														>
															{figure.caption} ↗
														</a>
													</figcaption>
												</figure>
											))}
										</div>
									</details>
								) : null}
							</div>
						</details>
					) : null}
				</article>
			) : null}
			{current.map((project) => (
				<article className="current-research" id={`project-${project.id}`} key={project.id}>
					<div>
						<p className="ongoing-label">
							<span className="status-dot" />
							Ongoing research
						</p>
						<span className="affiliation">{project.affiliation}</span>
					</div>
					<div>
						<h3>{project.title}</h3>
						<Markdown className="current-research__description">
							{project.description}
						</Markdown>
					</div>
				</article>
			))}
		</section>
	);
};
export default ResearchSection;
