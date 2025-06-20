import { JSX, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { Sidebar } from "../../components/SideBar/Sidebar";
import { Header } from "../../components/Header";

const HelpPage = (): JSX.Element => {
  const location = useLocation();

  // Persist the current help subpage in localStorage when on a /help/* route
  useEffect(() => {
    if (location.pathname.startsWith("/help/")) {
      localStorage.setItem("lastHelpTab", location.pathname);
    }
  }, [location.pathname]);

  // Redirect /help to the last visited subpage or default to /help/getting-started
  const lastHelpTab = localStorage.getItem("lastHelpTab") || "/help/getting-started";
  if (location.pathname === "/help") {
    return <Navigate to={lastHelpTab} replace />;
  }

  return (
    // Main container with flex layout to position sidebar and content
    <div className="d-flex flex-grow-1" style={{ gap: "var(--section-margin)", height: "100%" }}>
      <Sidebar page="help" /> {/* Sidebar variant for HelpPage */}
      <div
        className="section-container d-flex flex-column"
        style={{
          padding: "48px", // Main Section padding
          gap: "32px",
          overflowY: "auto", // Scrollbar for overflowing content
          height: "100%",
          width: "100%"
        }}>
        <Header title="Help & Documentation" subtitle="Learn how to use the time series analysis application effectively" />
        <Outlet /> {/* Renders Selected Help Subpage content */}
      </div>
    </div>
  );
};

export default HelpPage;
