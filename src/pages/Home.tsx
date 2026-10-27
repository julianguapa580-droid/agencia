import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../data/store';
import { Star, Shield, Clock, Headphones, Globe, Award, ChevronRight, ArrowRight } from 'lucide-react';

export default function Home() {
  const { destinations, packages, formatPrice } = useStore();
  const featuredDestinations = destinations.filter(d => d.featured).slice(0, 6);
  const topPackages = packages.slice(0, 4);

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600)', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Descubre el Mundo con <span className="text-cyan-400">VoyageX</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Viajes inolvidables, experiencias únicas. Tu aventura comienza aquí.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/paquetes" className="bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
              Ver Paquetes
            </Link>
            <Link to="/reservar" className="border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-900 transition-all">
              Reservar Ahora
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Search Bar */}
      <section className="relative -mt-10 z-20 px-4">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">Destino</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
              <option>¿A dónde quieres ir?</option>
              {destinations.map(d => <option key={d.id}>{d.name}, {d.country}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">Fecha de ida</label>
            <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">Fecha de vuelta</label>
            <input type="date" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-600 mb-1 block">Viajeros</label>
            <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none">
              <option>1 viajero</option>
              <option>2 viajeros</option>
              <option>3 viajeros</option>
              <option>4+ viajeros</option>
            </select>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Globe, title: 'Destinos Exclusivos', desc: 'Más de 100 destinos en todo el mundo', color: 'from-blue-500 to-blue-600' },
              { icon: Shield, title: 'Viaje Seguro', desc: 'Seguro de viaje incluido en todos los paquetes', color: 'from-green-500 to-green-600' },
              { icon: Clock, title: '24/7 Soporte', desc: 'Atención al cliente las 24 horas del día', color: 'from-purple-500 to-purple-600' },
              { icon: Award, title: 'Mejor Precio', desc: 'Garantía del mejor precio del mercado', color: 'from-orange-500 to-orange-600' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow text-center group">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <item.icon className="text-white" size={28} />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Destinos Populares</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Descubre los destinos más buscados por nuestros viajeros. Experiencias únicas te esperan.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredDestinations.map(dest => (
              <div key={dest.id} className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 bg-white">
                <div className="relative h-56 overflow-hidden">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="text-yellow-500 fill-yellow-500" size={16} />
                    <span className="font-bold text-sm">{dest.rating}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                    <h3 className="text-white font-bold text-xl">{dest.name}</h3>
                    <p className="text-white/80 text-sm">{dest.country} • {dest.continent}</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{dest.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">Desde</span>
                      <p className="text-2xl font-bold text-blue-600">{formatPrice(dest.priceFrom)}<span className="text-sm text-gray-500 font-normal">/persona</span></p>
                    </div>
                    <Link to="/paquetes" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-1">
                      Ver más <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/destinos" className="inline-flex items-center gap-2 text-blue-600 font-semibold text-lg hover:text-blue-800 transition">
              Ver todos los destinos <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Top Packages */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Paquetes Destacados</h2>
            <p className="text-gray-600 text-lg">Los paquetes más vendidos con las mejores experiencias</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {topPackages.map(pkg => (
              <div key={pkg.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden group">
                <div className="relative h-48 overflow-hidden">
                  <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">{pkg.category}</div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 line-clamp-1">{pkg.name}</h3>
                  <p className="text-gray-500 text-sm mb-3">{pkg.duration}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {pkg.includes.slice(0, 3).map((inc, i) => (
                      <span key={i} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full">{inc}</span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <p className="text-2xl font-bold text-blue-600">{formatPrice(pkg.price)}</p>
                    <Link to="/reservar" className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition">
                      Reservar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Lo que dicen nuestros viajeros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Laura Hernández', trip: 'París, Francia', text: 'Increíble experiencia. Todo perfectamente organizado, desde el vuelo hasta el hotel. La cena en la Torre Eiffel fue mágica. ¡Volveré a reservar con VoyageX!', rating: 5 },
              { name: 'Diego Torres', trip: 'Maldivas', text: 'El viaje de luna de miel perfecto. El bungalow sobre el agua era un sueño. El equipo de VoyageX se encargó de cada detalle. Totalmente recomendado.', rating: 5 },
              { name: 'Ana Martínez', trip: 'Machu Picchu, Perú', text: 'Llevamos a toda la familia y fue espectacular. Los niños disfrutaron mucho el trek. El guía fue excelente y el hotel muy cómodo. ¡Gracias VoyageX!', rating: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="flex gap-1 mb-4">
                  {Array(t.rating).fill(0).map((_, j) => <Star key={j} className="text-yellow-400 fill-yellow-400" size={18} />)}
                </div>
                <p className="text-blue-100 mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-bold">{t.name}</p>
                  <p className="text-blue-300 text-sm">{t.trip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '15+', label: 'Años de experiencia' },
              { num: '50K+', label: 'Viajeros felices' },
              { num: '100+', label: 'Destinos' },
              { num: '4.9', label: 'Calificación promedio' },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-4xl md:text-5xl font-bold text-blue-600">{s.num}</p>
                <p className="text-gray-600 mt-2">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promotions Banner */}
      <section className="py-16 px-4 bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">🔥 ¡Ofertas Especiales!</h2>
          <p className="text-xl mb-8 text-pink-100">Hasta 30% de descuento en destinos seleccionados</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/promociones" className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-transform hover:scale-105">
              Ver Promociones
            </Link>
            <Link to="/cotizador" className="border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-pink-600 transition-all">
              Cotiza tu Viaje
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Últimas del Blog</h2>
            <Link to="/blog" className="text-blue-600 font-semibold hover:underline flex items-center gap-1">Ver todo →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: '10 Playas Paradisíacas para 2026', cat: 'Destinos', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400' },
              { title: 'Guía Completa para Viajar a Japón', cat: 'Guías', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400' },
              { title: 'Los Mejores Destinos para Luna de Miel', cat: 'Romance', img: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400' },
            ].map((post, i) => (
              <Link to="/blog" key={i} className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                <div className="h-40 overflow-hidden">
                  <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4">
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full font-semibold">{post.cat}</span>
                  <h3 className="font-bold mt-2 group-hover:text-blue-600 transition-colors">{post.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-16 px-4 bg-amber-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿Tienes Preguntas?</h2>
          <p className="text-gray-600 mb-8">Encuentra respuestas rápidas a las dudas más comunes</p>
          <Link to="/faq" className="inline-flex items-center gap-2 bg-amber-600 text-white px-8 py-3 rounded-full font-bold hover:bg-amber-700 transition">
            Ver Preguntas Frecuentes
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">¿Listo para tu próxima aventura?</h2>
          <p className="text-xl mb-8 text-blue-100">Contáctanos hoy y recibe una cotización personalizada sin compromiso</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contacto" className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-transform hover:scale-105">
              Contáctanos
            </Link>
            <a href="tel:+525558009000" className="border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-blue-600 transition-all flex items-center justify-center gap-2">
              <Headphones size={20} /> Llámanos Ahora
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
