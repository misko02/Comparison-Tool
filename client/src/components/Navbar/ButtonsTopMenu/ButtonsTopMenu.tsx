import PropTypes from 'prop-types';
import { JSX } from 'react';
import { NavLink } from 'react-router-dom';
import './ButtonsTopMenu.css';

interface Props {
  text: string;
  to: string;
}

export const ButtonsTopMenu = ({ text = 'Text', to }: Props): JSX.Element => {
  return (
    <NavLink to={to} className={({ isActive }) => `buttons-top-menu active-${isActive}`}>
      <div className="text">{text}</div>
    </NavLink>
  );
};

ButtonsTopMenu.propTypes = {
  text: PropTypes.string,
  to: PropTypes.string.isRequired,
};