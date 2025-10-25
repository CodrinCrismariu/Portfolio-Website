import { useMemo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { loadProjects } from './utils/loadProjects';
import HomePage from './pages/HomePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const projects = useMemo(() => loadProjects(), []);

  return (
    <Routes>
      <Route path="/" element={<HomePage projects={projects} />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
