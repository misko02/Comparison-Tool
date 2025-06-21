import { JSX } from "react";
import { NavLink } from "react-router-dom";
import "./ButtonsTopMenu.css";

interface Props {
  text: string;
  to: string;
}

export const ButtonsTopMenu = ({ text, to }: Props): JSX.Element => {
  return (
    <NavLink to={to} className={({ isActive }) => `buttons-top-menu d-inline-flex align-items-center px-4 text-decoration-none h-100 ${isActive ? "active fw-medium" : ""}`}>
      {text}
    </NavLink>
  );
};
