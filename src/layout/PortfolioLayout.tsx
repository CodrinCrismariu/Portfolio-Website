import { ReactNode } from 'react';
import SiteFooter from '../components/SiteFooter';
import SiteHeader from '../components/SiteHeader';

type PortfolioLayoutProps = {
	children: ReactNode;
};

const PortfolioLayout = ({ children }: PortfolioLayoutProps) => (
	<div className="layout" id="top">
		<a className="skip-link" href="#main-content">
			Skip to content
		</a>
		<SiteHeader />
		<main id="main-content">{children}</main>
		<SiteFooter />
	</div>
);

export default PortfolioLayout;
