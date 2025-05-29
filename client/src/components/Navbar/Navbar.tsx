import { JSX } from 'react';
import './Navbar.css';
import { ButtonsTopMenu } from './ButtonsTopMenu/ButtonsTopMenu';

interface NavItem {
  text: string;
  to: string;
}

export const NavigationMenu = (): JSX.Element => {
  // Array with the list of menu subpages, their names, and paths
  const navItems: NavItem[] = [
    { text: 'Data', to: '/data' },
    { text: 'Dashboard', to: '/dashboard' },
    { text: 'Anomaly', to: '/anomaly' },
    { text: 'Plugins', to: '/plugins' },
    { text: 'Raport', to: '/raport' },
    { text: 'Settings', to: '/settings' },
    { text: 'Help', to: '/help' },
  ];

  return (
    <div className="navigation-menu top">
      <div className="logo-placeholder">Logo</div>
      {/* navItems.map transforms each array element into a ButtonsTopMenu component */}
      {navItems.map(
        (item) => (
          <ButtonsTopMenu
            key={item.text}
            text={item.text}
            to={item.to}
          />
        )
      )}
    </div>
  );
};