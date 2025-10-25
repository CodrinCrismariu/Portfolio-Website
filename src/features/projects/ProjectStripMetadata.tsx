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
      {project.links.length > 0 && (
        <div className="project-strip__links">
          {project.links.map((link) => (
            <a key={link.url} className="button-link" href={link.url} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

export default ProjectStripMetadata;
