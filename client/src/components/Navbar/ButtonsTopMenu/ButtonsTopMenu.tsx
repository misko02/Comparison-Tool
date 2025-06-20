import PropTypes from 'prop-types'; // Library for data type validation
import { JSX } from 'react';
import { NavLink } from 'react-router-dom'; // Component from react-router-dom that creates a navigational link with active path highlighting
import './ButtonsTopMenu.css';

interface Props {
  text: string;
  to: string; // URL path (required)
}

export const ButtonsTopMenu = ({ text = 'Text', to }: Props): JSX.Element => {
  return (
    // Based on the boolean isActive, adds CSS class active-true or active-false, changing button styles accordingly
    // The isActive value is provided by NavLink, which checks if the current URL path matches the "to" prop
    <NavLink to={to} className={({ isActive }) => `buttons-top-menu active-${isActive}`}>
      <div className="text">{text}</div>
    </NavLink>
  );
};

ButtonsTopMenu.propTypes = {
  text: PropTypes.string,
  to: PropTypes.string.isRequired,
};