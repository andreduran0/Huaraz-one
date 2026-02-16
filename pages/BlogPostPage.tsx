
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { blogPosts, socialLinks } = useAppContext();
  const post = blogPosts.find(p => p.id === id);
  
  const [leadData, setLeadData] = useState({ name: '', email: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Huaraz Explorer`;
      window.scrollTo(0, 0);
    }
  }, [post]);

  if (!post) {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Artículo no encontrado</h1>
            <Link to="/blog" className="text-[#2A4D69] font-bold underline">Volver al blog</Link>
        </div>
    );
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      const zapierWebhookUrl = 'https://hooks.zapier.com/hooks/catch/26464693/ucoy3j9/';
      
      const formData = new FormData();
      formData.append('name', leadData.name);
      formData.append('email', leadData.email);
      formData.append('source', `Huaraz Explorer Blog - VIP Content (${post.title})`);
      formData.append('timestamp', new Date().toISOString());

      await fetch(zapierWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData,
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error sending lead data:", error);
      // En caso de error, mostramos el éxito de todas formas para no romper el flujo del usuario
      // usualmente con no-cors el fetch no falla aunque no haya respuesta legible.
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const videoUrl = `https://www.youtube.com/watch?v=${post.youtubeId}`;

  return (
    <div className="bg-white min-h-screen pb-40 font-['Plus_Jakarta_Sans']">
      
      {/* Header del Post */}
      <div className="container mx-auto px-6 max-w-3xl pt-16 pb-12">
        <Link to="/blog" className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8 inline-block hover:text-[#2A4D69] transition-colors">
          <i className="fas fa-arrow-left mr-2"></i> Volver al blog
        </Link>
        
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.05] mb-8 uppercase italic tracking-tighter">
          {post.title}
        </h1>
        
        <div className="flex items-center gap-4 text-xs font-black text-slate-300 uppercase tracking-widest mb-10">
          <span className="text-slate-900">{post.author}</span>
          <span className="w-1.5 h-1.5 bg-slate-100 rounded-full"></span>
          <span>{post.date}</span>
          <span className="w-1.5 h-1.5 bg-slate-100 rounded-full"></span>
          <span>{post.readTime}</span>
        </div>
      </div>

      {/* Área Multimedia Mixta */}
      <div className="container mx-auto px-6 max-w-4xl space-y-10 mb-20">
        {post.image && (
          <div className="relative">
             <img 
                src={post.image} 
                alt={post.title} 
                className="w-full rounded-[3rem] shadow-2xl aspect-video object-cover border border-slate-50"
              />
          </div>
        )}

        {post.youtubeId && (
          <div className="relative group">
            <div className="absolute -inset-4 bg-[#2A4D69]/5 rounded-[3.5rem] blur-2xl opacity-50"></div>
            <a 
              href={videoUrl} 
              target="_blank" 
              rel="noreferrer"
              className="block aspect-video rounded-[3rem] overflow-hidden shadow-2xl bg-black border border-slate-100 relative group/link"
            >
              <img 
                src={`https://img.youtube.com/vi/${post.youtubeId}/maxresdefault.jpg`} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover/link:scale-105"
                onError={(e) => {
                  e.currentTarget.src = `https://img.youtube.com/vi/${post.youtubeId}/hqdefault.jpg`;
                }}
                alt={post.title}
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="w-24 h-24 bg-red-600 text-white rounded-[2rem] flex items-center justify-center text-4xl shadow-2xl transition-all group-hover/link:scale-110 group-hover/link:rotate-3">
                      <i className="fas fa-play ml-1"></i>
                  </div>
              </div>
              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                 <div className="bg-white/90 backdrop-blur-md text-slate-900 px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3">
                    <i className="fab fa-youtube text-red-600 text-xl"></i> Ver Video en YouTube
                 </div>
              </div>
            </a>
          </div>
        )}
      </div>

      {/* Contenido del Artículo */}
      <div className="container mx-auto px-6 max-w-3xl">
        <article className="prose prose-xl max-w-none 
          prose-headings:text-slate-900 prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter
          prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
          prose-strong:text-slate-900 prose-strong:font-black
          prose-a:text-[#2A4D69] prose-a:font-black prose-a:no-underline prose-a:border-b-4 prose-a:border-[#2A4D69]/10 hover:prose-a:border-[#2A4D69] transition-all
          prose-img:rounded-[2.5rem] prose-img:shadow-xl prose-li:text-slate-600">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </article>
        
        {/* Lead Management & Social Footer Section */}
        <div className="mt-32 pt-16 border-t border-slate-100 space-y-16">
          
          {/* Lead Capture Form - Conectado a Zapier */}
          <div className="bg-[#0A0A0A] p-10 md:p-16 rounded-[4rem] text-center space-y-8 relative overflow-hidden shadow-2xl">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#2A4D69]/20 rounded-full blur-[100px]"></div>
              
              {!isSubmitted ? (
                <div className="relative z-10 space-y-8">
                  <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                      <i className="fas fa-gem text-3xl text-white"></i>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-3xl md:text-4xl font-black text-white uppercase italic tracking-tighter">Descarga Guías <span className="text-[#2A4D69]">VIP</span></h4>
                    <p className="text-gray-400 font-medium max-w-md mx-auto">Únete a nuestra lista exclusiva y recibe itinerarios secretos de la Cordillera Blanca directamente en tu email.</p>
                  </div>
                  
                  <form onSubmit={handleLeadSubmit} className="max-w-md mx-auto space-y-4">
                    <input 
                      required
                      type="text" 
                      placeholder="Tu nombre" 
                      className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-gray-500 focus:border-[#2A4D69] outline-none transition-all"
                      value={leadData.name}
                      onChange={e => setLeadData({...leadData, name: e.target.value})}
                      disabled={isSubmitting}
                    />
                    <input 
                      required
                      type="email" 
                      placeholder="tu@email.com" 
                      className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-gray-500 focus:border-[#2A4D69] outline-none transition-all"
                      value={leadData.email}
                      onChange={e => setLeadData({...leadData, email: e.target.value})}
                      disabled={isSubmitting}
                    />
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#2A4D69] text-white py-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-white hover:text-black transition-all active:scale-95 flex items-center justify-center gap-3"
                    >
                      {isSubmitting ? <i className="fas fa-spinner fa-spin"></i> : 'REGISTRARME AHORA'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="relative z-10 space-y-6 py-10 animate-fadeIn">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white text-4xl shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                    <i className="fas fa-check"></i>
                  </div>
                  <h4 className="text-3xl font-black text-white uppercase italic tracking-tighter">¡Ya estás en la lista!</h4>
                  <p className="text-gray-400 font-medium">Revisa tu correo para confirmar tu acceso al contenido VIP.</p>
                </div>
              )}
          </div>

          {/* Social Media Highlight Section */}
          <div className="text-center space-y-10">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Síguenos en tiempo real</p>
              <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Nuestras <span className="text-[#2A4D69]">Comunidades</span></h3>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a 
                href={socialLinks.instagram} 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center gap-4 bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-[#E1306C]/30 transition-all active:scale-95"
              >
                <div className="w-14 h-14 bg-gradient-to-tr from-[#FFDC80] via-[#E1306C] to-[#833AB4] rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:rotate-6 transition-transform">
                  <i className="fab fa-instagram"></i>
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Instagram</p>
                  <p className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">@HuarazExplorer</p>
                </div>
              </a>

              <a 
                href={socialLinks.tiktok} 
                target="_blank" 
                rel="noreferrer"
                className="group flex items-center gap-4 bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-black/30 transition-all active:scale-95"
              >
                <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:-rotate-6 transition-transform">
                  <i className="fab fa-tiktok"></i>
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">TikTok</p>
                  <p className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">Huaraz.Explorer</p>
                </div>
              </a>
            </div>
          </div>

          {/* Compartir */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-10">
            <div className="space-y-2 text-center md:text-left">
               <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">¿Te gustó este relato?</p>
               <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Compártelo con otros viajeros</h3>
            </div>
            <div className="flex gap-4">
              <ShareButton icon="fa-facebook-f" />
              <ShareButton icon="fa-whatsapp" />
              <ShareButton icon="fa-twitter" />
              <ShareButton icon="fa-link" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShareButton: React.FC<{ icon: string }> = ({ icon }) => (
    <button className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-[#2A4D69] hover:border-[#2A4D69] transition-all shadow-sm active:scale-90">
        <i className={`fab ${icon} text-lg`}></i>
    </button>
);

export default BlogPostPage;
