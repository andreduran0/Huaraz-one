import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../services/supabase';

const BlogCard: React.FC<{ post: any }> = ({ post }) => {
  // Función para extraer el ID de YouTube para la miniatura si falla el video
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYoutubeId(post.video_url);
  const postLink = post.slug ? `/blog/${post.slug}` : `/blog/${post.id}`;

  return (
    <article className="space-y-8 animate-fadeIn group/card">
      <Link to={postLink}>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 hover:text-[#2A4D69] transition-all duration-300 leading-[1.1] tracking-tight uppercase italic">
          {post.title}
        </h2>
      </Link>

      {/* REPRODUCTOR DE VIDEO O MINIATURA */}
      <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 aspect-video bg-slate-100 border border-slate-50">
        {post.video_url ? (
          /* Muestra el reproductor real si existe el link en Supabase */
          <iframe
            src={post.video_url}
            className="w-full h-full"
            title={post.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          /* Imagen de respaldo si no hay video */
          <Link to={postLink} className="block w-full h-full relative cursor-pointer overflow-hidden group/thumb">
            <img 
              src={post.featured_image || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-105"
            />
          </Link>
        )}
      </div>

      <div className="space-y-6">
        <p className="text-slate-500 text-xl leading-relaxed font-medium max-w-2xl">
          {/* Toma los primeros 160 caracteres del contenido experto de Supabase */}
          {post.excerpt || (post.content ? post.content.substring(0, 160) + "..." : "Explora más sobre Huaraz con nuestra guía completa.")}
        </p>
        
        <div className="flex flex-wrap items-center gap-4">
          <Link 
            to={postLink} 
            className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm group/cta shadow-xl hover:bg-[#2A4D69] transition-all active:scale-95"
          >
            <span className="uppercase italic tracking-tighter">Leer guía completa</span>
            <i className="fas fa-arrow-right text-xs transform transition-transform group-hover/cta:translate-x-1"></i>
          </Link>
        </div>
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
