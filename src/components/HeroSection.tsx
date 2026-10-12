import { profile, assetUrl } from '../utils/portfolioData';
const HeroSection = () => (
	<section className="hero" aria-labelledby="hero-title">
		<div className="hero__content">
			<p className="eyebrow">{profile.headline}</p>
			<h1 id="hero-title">{profile.name}</h1>
			<p className="hero__body">{profile.introduction}</p>
			<div className="hero__actions">
				<a
					className="button-link button-link--primary"
					href={assetUrl(profile.resumePath)}
					target="_blank"
					rel="noreferrer"
				>
					Résumé <span aria-hidden="true">↗</span>
				</a>
				<a className="text-link" href={`mailto:${profile.email}`}>
					Email <span aria-hidden="true">↗</span>
				</a>
				<a className="text-link" href={profile.githubUrl} target="_blank" rel="noreferrer">
					GitHub <span aria-hidden="true">↗</span>
				</a>
			</div>
		</div>
		<div className="hero__context">
			<a href="#experience-sparc">
				<span className="eyebrow">Current research</span>
				<strong>SPARC Lab</strong>
				<span>Tufts University · 2026–present</span>
				<span className="context-arrow" aria-hidden="true">
					↗
				</span>
			</a>
			<a href="#experience-magna">
				<span className="eyebrow">Industry experience</span>
				<strong>Magna International</strong>
				<span>Advanced Robotics R&D · Summer 2026</span>
				<span className="context-arrow" aria-hidden="true">
					↗
				</span>
			</a>
		</div>
	</section>
);
export default HeroSection;
