import { Link } from 'react-router-dom';

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
        <a href="/Resume.pdf" target="_blank" rel="noreferrer">
          Resume
        </a>
      </nav>
    </div>
  </header>
);

export default SiteHeader;
