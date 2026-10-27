import React, { useState } from 'react';
import { useStore } from '../data/store';
import { Calendar, User, Tag, ArrowRight, Search, Clock } from 'lucide-react';

export default function Blog() {
  const { blogPosts } = useStore();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);

  const published = blogPosts.filter(p => p.published);
  const categories = ['all', ...Array.from(new Set(published.map(p => p.category)))];

  const filtered = published.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const post = selectedPost ? published.find(p => p.id === selectedPost) : null;

  if (post) {
    return (
      <div>
        <section className="relative h-[400px] flex items-end">
          <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="relative z-10 p-8 max-w-4xl mx-auto w-full text-white">
            <span className="bg-blue-600 text-sm px-3 py-1 rounded-full font-semibold">{post.category}</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-blue-200">
              <span className="flex items-center gap-1"><User size={16} /> {post.author}</span>
              <span className="flex items-center gap-1"><Calendar size={16} /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock size={16} /> 5 min lectura</span>
            </div>
          </div>
        </section>

        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <button onClick={() => setSelectedPost(null)} className="text-blue-600 font-semibold mb-8 flex items-center gap-1 hover:underline">
              ← Volver al blog
            </button>
            <article className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-700 leading-relaxed mb-6 font-medium">{post.excerpt}</p>
              <div className="text-gray-600 leading-relaxed space-y-4">
                <p>{post.content}</p>
                <p>Viajar es una de las experiencias más enriquecedoras que podemos tener. Cada destino nos ofrece la oportunidad de descubrir nuevas culturas, sabores y paisajes que expanden nuestra perspectiva del mundo.</p>
                <p>En VoyageX nos especializamos en crear experiencias únicas y personalizadas para cada viajero. Nuestro equipo de expertos conoce cada destino de primera mano y puede recomendarte las mejores opciones según tus preferencias y presupuesto.</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Consejos para tu viaje</h3>
                <p>Planificar con anticipación es clave para disfrutar al máximo. Te recomendamos reservar con al menos 3 meses de anticipación para obtener los mejores precios y disponibilidad.</p>
                <p>No olvides contratar un seguro de viaje que te cubra ante cualquier imprevisto. En nuestros paquetes siempre incluimos un seguro básico, pero puedes optar por coberturas premium.</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-8 mb-4">¿Listo para la aventura?</h3>
                <p>En VoyageX tenemos paquetes especiales para este destino con precios increíbles. Contáctanos y un asesor te ayudará a planificar el viaje de tus sueños.</p>
              </div>
              <div className="mt-8 pt-6 border-t flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">#{tag}</span>
                ))}
              </div>
            </article>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-indigo-900 to-purple-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Blog de Viajes</h1>
          <p className="text-xl text-indigo-200 max-w-2xl mx-auto">Inspiración, guías y tips para tu próxima aventura</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 px-4 bg-white shadow-sm sticky top-[68px] z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input type="text" placeholder="Buscar artículos o temas..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${selectedCategory === cat ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      {filtered.length > 0 && (
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer group" onClick={() => setSelectedPost(filtered[0].id)}>
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="h-64 lg:h-auto overflow-hidden">
                  <img src={filtered[0].image} alt={filtered[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span className="bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full font-semibold w-fit mb-4">{filtered[0].category}</span>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors">{filtered[0].title}</h2>
                  <p className="text-gray-600 mb-6">{filtered[0].excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><User size={14} /> {filtered[0].author}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {filtered[0].date}</span>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-indigo-600 font-semibold">
                    Leer artículo <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Posts Grid */}
      <section className="pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.slice(1).map(post => (
              <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all cursor-pointer group" onClick={() => setSelectedPost(post.id)}>
                <div className="h-48 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full font-semibold">{post.category}</span>
                    <span className="text-xs text-gray-400">{post.date}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1"><User size={12} /> {post.author}</span>
                    <span className="text-indigo-600 text-sm font-semibold flex items-center gap-1">Leer <ArrowRight size={14} /></span>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">No se encontraron artículos</div>
          )}
        </div>
      </section>
    </div>
  );
}
