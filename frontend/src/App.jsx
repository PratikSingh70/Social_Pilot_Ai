import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AppShell from './components/AppShell';
import Dashboard from './pages/Dashboard';
import AIStudio from './pages/AIStudio';
import CreatePost from './pages/CreatePost';
import CalendarPage from './pages/CalendarPage';
import Library from './pages/Library';
import Analytics from './pages/Analytics';
import Insights from './pages/Insights';
import Accounts from './pages/Accounts';
import Settings from './pages/Settings';
import SearchResults from './pages/SearchResults';
import FAQ from './pages/FAQ';
import LegalPage from './pages/LegalPage';
import ScrollProgressBar from './components/ScrollProgressBar';
import CookieBanner from './components/CookieBanner';
import ContactPanel from './components/ContactPanel';

function RequireAuth({ children }) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}

export default function App() {
  return (
    <>
      <ScrollProgressBar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<LegalPage docType="privacy" />} />
        <Route path="/terms" element={<LegalPage docType="terms" />} />
        <Route path="/cookies" element={<LegalPage docType="cookies" />} />

        <Route path="/app" element={<RequireAuth><AppShell /></RequireAuth>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="ai-studio" element={<AIStudio />} />
          <Route path="create" element={<CreatePost />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="library" element={<Library />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="insights" element={<Insights />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="settings" element={<Settings />} />
          <Route path="search" element={<SearchResults />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <CookieBanner />
      <ContactPanel />
    </>
  );
}