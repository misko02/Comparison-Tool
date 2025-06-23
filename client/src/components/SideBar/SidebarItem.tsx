import { JSX } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

interface Props {
  text: string; // Text displayed in the item
  to: string; // URL path for the navigation link
}

export const SidebarItem = ({ text, to }: Props): JSX.Element => {
  return (
    <NavLink to={to} className={({ isActive }) => `sidebar-item d-flex align-items-center px-3 py-2 custom-rounded text-decoration-none text-start ${isActive ? "active" : ""}`}>
      <span className="fs-6 fw-medium">{text}</span> {/* Item text */}
    </NavLink>
  );
};
