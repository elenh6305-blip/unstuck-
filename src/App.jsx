// ============================================================
// App.jsx - routing entry and shared app shell
// Keep providers here so route changes do not reset app state.
// ============================================================

import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { TaskProvider } from './contexts/TaskContext';
import { FocusProvider } from './contexts/FocusContext';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <TaskProvider>
        <FocusProvider>
          <main className="app-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </main>
          <BottomNav activePath={location.pathname} onNavigate={navigate} />
        </FocusProvider>
      </TaskProvider>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
