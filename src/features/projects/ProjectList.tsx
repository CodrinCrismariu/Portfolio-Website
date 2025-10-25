import { Fragment } from 'react';
import type { Project } from '../../types/projects';
import ProjectStrip from './ProjectStrip';

const toTimestamp = (value?: string | null) => {
  if (!value) return Number.NEGATIVE_INFINITY;
  const time = Date.parse(value);
  return Number.isNaN(time) ? Number.NEGATIVE_INFINITY : time;
};

const ProjectList = ({ projects }: { projects: Project[] }) => {
  const sorted = [...projects].sort((a, b) => {
    const timeA = toTimestamp(a.date ?? null);
    const timeB = toTimestamp(b.date ?? null);
    if (timeA === timeB) {
      return (b.order ?? 0) - (a.order ?? 0);
    }
    return timeB - timeA;
  });

  const ongoingProjects = sorted.filter((project) => project.status === 'ongoing');
  const pastProjects = sorted.filter((project) => project.status !== 'ongoing');

  return (
    <>
      {ongoingProjects.length > 0 ? (
        <section className="project-list">
          <h2 className="section-heading">Ongoing projects</h2>
          <div className="project-list__strips">
            {ongoingProjects.map((project, index) => (
              <Fragment key={project.id}>
                <ProjectStrip project={project} index={index} />
              </Fragment>
            ))}
          </div>
        </section>
      ) : null}

      <section className="project-list">
        <h2 className="section-heading">Past projects</h2>
        <div className="project-list__strips">
          {pastProjects.map((project, index) => (
            <Fragment key={project.id}>
              <ProjectStrip project={project} index={index} />
            </Fragment>
          ))}
        </div>
      </section>
    </>
  );
};

export default ProjectList;
