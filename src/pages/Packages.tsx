import React, { useState } from 'react';
import { useStore } from '../data/store';
import { Star, Check, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Packages() {
  const { packages, destinations } = useStore();
  const [category, setCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'playa', label: '🏖️ Playa' },
    { value: 'aventura', label: '🏔️ Aventura' },
    { value: 'cultural', label: '🏛️ Cultural' },
    { value: 'lujo', label: '💎 Lujo' },
    { value: 'familiar', label: '👨‍👩‍👧‍👦 Familiar' },
  ];

  const filtered = category === 'all' ? packages : packages.filter(p => p.category === category);

  const getDestination = (id: string) => destinations.find(d => d.id === id);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-cyan-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Paquetes Turísticos</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">Paquetes todo incluido diseñados para que solo te preocupes por disfrutar</p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 px-4 bg-white shadow-sm sticky top-[68px] z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-3 justify-center">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-5 py-2 rounded-full font-semibold transition-all ${category === cat.value ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filtered.map(pkg => {
              const dest = getDestination(pkg.destinationId);
              return (
                <div key={pkg.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group">
                  <div className="relative h-64 overflow-hidden">
                    <img src={pkg.image} alt={pkg.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-cyan-500 text-white text-sm font-bold px-4 py-1.5 rounded-full uppercase">{pkg.category}</div>
                    {dest && (
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
                        <Star className="text-yellow-500 fill-yellow-500" size={16} />
                        <span className="font-bold text-sm">{dest.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                    <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
                      <span className="flex items-center gap-1"><Clock size={16} /> {pkg.duration}</span>
                      {dest && <span className="flex items-center gap-1"><Users size={16} /> {dest.country}</span>}
                    </div>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    <div className="mb-4">
                      <p className="font-semibold text-gray-700 mb-2">Incluye:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {pkg.includes.map((inc, i) => (
                          <span key={i} className="flex items-center gap-1.5 text-sm text-gray-600">
                            <Check className="text-green-500" size={16} /> {inc}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <span className="text-sm text-gray-500">Precio por persona</span>
                        <p className="text-3xl font-bold text-blue-600">${pkg.price.toLocaleString()}</p>
                      </div>
                      <Link to="/reservar" className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-transform hover:scale-105">
                        Reservar
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
