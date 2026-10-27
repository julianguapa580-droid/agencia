import React, { useState, useMemo } from 'react';
import { useStore } from '../data/store';
import { Calculator, Plane, Hotel, Users, Calendar, MapPin, DollarSign, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function QuoteCalculator() {
  const { destinations, packages } = useStore();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    destination: '',
    travelers: 2,
    category: '',
    budget: 2000,
    startDate: '',
    duration: '',
    extras: [] as string[],
  });

  const extras = [
    { id: 'seguro_premium', name: 'Seguro Premium', price: 150, icon: '🛡️' },
    { id: 'excursiones', name: 'Tours y Excursiones', price: 300, icon: '🗺️' },
    { id: 'traslados_privados', name: 'Traslados Privados', price: 200, icon: '🚗' },
    { id: 'spa', name: 'Paquete Spa', price: 250, icon: '💆' },
    { id: 'gastronomia', name: 'Tour Gastronómico', price: 180, icon: '🍽️' },
    { id: 'fotografo', name: 'Sesión de Fotos', price: 350, icon: '📸' },
  ];

  const matchingPackages = useMemo(() => {
    return packages.filter(p => {
      if (form.category && p.category !== form.category) return false;
      if (form.destination) {
        const dest = destinations.find(d => d.id === p.destinationId);
        if (dest && !dest.name.toLowerCase().includes(form.destination.toLowerCase())) return false;
      }
      return true;
    });
  }, [form.category, form.destination, packages, destinations]);

  const basePrice = matchingPackages.length > 0 ? matchingPackages[0].price : 1000;
  const extrasTotal = form.extras.reduce((sum, id) => {
    const extra = extras.find(e => e.id === id);
    return sum + (extra ? extra.price * form.travelers : 0);
  }, 0);
  const totalPrice = (basePrice * form.travelers) + extrasTotal;
  const pricePerPerson = basePrice + (extrasTotal / form.travelers);

  const toggleExtra = (id: string) => {
    setForm(prev => ({
      ...prev,
      extras: prev.extras.includes(id) ? prev.extras.filter(e => e !== id) : [...prev.extras, id],
    }));
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-emerald-800 to-teal-700 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Calculator size={18} />
            <span className="font-semibold">Cotizador Inteligente</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">Cotiza tu Viaje</h1>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto">Calcula el costo de tu viaje ideal en minutos</p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-8 px-4 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 md:gap-4">
          {[
            { n: 1, label: 'Destino' },
            { n: 2, label: 'Detalles' },
            { n: 3, label: 'Extras' },
            { n: 4, label: 'Cotización' },
          ].map((s, i) => (
            <React.Fragment key={s.n}>
              {i > 0 && <div className={`h-1 w-8 md:w-16 rounded ${step >= s.n ? 'bg-emerald-500' : 'bg-gray-200'}`} />}
              <div className={`flex items-center gap-2 ${step >= s.n ? 'text-emerald-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= s.n ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <span className="hidden md:block font-semibold text-sm">{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><MapPin className="text-emerald-600" /> ¿A dónde quieres viajar?</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {destinations.slice(0, 8).map(d => (
                    <button key={d.id} onClick={() => setForm({ ...form, destination: d.name })} className={`relative rounded-xl overflow-hidden h-32 group ${form.destination === d.name ? 'ring-4 ring-emerald-500' : 'hover:ring-2 hover:ring-emerald-300'}`}>
                      <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                        <span className="text-white font-semibold text-sm">{d.name}</span>
                      </div>
                      {form.destination === d.name && <div className="absolute top-2 right-2 bg-emerald-500 rounded-full p-1"><Check size={14} className="text-white" /></div>}
                    </button>
                  ))}
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">O escribe un destino:</label>
                  <input type="text" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} placeholder="Ej: Cancún, París, Japón..." className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <button onClick={() => setStep(2)} disabled={!form.destination} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                  Siguiente <ArrowRight size={20} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Users className="text-emerald-600" /> Detalles del viaje</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Número de viajeros</label>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setForm({ ...form, travelers: Math.max(1, form.travelers - 1) })} className="w-12 h-12 bg-gray-100 rounded-lg text-xl font-bold hover:bg-gray-200">-</button>
                      <span className="text-3xl font-bold text-emerald-600 w-12 text-center">{form.travelers}</span>
                      <button onClick={() => setForm({ ...form, travelers: Math.min(20, form.travelers + 1) })} className="w-12 h-12 bg-gray-100 rounded-lg text-xl font-bold hover:bg-gray-200">+</button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Categoría</label>
                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none">
                      <option value="">Todas las categorías</option>
                      <option value="playa">🏖️ Playa</option>
                      <option value="aventura">🏔️ Aventura</option>
                      <option value="cultural">🏛️ Cultural</option>
                      <option value="lujo">💎 Lujo</option>
                      <option value="familiar">👨‍👩‍👧‍👦 Familiar</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Fecha aproximada</label>
                    <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Duración</label>
                    <select value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none">
                      <option value="">Seleccionar</option>
                      <option value="3-5">3 a 5 días</option>
                      <option value="5-7">5 a 7 días</option>
                      <option value="7-10">7 a 10 días</option>
                      <option value="10+">Más de 10 días</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Presupuesto por persona: ${form.budget}</label>
                  <input type="range" min={500} max={10000} step={100} value={form.budget} onChange={e => setForm({ ...form, budget: parseInt(e.target.value) })} className="w-full accent-emerald-500" />
                  <div className="flex justify-between text-sm text-gray-500 mt-1">
                    <span>$500</span>
                    <span>$10,000</span>
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-300 py-3 rounded-xl font-bold hover:bg-gray-50">← Atrás</button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                    Siguiente <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Agrega servicios extra</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {extras.map(extra => (
                    <button key={extra.id} onClick={() => toggleExtra(extra.id)} className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${form.extras.includes(extra.id) ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-300'}`}>
                      <span className="text-3xl">{extra.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold">{extra.name}</p>
                        <p className="text-sm text-gray-500">+${extra.price}/persona</p>
                      </div>
                      {form.extras.includes(extra.id) && <Check className="text-emerald-600" size={24} />}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="flex-1 border-2 border-gray-300 py-3 rounded-xl font-bold hover:bg-gray-50">← Atrás</button>
                  <button onClick={() => setStep(4)} className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2">
                    Ver Cotización <DollarSign size={20} />
                  </button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Tu Cotización</h2>
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 mb-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <MapPin className="text-emerald-600 mx-auto mb-1" size={24} />
                      <p className="text-xs text-gray-500">Destino</p>
                      <p className="font-bold">{form.destination}</p>
                    </div>
                    <div className="text-center">
                      <Users className="text-emerald-600 mx-auto mb-1" size={24} />
                      <p className="text-xs text-gray-500">Viajeros</p>
                      <p className="font-bold">{form.travelers}</p>
                    </div>
                    <div className="text-center">
                      <Calendar className="text-emerald-600 mx-auto mb-1" size={24} />
                      <p className="text-xs text-gray-500">Fecha</p>
                      <p className="font-bold">{form.startDate || 'Flexible'}</p>
                    </div>
                    <div className="text-center">
                      <Plane className="text-emerald-600 mx-auto mb-1" size={24} />
                      <p className="text-xs text-gray-500">Categoría</p>
                      <p className="font-bold capitalize">{form.category || 'General'}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm"><span>Paquete base × {form.travelers} viajeros:</span><span>${(basePrice * form.travelers).toLocaleString()}</span></div>
                    {form.extras.map(id => {
                      const extra = extras.find(e => e.id === id);
                      return extra ? (
                        <div key={id} className="flex justify-between text-sm"><span>{extra.icon} {extra.name} × {form.travelers}:</span><span>${(extra.price * form.travelers).toLocaleString()}</span></div>
                      ) : null;
                    })}
                    <div className="border-t pt-2 flex justify-between text-lg font-bold">
                      <span>Total estimado:</span>
                      <span className="text-emerald-600">${totalPrice.toLocaleString()} MXN</span>
                    </div>
                    <p className="text-right text-sm text-gray-500">≈ ${pricePerPerson.toLocaleString()} por persona</p>
                  </div>
                </div>

                {matchingPackages.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold mb-3">Paquetes sugeridos:</h3>
                    <div className="space-y-2">
                      {matchingPackages.slice(0, 3).map(pkg => (
                        <div key={pkg.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                          <img src={pkg.image} alt={pkg.name} className="w-14 h-14 rounded-lg object-cover" />
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{pkg.name}</p>
                            <p className="text-xs text-gray-500">{pkg.duration}</p>
                          </div>
                          <p className="font-bold text-emerald-600">${pkg.price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button onClick={() => setStep(3)} className="flex-1 border-2 border-gray-300 py-3 rounded-xl font-bold hover:bg-gray-50">← Modificar</button>
                  <Link to="/reservar" className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition text-center flex items-center justify-center gap-2">
                    <Check size={20} /> Reservar Ahora
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
