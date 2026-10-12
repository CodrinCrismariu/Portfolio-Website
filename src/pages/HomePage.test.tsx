import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';
import HomePage from './HomePage';
import { loadProjects } from '../utils/loadProjects';
import { publications, experience, profile, assetUrl } from '../utils/portfolioData';

beforeAll(() => {
	HTMLDialogElement.prototype.showModal = function () {
		this.setAttribute('open', '');
	};
	HTMLDialogElement.prototype.close = function () {
		this.removeAttribute('open');
	};
});
afterEach(cleanup);
const projects = loadProjects();
const show = () =>
	render(
		<MemoryRouter>
			<HomePage projects={projects} />
		</MemoryRouter>,
	);

describe('Research portfolio', () => {
	it('puts current research before experience, publications, and the engineering archive', () => {
		const { container } = show();
		expect(screen.getByRole('heading', { name: profile.name, level: 1 })).toBeInTheDocument();
		const sections = [...container.querySelectorAll('main > section')].map(
			(section) => section.id,
		);
		expect(sections).toEqual([
			'',
			'research',
			'experience',
			'publications',
			'projects',
			'about',
		]);
		expect(
			screen.getByRole('heading', { name: 'General-Purpose Tactile Representations' }),
		).toBeInTheDocument();
		expect(screen.getByText('Ongoing research')).toBeInTheDocument();
		expect(screen.getByText('Advanced Robotics R&D Intern')).toBeInTheDocument();
		expect(screen.getByText('3.97 / 4.00')).toBeInTheDocument();
	});
	it('keeps simulation results separate from the physical hardware demonstration', () => {
		const { container } = show();
		const simulation = within(container.querySelector('.research-evaluation') as HTMLElement);
		expect(simulation.getByText('66.7%')).toBeInTheDocument();
		expect(simulation.getByText(/1,024 randomized simulation trials/)).toBeInTheDocument();
		expect(simulation.getByText(/not physical-robot success rates/)).toBeInTheDocument();
		const hardware = within(container.querySelector('.hardware-results') as HTMLElement);
		expect(hardware.getByText('50 Hz')).toBeInTheDocument();
		expect(hardware.queryByText('66.7%')).not.toBeInTheDocument();
		expect(
			container.querySelector('#project-tactile-representations .research-results'),
		).toBeNull();
	});
	it('plays MARCH on the page and keeps both experiment links inside the site', () => {
		const { container } = show();
		const player = screen.getByLabelText('MARCH demonstration video');
		expect(player.tagName).toBe('VIDEO');
		expect(player).toHaveAttribute('controls');
		expect(player).toHaveAttribute('playsinline');
		expect(player).not.toHaveAttribute('autoplay');
		expect(player.querySelector('source')).toHaveAttribute(
			'src',
			'/Portfolio-Website/media/march/march-demo.mp4',
		);
		for (const name of ['Watch experiments', 'Watch video']) {
			const link = screen.getByRole('link', { name: new RegExp(name) });
			expect(link).toHaveAttribute('href', '#march-video');
			expect(link).not.toHaveAttribute('target');
		}
		expect(container.querySelector('a[href*="osf.io"], a[href*="tinyurl.com"]')).toBeNull();
		fireEvent.error(player);
		expect(screen.getByText(/The video could not load/)).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Download video ↓' })).toHaveAttribute(
			'href',
			'/Portfolio-Website/media/march/march-demo.mp4',
		);
	});
	it('preserves all legacy projects and opens their resources in an accessible dialog', () => {
		show();
		expect(screen.getByRole('status')).toHaveTextContent('14 of 14 projects');
		for (const project of projects.filter(
			(item) => !['featured', 'current'].includes(item.presentation ?? ''),
		)) {
			expect(
				screen.getByRole('button', { name: `View ${project.title}` }),
			).toBeInTheDocument();
		}
		fireEvent.click(screen.getByRole('button', { name: 'View Zoro V2 Quadruped' }));
		const dialog = screen.getByRole('dialog', { name: 'Zoro V2 Quadruped' });
		expect(
			within(dialog).getByRole('button', { name: 'Load 3D view of Zoro V2 Quadruped' }),
		).toBeInTheDocument();
		expect(within(dialog).getByRole('link', { name: 'Demo' })).toHaveAttribute(
			'href',
			expect.stringContaining('youtu.be/tsULRBhbrgA'),
		);
		fireEvent.click(within(dialog).getByRole('button', { name: 'Close project details' }));
		expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
	});
	it('combines filters and search, then restores the entire archive', () => {
		show();
		fireEvent.click(screen.getByRole('button', { name: 'Mobility' }));
		expect(screen.getByRole('status')).toHaveTextContent('2 of 14 projects');
		fireEvent.change(screen.getByRole('searchbox', { name: 'Search projects' }), {
			target: { value: 'nonexistent-project' },
		});
		expect(screen.getByRole('heading', { name: 'No projects found.' })).toBeInTheDocument();
		fireEvent.click(screen.getByRole('button', { name: 'Reset filters' }));
		expect(screen.getByRole('status')).toHaveTextContent('14 of 14 projects');
		expect(screen.getByRole('searchbox')).toHaveValue('');
		fireEvent.click(screen.getByRole('button', { name: 'Research & AI' }));
		expect(screen.getByRole('button', { name: 'View Humanoid Recovery' })).toBeInTheDocument();
	});
	it('resolves research assets and validates publication and experience references', () => {
		expect(projects).toHaveLength(16);
		expect(new Set(projects.map((project) => project.id)).size).toBe(projects.length);
		const march = projects.find((project) => project.id === 'march')!;
		expect(march.media?.src).not.toBe('./hardware-figure.png');
		expect(
			march.research?.figures?.every((figure) =>
				figure.src.startsWith('/Portfolio-Website/'),
			),
		).toBe(true);
		expect(
			projects.find((project) => project.id === 'tactile-representations')?.media,
		).toBeUndefined();
		expect(projects.filter((project) => project.media?.type === 'glb')).toHaveLength(12);
		for (const publication of publications) {
			expect(
				projects.find((project) => project.id === publication.projectId)?.publicationIds,
			).toContain(publication.id);
			expect(publication.paperUrl).toBe('https://arxiv.org/abs/2606.10288');
			expect(publication.demonstrationUrl).toBe('#march-video');
		}
		for (const entry of experience)
			for (const id of entry.relatedProjectIds)
				expect(projects.some((project) => project.id === id)).toBe(true);
		expect(assetUrl('/Resume_2.pdf')).toBe('/Portfolio-Website/Resume_2.pdf');
		expect(assetUrl('/Portfolio-Website/Resume_2.pdf')).toBe('/Portfolio-Website/Resume_2.pdf');
	});
});
