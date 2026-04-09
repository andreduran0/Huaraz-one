import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../services/supabase';

const BlogPostPage: React.FC = () => {
  const { id: slugOrId } = useParams<{ id: string }>();
  const { blogPosts: localPosts, socialLinks } = useAppContext();
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [leadData, setLeadData] = useState({ name: '', email: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        if (!slugOrId) return;

        let { data, error } = await supabase
          .from('posts')
          .select('*, video_url')
          .eq('slug', slugOrId)
          .single();

        if (error || !data) {
          const { data: dataById, error: errorById } = await supabase
            .from('posts')
            .select('*, video_url')
            .eq('id', slugOrId)
            .single();
          
          if (!errorById && dataById) {
            data = dataById;
          }
        }

        if (data) {
          setPost(data);
        } else {
          const local = localPosts.find(p => p.id === slugOrId || p.slug === slugOrId);
          setPost(local || null);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slugOrId, localPosts]);

  useEffect(() => {
    if (post) {
      document.title = `${post.meta_title || post.title} | Huaraz Explorer`;
      window.scrollTo(0, 0);

      if (post.meta_description) {
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) metaDesc.setAttribute('content', post.meta_description);
      }
    }
  }, [post]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-[#2A4D69]"></i>
      </div>
    );
  }

  if (!post) {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
            <h1 className="text-3xl font-black text-slate-900 mb-4 uppercase italic">Artículo no encontrado</h1>
            <p className="text-slate-500 mb-8">No pudimos encontrar el artículo: <span className="font-bold text-red-500">{slugOrId}</span></p>
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
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const featuredImage = post.featured_image || post.image;

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
          <span className="text-slate-900">{post.author || 'Huaraz Explorer'}</span>
          <span className="w-1.5 h-1.5 bg-slate-100 rounded-full"></span>
          <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Reciente'}</span>
        </div>
      </div>

      {/* Área Multimedia (YouTube o Imagen) */}
      <div className="container mx-auto px-6 max-w-4xl space-y-10 mb-20">
        <div className="relative group">
          <div className="absolute -inset-4 bg-[#2A4D69]/5 rounded-[3.5rem] blur-2xl opacity-50"></div>
          
          <div 
            className="relative w-full rounded-[3rem] overflow-hidden shadow-2xl bg-black border border-slate-100"
            style={{ paddingBottom: '56.25%' }}
          >
            {post.video_url ? (
               <iframe
                 className="absolute top-0 left-0 w-full h-full"
                 src={post.video_url}
                 title={post.title}
                 frameBorder="0"
                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                 allowFullScreen
               ></iframe>
            ) : featuredImage && (
               <img 
                  src={featuredImage} 
                  alt={post.title} 
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
            )}
          </div>
        </div>
      </div>

      {/* Contenido del Artículo */}
      <div className="container mx-auto px-6 max-w-3xl">
        <article className="prose prose-xl max-w-none 
          prose-headings:text-slate-900 prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter
          prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
          prose-strong:text-slate-900 prose-strong:font-black
          prose-a:text-[#2A4D69] prose-a:font-black prose-a:no-underline prose-a:border-b-4 prose-a:border-[#2A4D69]/10 hover:prose-a:border-[#2A4D69] transition-all
          prose-img:rounded-[2.5rem] prose-img:shadow-xl prose-li:text-slate-600">
          <ReactMarkdown>{post.content || ''}</ReactMarkdown>
        </article>
        
        {/* Formularios VIP y Redes Sociales */}
        <div className="mt-32 pt-16 border-t border-slate-100 space-y-16">
          
          {/* SECCIÓN VIP / LEAD GEN */}
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
                    <input required type="text" placeholder="Tu nombre" className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-gray-500 focus:border-[#2A4D69] outline-none transition-all" value={leadData.name} onChange={e => setLeadData({...leadData, name: e.target.value})} disabled={isSubmitting} />
                    <input required type="email" placeholder="tu@email.com" className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-gray-500 focus:border-[#2A4D69] outline-none transition-all" value={leadData.email} onChange={e => setLeadData({...leadData, email: e.target.value})} disabled={isSubmitting} />
                    <button type="submit" disabled={isSubmitting} className="w-full bg-[#2A4D69] text-white py-6 rounded-2xl font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:bg-white hover:text-black transition-all active:scale-95 flex items-center justify-center gap-3">
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

          {/* REDES SOCIALES */}
          <div className="text-center space-y-10">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Síguenos en tiempo real</p>
              <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Nuestras <span className="text-[#2A4D69]">Comunidades</span></h3>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <a href={socialLinks?.instagram || '#'} target="_blank" rel="noreferrer" className="group flex items-center gap-4 bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-[#E1306C]/30 transition-all active:scale-95">
                <div className="w-14 h-14 bg-gradient-to-tr from-[#FFDC80] via-[#E1306C] to-[#833AB4] rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg group-hover:rotate-6 transition-transform">
                  <i className="fab fa-instagram"></i>
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Instagram</p>
                  <p className="text-lg font-black text-slate-900 uppercase italic tracking-tighter">@HuarazExplorer</p>
                </div>
              </a>

              <a href={socialLinks?.tiktok || '#'} target="_blank" rel="noreferrer" className="group flex items-center gap-4 bg-white border border-slate-100 p-6 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-black/30 transition-all active:scale-95">
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

          {/* COMPARTIR */}
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
