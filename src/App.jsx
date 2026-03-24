// ============================================================
// App.jsx — 路由入口 + 全局布局
// Context Providers 在此层包裹，确保状态不受路由切换影响
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

// 在入口处捕获 ?theme 并动态加载独立的 css（隔离 Vibe 版本）
const params = new URLSearchParams(window.location.search);
const theme = params.get('theme');

if (theme === 'vibe') {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/vibe-override.css';
  document.head.appendChild(link);
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
