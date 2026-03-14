import { useMemo } from 'react';
import type { Project } from '../../types/projects';

const ProjectStripMetadata = ({ project }: { project: Project }) => {
  const formattedDate = useMemo(() => {
    if (!project.date) return null;
    const parsed = Date.parse(project.date);
    if (Number.isNaN(parsed)) return null;
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short'
    }).format(parsed);
  }, [project.date]);

  return (
    <header className="project-strip__header">
      <div className="project-strip__eyebrow">
        {project.tags.join(' · ')}
        {formattedDate ? ` · ${formattedDate}` : ''}
      </div>
      <h3 className="project-strip__title">{project.title}</h3>
      {project.summary ? <p className="project-strip__summary">{project.summary}</p> : null}
      {(project.links.length > 0 || project.awards.length > 0) && (
        <div className="project-strip__ancillary">
          {project.links.length > 0 && (
            <div className="project-strip__links">
              {project.links.map((link) => (
                <a
                  key={link.url}
                  className="button-link"
                  href={(() => {
                    if (link.url.startsWith('http')) return link.url;
                    const base = import.meta.env.BASE_URL ?? '/';
                    const trimmedBase = base.endsWith('/') && base !== '/' ? base.slice(0, -1) : base === '/' ? '' : base;
                    if (trimmedBase && link.url.startsWith(trimmedBase)) return link.url;
                    return `${trimmedBase}${link.url.startsWith('/') ? '' : '/'}${link.url}`;
                  })()}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                </a>
              ))}
            </div>
          )}
          {project.awards.length > 0 && (
            <div className="project-strip__awards">
              <h4 className="project-strip__awards-title">Awards</h4>
              <ul className="project-strip__award-list">
                {project.awards.map((award) => (
                  <li key={award} className="project-strip__award">
                    {award}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default ProjectStripMetadata;
