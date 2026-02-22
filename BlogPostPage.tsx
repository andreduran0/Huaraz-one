const BlogCard: React.FC<{ post: any }> = ({ post }) => {
  // Función para extraer el ID de video para la miniatura
  const getYoutubeId = (url: string) => {
    if (!url) return null;
    const match = url.match(/embed\/([^/?]+)/);
    return match ? match[1] : null;
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

      {/* REPRODUCTOR DE VIDEO REAL */}
      <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-video bg-slate-100 border border-slate-50">
        {post.video_url ? (
          <iframe
            src={post.video_url}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <img src={post.featured_image || 'https://via.placeholder.com/1280x720'} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="space-y-6">
        <p className="text-slate-500 text-xl leading-relaxed font-medium">
          {post.excerpt || (post.content ? post.content.substring(0, 150) + "..." : "")}
        </p>
        <Link to={postLink} className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase italic shadow-xl hover:bg-[#2A4D69] transition-all">
          Leer guía completa
        </Link>
      </div>
      <div className="pt-16 border-b border-slate-100"></div>
    </article>
  );
};
