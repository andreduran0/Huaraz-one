
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MapPage from './pages/MapPage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import ChatPage from './pages/ChatPage';
import CouponsPage from './pages/CouponsPage';
import AdminPage from './pages/AdminPage';
import OnboardingPage from './pages/OnboardingPage';
import NewsletterPage from './pages/NewsletterPage';
import CalendarPage from './pages/CalendarPage';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/business/:id" element={<BusinessDetailPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/coupons" element={<CouponsPage />} />
          <Route path="/newsletter" element={<NewsletterPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
