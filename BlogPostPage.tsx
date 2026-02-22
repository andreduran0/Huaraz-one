const BlogCard: React.FC<{ post: any }> = ({ post }) => {
  // Función para extraer el ID de YouTube desde el link de Supabase
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const youtubeId = getYoutubeId(post.video_url);

  const getThumbnail = () => {
    if (post.featured_image) return post.featured_image;
    if (youtubeId) {
      return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    }
    return 'https://via.placeholder.com/1280x720?text=Huaraz+Explorer';
  };

  const postLink = post.slug ? `/blog/${post.slug}` : `/blog/${post.id}`;

  return (
    <article className="space-y-8 animate-fadeIn group/card">
      <Link to={postLink}>
        <h2 className="text-3xl md:text-5xl font-black text-slate-900 hover:text-[#2A4D69] transition-all duration-300 leading-[1.1] tracking-tight group-hover/card:translate-x-1 uppercase italic">
          {post.title}
        </h2>
      </Link>

      {/* Contenedor de Video o Miniatura */}
      <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200 aspect-video bg-slate-100 border border-slate-50">
        {post.video_url ? (
          /* Si hay video_url en Supabase, mostramos el iFrame real */
          <iframe
            src={post.video_url}
            className="w-full h-full"
            title={post.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          /* Si no hay video, mostramos la imagen estática */
          <Link to={postLink} className="block w-full h-full relative cursor-pointer overflow-hidden group/thumb">
            <img 
              src={getThumbnail()} 
              alt={post.title} 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover/card:scale-105"
            />
          </Link>
        )}
      </div>

      <div className="space-y-6">
        <p className="text-slate-500 text-xl leading-relaxed font-medium max-w-2xl">
          {post.excerpt || post.content?.substring(0, 160) + '...'}
        </p>
        
        <div className="flex flex-wrap items-center gap-4">
          <Link 
            to={postLink} 
            className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm group/cta shadow-xl hover:bg-[#2A4D69] transition-all active:scale-95"
          >
            <span className="uppercase italic tracking-tighter">Leer guía completa</span>
            <i className="fas fa-arrow-right text-xs transform transition-transform group-hover/cta:translate-x-1"></i>
          </Link>
          
          {post.video_url && (
            <a 
              href={post.video_url.replace('embed/', 'watch?v=')} 
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
      <div className="pt-16 border-b border-slate-100"></div>
    </article>
  );
};
