import { profile, assetUrl } from '../utils/portfolioData';
const SiteFooter = () => (
	<footer className="site-footer" id="contact">
		<div className="site-footer__contact">
			<div>
				<p className="eyebrow">Contact</p>
				<h2>Research inquiries</h2>
				<a className="contact-email" href={`mailto:${profile.email}`}>
					{profile.email} <span aria-hidden="true">↗</span>
				</a>
			</div>
			<div className="site-footer__resources">
				<a
					className="text-link"
					href={assetUrl(profile.resumePath)}
					target="_blank"
					rel="noreferrer"
				>
					Résumé ↗
				</a>
				<a className="text-link" href={profile.githubUrl} target="_blank" rel="noreferrer">
					GitHub ↗
				</a>
				<a
					className="text-link"
					href={profile.linkedinUrl}
					target="_blank"
					rel="noreferrer"
				>
					LinkedIn ↗
				</a>
			</div>
		</div>
		<div className="site-footer__inner">
			<span>
				© {new Date().getFullYear()} {profile.name}
			</span>
			<span>Tufts University · Mechanical Engineering</span>
			<a href="#top">Back to top ↑</a>
		</div>
	</footer>
);
export default SiteFooter;
