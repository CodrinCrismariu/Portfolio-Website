import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { loadProjects } from './utils/loadProjects';
import HomePage from './pages/HomePage';

function App() {
  const location = useLocation();
  const projects = useMemo(() => loadProjects(), []);

  return <HomePage key={location.pathname} projects={projects} />;
}

export default App;
