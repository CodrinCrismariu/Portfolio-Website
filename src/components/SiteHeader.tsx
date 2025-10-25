import { Link } from 'react-router-dom';

const resumeHref = (() => {
  const base = import.meta.env.BASE_URL ?? '/';
  return `${base}${base.endsWith('/') ? '' : '/'}Resume.pdf`;
})();

const SiteHeader = () => (
  <header className="site-header">
    <div className="site-header__inner">
      <Link to="/" className="site-header__brand">
        <span className="site-header__accent" />
        Codrin Crismariu
      </Link>
      <nav className="site-header__nav">
        <a href="mailto:codrin.crismariu@tufts.edu">Contact</a>
        <a href="https://www.linkedin.com/in/codrin-crismariu/" target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={resumeHref} target="_blank" rel="noreferrer">
          Resume
        </a>
      </nav>
    </div>
  </header>
);

export default SiteHeader;
