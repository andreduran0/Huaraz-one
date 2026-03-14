import JobsPage from './pages/JobsPage';
import ArkaikoChat from './components/ArkaikoChat';
import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
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
    const origin = window.location.origin;
    let title = "Huaraz Explorer | Plataforma Turística en Huaraz 2026";
    let desc = "La guía definitiva de Huaraz: Hoteles, Restaurantes y Tours en la Cordillera Blanca. Planifica tu viaje con nuestra plataforma de recomendaciones turísticas.";
    let image = "https://i.imgur.com/Cax54U1.png";
    let canonical = `${origin}${path}`;

    if (path === '/') {
      title = "Huaraz Explorer | Plataforma de Recomendaciones Turísticas en Huaraz";
      desc = "Descubre lo mejor de Huaraz en 2026: Hoteles, Restaurantes y Tours en la Cordillera Blanca. La guía oficial para el viajero moderno.";
    } else if (path.startsWith('/blog/')) {
      title = "Guía de Viaje | Huaraz Explorer";
    } else if (path.includes('/map')) {
      title = "Mapa Interactivo de Huaraz 2026 | Ubica Hoteles y Tours";
      desc = "Explora Huaraz con nuestro mapa interactivo. Ubica en tiempo real los mejores puntos turísticos y negocios locales.";
    } else if (path.includes('/blog')) {
      title = "Guías de Viaje y Trekking en Huaraz | Blog Huaraz Explorer";
      desc = "Consejos de expertos, rutas de trekking en la Cordillera Blanca y relatos de viaje para tu aventura en Ancash.";
    } else if (path.includes('/chat')) {
      title = "Asistente IA Turístico de Huaraz | Consultas 24/7";
      desc = "Pregúntale a nuestra Inteligencia Artificial sobre el clima, rutas de trekking y recomendaciones personalizadas en Huaraz.";
    } else if (path.includes('/coupons')) {
      title = "Cupones de Descuento en Huaraz | Ahorra en tu Viaje";
      desc = "Obtén beneficios exclusivos y descuentos en los mejores hoteles y restaurantes de Huaraz con Huaraz Explorer.";
    } else if (path.includes('/calendar')) {
      title = "Calendario de Fiestas y Eventos en Huaraz 2026";
      desc = "No te pierdas ninguna festividad. Consulta el calendario oficial de eventos, fiestas patronales y actividades culturales en Ancash.";
    } else if (path.includes('/newsletter')) {
      title = "Newsletter Huaraz Explorer | Noticias de Turismo y Tecnología";
      desc = "Suscríbete para recibir las últimas novedades sobre turismo, ciencia y tecnología en la región de Huaraz.";
    } else if (path.includes('/business/')) {
      title = "Detalle del Negocio | Huaraz Explorer";
    } else if (path.includes('/empleos')) { // <-- NUEVO: SEO PARA BOLSA DE TRABAJO
      title = "Bolsa de Trabajo en Huaraz | Huaraz Explorer";
      desc = "Encuentra las mejores oportunidades laborales en hoteles, restaurantes y empresas turísticas de Huaraz. ¡Postula hoy mismo!";
    }

    document.title = title;

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

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonical);

    updateMeta('description', desc);
    updateMeta('og:title', title, true);
    updateMeta('og:description', desc, true);
    updateMeta('og:image', image, true);
    updateMeta('og:url', canonical, true);
    updateMeta('twitter:title', title);
    updateMeta('twitter:description', desc);
    updateMeta('twitter:image', image);

    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
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
          <Route path="/empleos" element={<JobsPage />} /> {/* <-- NUEVO: RUTA REGISTRADA */}
        </Routes>
        <ArkaikoChat ciudadId="huaraz" />
      </Layout>
    </BrowserRouter>
  );
};

export default App;
