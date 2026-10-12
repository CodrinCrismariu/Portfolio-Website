import { useState } from 'react';
import { profile, assetUrl } from '../utils/portfolioData';
const SiteHeader = () => {
	const [menuOpen, setMenuOpen] = useState(false);
	return (
		<header className="site-header">
			<div className="site-header__inner">
				<a href="#top" className="site-header__brand" aria-label="Codrin Crismariu home">
					<span className="site-header__monogram" aria-hidden="true">
						CC<span>.</span>
					</span>
					<span>{profile.name}</span>
				</a>
				<button
					type="button"
					className="nav-toggle"
					aria-expanded={menuOpen}
					aria-controls="main-navigation"
					onClick={() => setMenuOpen(!menuOpen)}
				>
					{menuOpen ? 'Close' : 'Menu'}{' '}
					<span aria-hidden="true">{menuOpen ? '−' : '+'}</span>
				</button>
				<nav
					id="main-navigation"
					className={`site-header__nav ${menuOpen ? 'is-open' : ''}`}
					aria-label="Main navigation"
				>
					<a href="#research" onClick={() => setMenuOpen(false)}>
						Research
					</a>
					<a href="#experience" onClick={() => setMenuOpen(false)}>
						Experience
					</a>
					<a href="#publications" onClick={() => setMenuOpen(false)}>
						Publications
					</a>
					<a href="#projects" onClick={() => setMenuOpen(false)}>
						Engineering
					</a>
					<a href="#about" onClick={() => setMenuOpen(false)}>
						About
					</a>
					<a
						className="site-header__resume"
						onClick={() => setMenuOpen(false)}
						href={assetUrl(profile.resumePath)}
						target="_blank"
						rel="noreferrer"
					>
						Résumé <span aria-hidden="true">↗</span>
					</a>
				</nav>
			</div>
		</header>
	);
};
export default SiteHeader;
