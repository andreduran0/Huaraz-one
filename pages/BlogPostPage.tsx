
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';

const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { blogPosts, socialLinks } = useAppContext();
  const post = blogPosts.find(p => p.id === id);

  const relatedPosts = blogPosts
    .filter(p => p.category === post?.category && p.id !== post?.id)
    .slice(0, 2);

  useEffect(() => {
    if (post) {
      document.title = `${post.title} | Blog Huaraz Explorer`;
      window.scrollTo(0, 0);
    }
  }, [post]);

  if (!post) {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-10 text-center">
            <h1 className="text-4xl font-black text-[#39FF14] uppercase italic tracking-tighter mb-4">Artículo Perdido</h1>
            <Link to="/blog" className="text-gray-500 font-black uppercase tracking-widest hover:text-white transition-colors">Volver al blog</Link>
        </div>
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen pb-40 font-['Plus_Jakarta_Sans'] text-white">
      
      {/* 1. HERO HEADER */}
      <header className="w-full h-[70vh] relative overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover grayscale-[0.3]" 
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent"></div>
        
        <div className="absolute inset-0 bg-[#39FF14]/5 pointer-events-none"></div>

        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container mx-auto px-8 pb-20 max-w-5xl">
            <Link to="/blog" className="inline-flex items-center gap-3 text-[#39FF14] mb-8 text-[10px] font-black uppercase tracking-[0.4em] bg-black/50 backdrop-blur-xl border border-[#39FF14]/30 px-6 py-3 rounded-full hover:bg-[#39FF14] hover:text-black transition-all shadow-[0_0_20px_rgba(57,255,20,0.2)]">
                <i className="fas fa-chevron-left"></i> Volver al blog
            </Link>
            <div className="space-y-4">
                <div className="flex gap-4 items-center">
                    <span className="bg-[#39FF14] text-black px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">{post.category}</span>
                    <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest">{post.date}</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                  {post.title}
                </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-8 max-w-5xl -mt-10 relative z-10">
        
        <div className="max-w-4xl mx-auto">
          
          {/* 2. AUTHOR CARD - FLOATING GLASS */}
          <div className="bg-[#0D0D0D]/80 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-3xl mb-16 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[#39FF14] flex items-center justify-center text-black font-black text-2xl italic shadow-[0_0_20px_#39FF14]">
                    {post.author.charAt(0)}
                </div>
                <div>
                    <p className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none mb-1">{post.author}</p>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">Editor Autorizado • Huaraz Explorer</p>
                </div>
            </div>
            <div className="flex gap-3">
                <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all">
                    <i className="fas fa-share-nodes"></i>
                </button>
                <button className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#39FF14] hover:bg-[#39FF14] hover:text-black transition-all">
                    <i className="fas fa-bookmark"></i>
                </button>
            </div>
          </div>

          {/* 3. VIDEO CONTENT */}
          {post.youtubeId && (
            <div className="mb-20 animate-fadeIn group">
              <div className="relative w-full aspect-video rounded-[3rem] overflow-hidden shadow-[0_0_60px_rgba(57,255,20,0.1)] border-2 border-[#39FF14]/20 bg-black group-hover:border-[#39FF14]/50 transition-all duration-700">
                <iframe
                  src={`https://www.youtube.com/embed/${post.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
              <div className="flex items-center justify-center gap-4 mt-6">
                 <div className="h-px bg-white/5 flex-grow"></div>
                 <p className="text-[9px] text-[#39FF14] font-black uppercase tracking-[0.4em] italic flex items-center gap-2">
                    <i className="fab fa-youtube animate-pulse text-red-500"></i> Video Premium Activo
                 </p>
                 <div className="h-px bg-white/5 flex-grow"></div>
              </div>
            </div>
          )}

          {/* 4. MAIN ARTICLE CONTENT */}
          <article className="prose prose-lg prose-invert max-w-none 
            prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-headings:text-[#39FF14]
            prose-p:text-gray-400 prose-p:leading-loose prose-p:font-medium
            prose-strong:text-white prose-strong:font-black
            prose-blockquote:border-[#39FF14] prose-blockquote:bg-white/5 prose-blockquote:rounded-3xl prose-blockquote:py-2
            prose-li:text-gray-400 prose-li:font-medium
            mb-24">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </article>

          {/* 5. RELATED POSTS */}
          {relatedPosts.length > 0 && (
            <div className="mt-32 pt-16 border-t border-white/10">
                <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-12">Más <span className="text-[#39FF14]">Historias</span></h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                    {relatedPosts.map(rp => (
                        <Link key={rp.id} to={`/blog/${rp.id}`} className="group block space-y-6">
                            <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden relative border border-white/5 shadow-xl group-hover:border-[#39FF14]/40 transition-all duration-500">
                                <img src={rp.image} alt={rp.title} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                            </div>
                            <h4 className="text-2xl font-black text-gray-400 group-hover:text-[#39FF14] transition-colors leading-none uppercase italic tracking-tighter">
                                {rp.title}
                            </h4>
                        </Link>
                    ))}
                </div>
            </div>
          )}
          
          {/* 6. NEWSLETTER CTA - NEON STYLE */}
          <div className="mt-24 p-12 bg-gradient-to-br from-[#0D0D0D] to-[#050505] rounded-[4rem] text-center border border-[#39FF14]/20 relative overflow-hidden shadow-3xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#39FF14]/10 blur-[100px] pointer-events-none"></div>
            <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">¿Te inspiró esta <span className="text-[#39FF14]">guía?</span></h3>
            <p className="text-gray-500 text-sm font-medium mb-12 max-w-sm mx-auto leading-relaxed">Suscríbete para recibir alertas de nuevas rutas y secretos de Huaraz antes que nadie.</p>
            <Link to="/newsletter" className="bg-[#39FF14] text-black px-12 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.2em] shadow-[0_15px_40px_rgba(57,255,20,0.3)] hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-3">
                <i className="fas fa-bolt"></i> Suscribirme ahora
            </Link>
          </div>

          {/* 7. SOCIAL LINKS SECTION */}
          <div className="mt-20 p-10 bg-[#0D0D0D] rounded-[3rem] border border-white/5">
            <h4 className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] mb-10 text-center">Protocolo de Conexión</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <a 
                href={socialLinks.instagram} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-3 px-8 py-5 bg-white/5 border border-white/10 text-gray-400 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white hover:border-transparent transition-all active:scale-95"
              >
                <i className="fab fa-instagram text-lg"></i>
                <span>Instagram</span>
              </a>
              <a 
                href={socialLinks.tiktok} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-3 px-8 py-5 bg-white/5 border border-white/10 text-gray-400 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-[#39FF14] hover:text-black hover:border-transparent transition-all active:scale-95"
              >
                <i className="fab fa-tiktok text-lg"></i>
                <span>TikTok</span>
              </a>
              <a 
                href={socialLinks.youtube} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-3 px-8 py-5 bg-white/5 border border-white/10 text-gray-400 rounded-3xl font-black uppercase text-[10px] tracking-widest hover:bg-[#FF0000] hover:text-white hover:border-transparent transition-all active:scale-95"
              >
                <i className="fab fa-youtube text-lg"></i>
                <span>YouTube</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      <div className="py-24 text-center">
         <p className="text-[10px] font-black text-gray-800 uppercase tracking-[0.5em] italic">Huaraz Explorer Network • Protocol v4.0</p>
      </div>
    </div>
  );
};

export default BlogPostPage;
