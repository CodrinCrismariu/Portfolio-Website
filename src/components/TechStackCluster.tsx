const TECHNOLOGIES = [
  'React',
  'TypeScript',
  'Three.js',
  'ROS 2',
  'NxEagle Hardware',
  'Gazebo / Isaac Sim',
  'PX4',
  'OpenCV'
];

const TechStackCluster = () => (
  <section className="tech-cluster">
    <h2 className="section-heading">Build stack</h2>
    <p className="tech-cluster__intro">
      Tooling tuned for rapid prototyping in the lab and reliable deployment in the field.
    </p>
    <div className="tech-cluster__grid">
      {TECHNOLOGIES.map((tech) => (
        <span key={tech} className="tech-chip">
          {tech}
        </span>
      ))}
    </div>
  </section>
);

export default TechStackCluster;
