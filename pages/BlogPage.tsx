
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTranslations } from '../hooks/useTranslations';

const BlogPage: React.FC = () => {
  const { blogPosts } = useAppContext();
  const t = useTranslations();

  const allPosts = blogPosts;

  return (
    <div className="bg-[#050505] min-h-screen pb-40 font-['Plus_Jakarta_Sans'] overflow-hidden">
      
      {/* 1. HERO SECTION - TECH DARK STYLE */}
      <section className="relative bg-[#0A0A0A] pt-28 pb-44 rounded-b-[5rem] px-8 text-center border-b border-[#39FF14]/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#39FF14]/5 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#39FF14]/5 rounded-full blur-[130px] pointer-events-none"></div>
        
        <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-3 bg-[#39FF14]/10 border border-[#39FF14]/30 text-[#39FF14] px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                <span className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Huaraz Explorer Network</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white uppercase italic tracking-tighter leading-none">
              Guías & <span className="text-[#39FF14] drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]">Relatos</span>
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg md:text-xl font-bold uppercase tracking-wide leading-relaxed">
                Bitácoras de aventura, cultura y tecnología en el corazón de los Andes.
            </p>
        </div>
      </section>

      <div className="container mx-auto px-8 -mt-24 max-w-6xl relative z-20">
        
        {/* 2. FILTER BAR (Estilizada) */}
        <div className="flex items-center gap-4 mb-12 overflow-x-auto no-scrollbar pb-4">
            <div className="bg-[#0D0D0D] p-1.5 rounded-full border border-white/5 shadow-xl flex items-center">
                <button className="px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#39FF14] text-black shadow-[0_0_20px_rgba(57,255,20,0.3)] transition-all">
                    Todos los artículos
                </button>
                <button className="px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">
                    Aventura
                </button>
                <button className="px-8 py-3.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-all">
                    Cultura
                </button>
            </div>
        </div>

        {/* 3. GRID DE POSTS */}
        {allPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {allPosts.map((post) => (
              <Link 
                key={post.id} 
                to={`/blog/${post.id}`}
                className="group flex flex-col bg-[#0D0D0D] rounded-[3rem] shadow-2xl overflow-hidden transition-all hover:scale-[1.01] border border-white/5 hover:border-[#39FF14]/30 relative"
              >
                {/* Image Container */}
                <div className="relative h-72 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/20 to-transparent"></div>
                  
                  <div className="absolute top-6 left-6 flex gap-3">
                    <span className="bg-[#39FF14] text-black text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                        {post.category}
                    </span>
                    {post.youtubeId && (
                      <span className="bg-red-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl flex items-center gap-2 animate-pulse">
                        <i className="fas fa-play text-[8px]"></i> Video
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-10 flex flex-col flex-1 relative">
                  <div className="flex items-center gap-3 text-[9px] text-gray-600 mb-6 font-black uppercase tracking-[0.3em]">
                    <span className="text-[#39FF14]">{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-800"></span>
                    <span>{post.readTime}</span>
                  </div>
                  
                  <h2 className="text-3xl font-black text-white mb-6 group-hover:text-[#39FF14] transition-colors leading-none uppercase italic tracking-tighter">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-500 text-sm line-clamp-2 mb-10 leading-relaxed font-medium">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#39FF14] font-black text-xs italic">
                            {post.author.charAt(0)}
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{post.author}</span>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#39FF14] group-hover:bg-[#39FF14] group-hover:text-black transition-all">
                        <i className="fas fa-arrow-right"></i>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-40 text-center bg-[#0D0D0D] rounded-[4rem] border-2 border-dashed border-white/5">
              <i className="fas fa-newspaper text-8xl mb-8 text-gray-900"></i>
              <p className="font-black text-gray-600 uppercase tracking-[0.4em] text-xs">Aún no hay historias que contar...</p>
          </div>
        )}
      </div>

      {/* 4. FOOTER INFO */}
      <div className="py-24 text-center">
         <p className="text-[10px] font-black text-gray-700 uppercase tracking-[0.5em] italic">Huaraz Explorer Media • All Rights Reserved 2026</p>
      </div>
    </div>
  );
};

export default BlogPage;
