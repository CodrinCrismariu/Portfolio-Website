import { profile } from '../utils/portfolioData';
const AboutSection = () => (
	<section className="about section" id="about" aria-labelledby="about-title">
		<div className="section-label">
			<span className="eyebrow">05 / Background</span>
		</div>
		<div className="about__grid">
			<div>
				<h2 id="about-title">Education</h2>
				<div className="education">
					<h3>{profile.education.institution}</h3>
					<p>{profile.education.degree}</p>
					<dl>
						<div>
							<dt>Expected graduation</dt>
							<dd>{profile.education.graduationYear}</dd>
						</div>
						<div>
							<dt>GPA</dt>
							<dd>{profile.education.gpa}</dd>
						</div>
					</dl>
				</div>
			</div>
			<div>
				<h2>Technical background</h2>
				<dl className="skills-list">
					{profile.skills.map((group) => (
						<div key={group.label}>
							<dt>{group.label}</dt>
							<dd>{group.items.join(' · ')}</dd>
						</div>
					))}
				</dl>
			</div>
		</div>
	</section>
);
export default AboutSection;
