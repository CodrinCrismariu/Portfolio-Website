import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';
import HomePage from './HomePage';
import type { Project } from '../types/projects';

const mockProjects: Project[] = [
  {
    id: 'demo',
    title: 'Demo Project',
    summary: 'A sample robotics deployment.',
    description: '## Capabilities\n\n- Navigation\n- Telemetry',
    tags: ['Test'],
    links: [],
    media: {
      type: 'image',
      src: 'demo.png',
      resources: [],
      poster: null
    },
    order: 0
  }
];

describe('HomePage', () => {
  it('renders hero and project list', () => {
    render(
      <MemoryRouter>
        <HomePage projects={mockProjects} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole('heading', {
        name: /Codrin Crismariu builds robots that endure\./i
      })
    ).toBeInTheDocument();
    expect(screen.getByText('Demo Project')).toBeInTheDocument();
  });
});
