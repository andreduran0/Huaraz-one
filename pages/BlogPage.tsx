
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../services/supabase';

const BlogCard: React.FC<{ post: any }> = ({ post }) => {
  const getThumbnail = () => {
    if (post.featured_image) return post.featured_image;
    if (post.image) return post.image;
    if (post.youtubeId) {
      return `https://img.youtube.com/vi/${post.youtubeId}/maxresdefault.jpg`;
    }
    return 'https://via.placeholder.com/1280x720?text=Huaraz+Explorer';
  };

  const videoUrl = post.youtubeId ? `https://www.youtube.com/watch?v=${post.youtubeId}` : null;
  const postLink = post.slug ? `/blog/${post.slug}` : `/blog/${post.id}`;

  return (
    <article className="space-y-8 animate-fadeIn group/card">
      <Link to={postLink}>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 hover:text-[#2A4D69] transition-all duration-300 leading-[1.1] tracking-tight group-hover/card:translate-x-1 uppercase italic">
          {post.title}
        </h2>
      </Link>

      {/* Miniatura con Estética Premium */}
      <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 aspect-video bg-slate-100 border border-slate-50">
        <Link 
          to={postLink}
          className="block w-full h-full relative cursor-pointer overflow-hidden group/thumb"
        >
          <img 
            src={getThumbnail()} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-105"
            onError={(e) => {
              if(post.youtubeId) e.currentTarget.src = `https://img.youtube.com/vi/${post.youtubeId}/hqdefault.jpg`;
            }}
          />
          
          {/* Overlay de Play */}
          <div className="absolute inset-0 bg-black/10 group-hover/thumb:bg-black/20 transition-colors flex items-center justify-center">
              {post.youtubeId && (
                <div className="relative z-10">
                  <div className="absolute -inset-12 bg-red-600/30 rounded-full blur-3xl opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-700"></div>
                  <div className="w-24 h-24 bg-red-600 rounded-[2rem] flex items-center justify-center text-white text-4xl shadow-[0_20px_50px_rgba(220,38,38,0.5)] transform transition-all group-hover/thumb:scale-110 group-hover/thumb:rotate-3 active:scale-95">
                      <i className="fas fa-play ml-1"></i>
                  </div>
                </div>
              )}
          </div>

          {post.youtubeId && (
              <div className="absolute top-6 right-8 bg-red-600 px-4 py-2 rounded-xl text-[9px] font-black text-white shadow-xl uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                  Video Disponible
              </div>
          )}
        </Link>
      </div>

      <div className="space-y-6">
        <p className="text-slate-500 text-xl leading-relaxed font-medium max-w-2xl">
          {post.excerpt}
        </p>
        
        <div className="flex flex-wrap items-center gap-4">
          <Link 
            to={postLink} 
            className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm group/cta shadow-xl hover:bg-[#2A4D69] transition-all active:scale-95"
          >
            <span className="uppercase italic tracking-tighter">Leer guía completa</span>
            <i className="fas fa-arrow-right text-xs transform transition-transform group-hover/cta:translate-x-1"></i>
          </Link>
          
          {videoUrl && (
            <a 
              href={videoUrl} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-red-50 text-red-600 border border-red-100 px-8 py-4 rounded-2xl font-black text-sm hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-sm"
            >
              <i className="fab fa-youtube text-lg"></i>
              <span className="uppercase italic tracking-tighter">Ver en YouTube</span>
            </a>
          )}
        </div>
      </div>

      <div className="pt-8 flex items-center gap-6 text-[10px] text-slate-300 font-black uppercase tracking-[0.3em]">
        <span>{post.author}</span>
        <span>•</span>
        <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : post.date}</span>
      </div>
      
      <div className="pt-16 border-b border-slate-100"></div>
    </article>
  );
};

const BlogPage: React.FC = () => {
  const { blogPosts: localPosts } = useAppContext();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Combinar con locales si se desea, o solo mostrar DB si hay datos
        if (data && data.length > 0) {
          setPosts(data);
        } else {
          setPosts(localPosts);
        }
      } catch (err) {
        console.error('Error fetching posts:', err);
        setPosts(localPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [localPosts]);

  return (
    <div className="bg-white min-h-screen pb-40 font-['Plus_Jakarta_Sans']">
      
      <section className="pt-24 pb-20 px-6 text-center border-b border-slate-100 bg-slate-50/50">
        <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter mb-6 leading-none uppercase italic">
          Guías <span className="text-[#2A4D69]">&</span> Relatos
        </h1>
        <p className="text-slate-400 text-lg font-bold uppercase tracking-widest max-w-2xl mx-auto leading-tight italic">
          Contenido visual directo para tu próxima aventura
        </p>
      </section>

      <div className="container mx-auto px-6 max-w-4xl pt-24 space-y-32">
        {loading ? (
          <div className="py-32 text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-[#2A4D69]"></i>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))
        ) : (
          <div className="py-32 text-center bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
            <p className="text-slate-300 font-black uppercase tracking-[0.4em] text-xs italic">Preparando nuevas crónicas...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
