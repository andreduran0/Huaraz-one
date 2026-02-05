
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

const MetaManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    let title = "Huaraz Explorer | Guía Turística de Ancash";
    let desc = "Descubre lo mejor de Huaraz: hoteles, restaurantes y rutas de trekking en la Cordillera Blanca.";
    let image = "https://i.imgur.com/Cax54U1.png";

    if (path.includes('/map')) {
      title = "Mapa Interactivo de Huaraz | Huaraz Explorer";
      desc = "Ubica en tiempo real los mejores puntos turísticos y negocios de Huaraz.";
    } else if (path.includes('/blog')) {
      title = "Guías y Relatos de Viaje | Huaraz Explorer Blog";
      desc = "Las mejores historias y consejos de expertos para tu aventura en los Andes.";
    } else if (path.includes('/chat')) {
      title = "Asistente IA Turístico | Huaraz Explorer";
      desc = "Pregúntale a nuestra IA sobre rutas, clima y recomendaciones en Huaraz.";
    } else if (path.includes('/coupons')) {
      title = "Cupones y Descuentos | Huaraz Explorer";
      desc = "Ahorra en tu viaje con beneficios exclusivos en locales seleccionados.";
    }

    // Actualizar Título
    document.title = title;

    // Actualizar Meta Descripción
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', desc);
    updateMeta('og:title', title, true);
    updateMeta('og:description', desc, true);
    updateMeta('og:image', image, true);
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', desc);
    updateMeta('twitter:image', image);

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
