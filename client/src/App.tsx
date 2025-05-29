import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { NavigationMenu } from './components/Navbar/Navbar';
import DataPage from './pages/DataPage';
import DashboardPage from './pages/DashboardPage';
import AnomalyPage from './pages/AnomalyPage';
import PluginsPage from './pages/PluginsPage';
import RaportPage from './pages/RaportPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <NavigationMenu />
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/data" replace />} /> {/* Ustawienie domyślnej strony startowej na DataPage */}
          <Route path="/data" element={<DataPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/anomaly" element={<AnomalyPage />} />
          <Route path="/plugins" element={<PluginsPage />} />
          <Route path="/raport" element={<RaportPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/help" element={<HelpPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;