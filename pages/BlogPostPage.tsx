
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
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', post.excerpt);
      }
      window.scrollTo(0, 0);
    }
  }, [post]);

  if (!post) {
    return <div className="p-20 text-center text-xl font-bold">Artículo no encontrado.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-20">
      <header className="w-full h-[50vh] relative">
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full h-full object-cover" 
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-4 text-sm font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-full transition-all border border-white/10">
                <i className="fas fa-arrow-left mr-2"></i> Volver al blog
            </Link>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-2xl leading-tight max-w-4xl">
              {post.title}
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 mt-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8 pb-8 border-b dark:border-gray-800">
            <div className="w-12 h-12 rounded-full bg-brand-dark-blue flex items-center justify-center text-white font-bold text-lg shadow-inner">
                {post.author.charAt(0)}
            </div>
            <div>
                <p className="font-bold text-gray-900 dark:text-white">{post.author}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500 uppercase font-bold tracking-widest">
                    <time dateTime={post.date}>{post.date}</time>
                    <span>•</span>
                    <span><i className="far fa-clock mr-1"></i> {post.readTime}</span>
                </div>
            </div>
          </div>

          {post.youtubeId && (
            <div className="mb-10 animate-fadeIn">
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800 bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${post.youtubeId}?autoplay=0&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                ></iframe>
              </div>
              <p className="text-center text-xs text-gray-400 mt-3 font-bold uppercase tracking-widest">
                <i className="fab fa-youtube text-red-500 mr-1"></i> Video cortesía de nuestro canal de YouTube
              </p>
            </div>
          )}

          <article className="prose prose-lg dark:prose-invert max-w-none prose-teal 
            prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-brand-dark-blue dark:prose-headings:text-brand-green
            prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </article>

          {relatedPosts.length > 0 && (
            <div className="mt-20 pt-10 border-t dark:border-gray-800">
                <h3 className="text-2xl font-black text-brand-dark-blue dark:text-white mb-6 uppercase tracking-tighter">También te puede interesar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedPosts.map(rp => (
                        <Link key={rp.id} to={`/blog/${rp.id}`} className="group block space-y-3">
                            <div className="aspect-video rounded-2xl overflow-hidden relative">
                                <img src={rp.image} alt={rp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-blue transition-colors leading-tight">
                                {rp.title}
                            </h4>
                        </Link>
                    ))}
                </div>
            </div>
          )}
          
          <div className="mt-16 p-8 bg-gray-50 dark:bg-gray-800/50 rounded-3xl text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">¿Te gustó esta guía de Huaraz?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">Cada semana publicamos nuevas rutas de trekking y consejos para evitar el soroche. ¡No te pierdas ninguna!</p>
            <Link to="/newsletter" className="bg-brand-dark-blue text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-brand-blue transition-all inline-flex items-center gap-2 active:scale-95">
                <i className="fas fa-paper-plane"></i> Suscribirme Gratis
            </Link>
          </div>

          <div className="mt-12 p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-8 text-center">Nuestras Redes Oficiales</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a 
                href={socialLinks.instagram} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white rounded-2xl font-bold shadow-md hover:scale-[1.03] transition-all active:scale-95"
              >
                <i className="fab fa-instagram text-xl"></i>
                <span className="text-sm">Instagram</span>
              </a>
              <a 
                href={socialLinks.tiktok} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-black text-white rounded-2xl font-bold shadow-md hover:scale-[1.03] transition-all active:scale-95 border border-white/10"
              >
                <i className="fab fa-tiktok text-xl"></i>
                <span className="text-sm">TikTok</span>
              </a>
              <a 
                href={socialLinks.youtube} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-[#FF0000] text-white rounded-2xl font-bold shadow-md hover:scale-[1.03] transition-all active:scale-95"
              >
                <i className="fab fa-youtube text-xl"></i>
                <span className="text-sm">YouTube</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;
