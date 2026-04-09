import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../services/supabase';

const BlogPostPage: React.FC = () => {
  const { id: slugOrId } = useParams<{ id: string }>();
  const { blogPosts: localPosts } = useAppContext();
  
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        if (!slugOrId) return;

        // 1. Busca por slug
        let { data, error } = await supabase
          .from('posts')
          .select('*, video_url')
          .eq('slug', slugOrId)
          .single();

        // 2. Si falla, busca por ID
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <i className="fas fa-spinner fa-spin text-4xl text-[#2A4D69]"></i>
      </div>
    );
  }

  // 👇 ESTE MENSAJE CONFIRMARÁ QUE YA ESTAMOS EN EL ARCHIVO CORRECTO 👇
  if (!post) {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10 text-center">
            <h1 className="text-3xl font-black text-slate-900 mb-4 uppercase italic">Artículo no encontrado en la Base de Datos</h1>
            <p className="text-slate-500 mb-8">Revisa si el enlace (slug) es correcto: <span className="font-bold text-red-500">{slugOrId}</span></p>
            <Link to="/blog" className="text-[#2A4D69] font-bold underline">Volver al blog</Link>
        </div>
    );
  }

  const featuredImage = post.featured_image || post.image;

  return (
    <div className="bg-white min-h-screen pb-40 font-['Plus_Jakarta_Sans']">
      <div className="container mx-auto px-6 max-w-3xl pt-16 pb-12">
        <Link to="/blog" className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8 inline-block hover:text-[#2A4D69] transition-colors">
          <i className="fas fa-arrow-left mr-2"></i> Volver al blog
        </Link>
        
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.05] mb-8 uppercase italic tracking-tighter">
          {post.title}
        </h1>
      </div>

      {/* EL VIDEO DE YOUTUBE */}
      <div className="container mx-auto px-6 max-w-4xl space-y-10 mb-20">
        <div className="relative group">
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

      <div className="container mx-auto px-6 max-w-3xl">
        <article className="prose prose-xl max-w-none prose-headings:text-slate-900 prose-headings:font-black prose-p:text-slate-600">
          <ReactMarkdown>{post.content || ''}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
};

export default BlogPostPage;
