import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { UploadPage } from './pages/UploadPage';
import { ExplorerPage } from './pages/ExplorerPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { AssistantPage } from './pages/AssistantPage';
import { ImpactPage } from './pages/ImpactPage';
import { SettingsPage } from './pages/SettingsPage';

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Authenticated / App Shell Routes */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/explorer/:id" element={<ExplorerPage />} />
        <Route path="/explorer" element={<Navigate to="/explorer/repo-sample-1" replace />} />
        <Route path="/architecture/:id" element={<ArchitecturePage />} />
        <Route path="/architecture" element={<Navigate to="/architecture/repo-sample-1" replace />} />
        <Route path="/assistant/:id" element={<AssistantPage />} />
        <Route path="/assistant" element={<Navigate to="/assistant/repo-sample-1" replace />} />
        <Route path="/impact/:id" element={<ImpactPage />} />
        <Route path="/impact" element={<Navigate to="/impact/repo-sample-1" replace />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
