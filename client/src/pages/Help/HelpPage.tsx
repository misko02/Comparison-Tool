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
    <div className="d-flex flex-grow-1 gap-3 h-100">
      <Sidebar page="help" /> {/* Sidebar variant for HelpPage */}
      <div className="section-container d-flex flex-column p-5 gap-5 h-100 w-100 overflow-auto">
        <Header title="Help & Documentation" subtitle="Learn how to use the time series analysis application effectively" />
        <Outlet /> {/* Renders selected help subpage content */}
      </div>
    </div>
  );
};

export default HelpPage;
