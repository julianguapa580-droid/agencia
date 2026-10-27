import React, { useState } from 'react';
import { useStore } from '../data/store';
import { Star, MapPin, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Destinations() {
  const { destinations, formatPrice } = useStore();
  const [search, setSearch] = useState('');
  const [continent, setContinent] = useState('all');

  const continents = ['all', ...Array.from(new Set(destinations.map(d => d.continent)))];

  const filtered = destinations.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase());
    const matchContinent = continent === 'all' || d.continent === continent;
    return matchSearch && matchContinent;
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-cyan-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Nuestros Destinos</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">Explora los destinos más increíbles del mundo. Cada lugar tiene una historia que contar.</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 px-4 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar destino o país..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-500" />
            <select
              value={continent}
              onChange={e => setContinent(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {continents.map(c => (
                <option key={c} value={c}>{c === 'all' ? 'Todos los continentes' : c}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500 mb-6">{filtered.length} destinos encontrados</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(dest => (
              <div key={dest.id} className="group rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all bg-white">
                <div className="relative h-64 overflow-hidden">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="text-yellow-500 fill-yellow-500" size={16} />
                    <span className="font-bold text-sm">{dest.rating}</span>
                  </div>
                  <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">{dest.continent}</div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                    <h3 className="text-white font-bold text-2xl">{dest.name}</h3>
                    <p className="text-white/80 flex items-center gap-1"><MapPin size={14} /> {dest.country}</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm mb-4">{dest.description}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-xs text-gray-500">Desde</span>
                      <p className="text-2xl font-bold text-blue-600">{formatPrice(dest.priceFrom)}<span className="text-sm text-gray-500 font-normal">/persona</span></p>
                    </div>
                    <Link to="/paquetes" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition">
                      Ver Paquetes
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No se encontraron destinos con esos criterios.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
