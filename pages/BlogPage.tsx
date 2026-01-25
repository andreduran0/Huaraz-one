
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTranslations } from '../hooks/useTranslations';

const BlogPage: React.FC = () => {
  const { blogPosts } = useAppContext();
  const t = useTranslations();

  // Ahora simplemente mostramos todos los posts sin filtrar
  const allPosts = blogPosts;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-10 text-center space-y-2">
        <h1 className="text-4xl font-black text-brand-dark-blue dark:text-white uppercase tracking-tighter">Guías y Relatos</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto text-sm">Todo lo que necesitas saber para tu próxima aventura en Huaraz y la Cordillera Blanca.</p>
      </div>

      <div className="flex items-center gap-2 pb-6">
        <div className="px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-brand-dark-blue text-white shadow-lg">
          Todos los artículos
        </div>
      </div>

      {allPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {allPosts.map((post) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.id}`}
              className="group flex flex-col bg-white dark:bg-gray-800 rounded-3xl shadow-lg overflow-hidden transition-all hover:shadow-2xl border border-gray-100 dark:border-gray-700"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {post.youtubeId && (
                    <span className="bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
                      <i className="fas fa-play"></i> VIDEO
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-2 font-black uppercase tracking-widest">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime} de lectura</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-brand-blue transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center text-brand-blue font-black text-xs uppercase tracking-widest">
                  Leer artículo completo <i className="fas fa-arrow-right ml-2 text-[10px]"></i>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
            <i className="fas fa-newspaper text-5xl mb-4 opacity-20"></i>
            <p className="font-bold">No hay artículos publicados aún.</p>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
