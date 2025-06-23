import { JSX } from "react";
import { NavLink } from "react-router-dom";
import "./TopMenuNavItem.css";

interface Props {
  text: string;
  to: string;
}

export const TopMenuNavItem = ({ text, to }: Props): JSX.Element => {
  return (
    <NavLink to={to} className={({ isActive }) => `top-menu-nav-item d-inline-flex align-items-center px-4 text-decoration-none h-100 ${isActive ? "active fw-medium" : ""}`}>
      {text}
    </NavLink>
  );
};
