
import React, { useEffect } from 'react';
import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
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
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';

// Componente para forzar la actualización de SEO en cada cambio de página
const MetaManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "Huaraz Explorer | Guía Turística de Ancash";
    let desc = "Descubre lo mejor de Huaraz: hoteles, restaurantes y rutas de trekking en la Cordillera Blanca.";

    if (path.includes('/map')) {
      title = "Mapa Interactivo de Huaraz | Huaraz Explorer";
      desc = "Ubica los mejores lugares de Huaraz en tiempo real con nuestro mapa turístico.";
    } else if (path.includes('/blog')) {
      title = "Guías y Relatos de Viaje | Huaraz Explorer Blog";
      desc = "Lee las mejores crónicas y consejos para visitar la Laguna 69 y más.";
    } else if (path.includes('/coupons')) {
      title = "Cupones y Descuentos en Huaraz | Huaraz Explorer";
      desc = "Ahorra en tu viaje con beneficios exclusivos en los mejores locales de Huaraz.";
    }

    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", desc);
    
    // Avisar a Google que el contenido ha cambiado (para navegadores modernos)
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <MetaManager />
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
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
