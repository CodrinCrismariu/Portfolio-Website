import { Link } from 'react-router-dom';

const NotFoundPage = () => (
  <div className="not-found">
    <h1>Lost in the lab</h1>
    <p>That route doesn&apos;t exist. Let&apos;s guide you back to the deployments that do.</p>
    <Link className="button-link" to="/">
      Return to portfolio
    </Link>
  </div>
);

export default NotFoundPage;
