import { ReactNode } from 'react';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';

type PortfolioLayoutProps = {
  children: ReactNode;
};

const PortfolioLayout = ({ children }: PortfolioLayoutProps) => (
  <div className="layout">
    <SiteHeader />
    <main>{children}</main>
    <SiteFooter />
  </div>
);

export default PortfolioLayout;
