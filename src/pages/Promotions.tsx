import React, { useState } from 'react';
import { useStore } from '../data/store';
import { Tag, Clock, Copy, Check, Percent, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Promotions() {
  const { promotions, packages, formatPrice } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const activePromos = promotions.filter(p => p.active);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getPackagesForPromo = (packageIds: string[]) => {
    return packages.filter(p => packageIds.includes(p.id));
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Tag size={18} />
            <span className="font-semibold">Ofertas Exclusivas</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">Promociones y Ofertas</h1>
          <p className="text-xl text-pink-100 max-w-2xl mx-auto">Aprovecha nuestros descuentos especiales y viaja más por menos</p>
        </div>
      </section>

      {/* Active Promos */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">🔥 Ofertas Activas</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {activePromos.map(promo => {
              const relatedPkgs = getPackagesForPromo(promo.packageIds);
              return (
                <div key={promo.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all group">
                  <div className="relative h-56 overflow-hidden">
                    <img src={promo.image} alt={promo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold text-lg flex items-center gap-1">
                      {promo.type === 'percent' ? <><Percent size={18} /> {promo.discount}% OFF</> : <><DollarSign size={18} /> ${promo.discount} OFF</>}
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white text-2xl font-bold">{promo.title}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">{promo.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={16} />
                        <span>Válido: {promo.startDate} al {promo.endDate}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                      <p className="text-sm text-gray-500 mb-1">Código de descuento:</p>
                      <div className="flex items-center gap-3">
                        <code className="text-2xl font-bold text-blue-600 tracking-wider">{promo.code}</code>
                        <button onClick={() => copyCode(promo.code)} className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-1">
                          {copiedCode === promo.code ? <><Check size={14} /> Copiado</> : <><Copy size={14} /> Copiar</>}
                        </button>
                      </div>
                    </div>
                    {relatedPkgs.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Aplica en:</p>
                        <div className="flex flex-wrap gap-2">
                          {relatedPkgs.map(pkg => (
                            <span key={pkg.id} className="bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">{pkg.name}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 mt-4">
                      <Link to="/cotizador" className="flex-1 text-center border-2 border-red-500 text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 transition">
                        Cotizar
                      </Link>
                      <Link to="/reservar" className="flex-1 text-center bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition">
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

      {/* Benefits */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué reservar con nosotros?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { emoji: '💰', title: 'Mejor Precio', desc: 'Garantizamos el mejor precio o te devolvemos la diferencia' },
              { emoji: '🔒', title: 'Pago Seguro', desc: 'Todas las transacciones protegidas y encriptadas' },
              { emoji: '🎯', title: 'Sin Letra Chica', desc: 'Precios transparentes sin cargos ocultos' },
              { emoji: '📞', title: 'Soporte 24/7', desc: 'Atención antes, durante y después de tu viaje' },
            ].map((b, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-xl shadow-md">
                <div className="text-4xl mb-3">{b.emoji}</div>
                <h3 className="font-bold text-lg mb-2">{b.title}</h3>
                <p className="text-gray-600 text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 bg-blue-900 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">📬 Recibe Ofertas Exclusivas</h2>
          <p className="text-blue-200 mb-8">Suscríbete a nuestro newsletter y sé el primero en conocer nuestras promociones</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="Tu email..." className="flex-1 px-4 py-3 rounded-xl text-gray-900 outline-none focus:ring-2 focus:ring-cyan-400" />
            <button className="bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 rounded-xl font-bold hover:shadow-lg transition">
              Suscribirme
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
