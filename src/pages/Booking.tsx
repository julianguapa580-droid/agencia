import React, { useState } from 'react';
import { useStore } from '../data/store';
import { CheckCircle, Calendar, Users, CreditCard, Shield } from 'lucide-react';

export default function Booking() {
  const { packages, destinations, addBooking } = useStore();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    packageId: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    travelers: 2,
    startDate: '',
    endDate: '',
    notes: '',
  });

  const selectedPackage = packages.find(p => p.id === form.packageId);
  const totalPrice = selectedPackage ? selectedPackage.price * form.travelers : 0;

  const handleSubmit = () => {
    if (!selectedPackage) return;
    const dest = destinations.find(d => d.id === selectedPackage.destinationId);
    const booking = {
      id: Date.now().toString(),
      clientName: form.clientName,
      clientEmail: form.clientEmail,
      clientPhone: form.clientPhone,
      packageId: form.packageId,
      packageName: selectedPackage.name,
      destination: dest ? `${dest.name}, ${dest.country}` : '',
      travelers: form.travelers,
      startDate: form.startDate,
      endDate: form.endDate,
      totalPrice,
      status: 'pendiente' as const,
      createdAt: new Date().toISOString().split('T')[0],
      notes: form.notes,
    };
    addBooking(booking);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Reserva Enviada!</h2>
          <p className="text-gray-600 text-lg mb-2">Tu solicitud de reserva ha sido recibida exitosamente.</p>
          <p className="text-gray-500 mb-6">Un asesor se pondrá en contacto contigo en las próximas 24 horas para confirmar los detalles.</p>
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <p className="font-semibold text-blue-800">Resumen de tu reserva:</p>
            <p className="text-blue-700">{selectedPackage?.name}</p>
            <p className="text-blue-600 font-bold text-xl mt-2">Total: ${totalPrice.toLocaleString()} MXN</p>
          </div>
          <button onClick={() => { setSubmitted(false); setStep(1); setForm({ packageId: '', clientName: '', clientEmail: '', clientPhone: '', travelers: 2, startDate: '', endDate: '', notes: '' }); }} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Hacer otra reserva
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-cyan-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Reserva tu Viaje</h1>
          <p className="text-xl text-blue-200">Completa el formulario y un asesor te contactará para confirmar</p>
        </div>
      </section>

      {/* Steps Indicator */}
      <section className="py-8 px-4 bg-white shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-center gap-4">
          {[
            { n: 1, label: 'Paquete', icon: Calendar },
            { n: 2, label: 'Datos', icon: Users },
            { n: 3, label: 'Confirmar', icon: CreditCard },
          ].map((s, i) => (
            <React.Fragment key={s.n}>
              {i > 0 && <div className={`h-1 w-16 md:w-24 rounded ${step >= s.n ? 'bg-blue-600' : 'bg-gray-200'}`} />}
              <div className={`flex items-center gap-2 ${step >= s.n ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s.n ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <span className="hidden md:block font-semibold">{s.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Form */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Selecciona tu paquete</h2>
                <div className="space-y-4">
                  {packages.filter(p => p.available).map(pkg => (
                    <label key={pkg.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.packageId === pkg.id ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                      <input type="radio" name="package" value={pkg.id} checked={form.packageId === pkg.id} onChange={e => setForm({ ...form, packageId: e.target.value })} className="w-5 h-5 text-blue-600" />
                      <img src={pkg.image} alt={pkg.name} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-bold">{pkg.name}</p>
                        <p className="text-sm text-gray-500">{pkg.duration}</p>
                      </div>
                      <p className="text-xl font-bold text-blue-600">${pkg.price.toLocaleString()}</p>
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Fecha de inicio</label>
                    <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Fecha de fin</label>
                    <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Viajeros</label>
                    <input type="number" min={1} max={20} value={form.travelers} onChange={e => setForm({ ...form, travelers: parseInt(e.target.value) || 1 })} className="w-full border rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <button onClick={() => setStep(2)} disabled={!form.packageId || !form.startDate} className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                  Siguiente →
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Tus datos de contacto</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Nombre completo</label>
                    <input type="text" value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} placeholder="Ej: Juan Pérez García" className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Email</label>
                      <input type="email" value={form.clientEmail} onChange={e => setForm({ ...form, clientEmail: e.target.value })} placeholder="tu@email.com" className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Teléfono</label>
                      <input type="tel" value={form.clientPhone} onChange={e => setForm({ ...form, clientPhone: e.target.value })} placeholder="+52 555 123 4567" className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Notas adicionales (opcional)</label>
                    <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Solicitudes especiales, celebraciones, etc." className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-300 py-3 rounded-xl font-bold hover:bg-gray-50 transition">← Atrás</button>
                  <button onClick={() => setStep(3)} disabled={!form.clientName || !form.clientEmail || !form.clientPhone} className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition disabled:opacity-50">
                    Siguiente →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && selectedPackage && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Confirma tu reserva</h2>
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <img src={selectedPackage.image} alt={selectedPackage.name} className="w-24 h-24 rounded-xl object-cover" />
                    <div>
                      <h3 className="font-bold text-lg">{selectedPackage.name}</h3>
                      <p className="text-gray-500">{selectedPackage.duration}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div><span className="text-sm text-gray-500">Nombre:</span><p className="font-semibold">{form.clientName}</p></div>
                    <div><span className="text-sm text-gray-500">Email:</span><p className="font-semibold">{form.clientEmail}</p></div>
                    <div><span className="text-sm text-gray-500">Teléfono:</span><p className="font-semibold">{form.clientPhone}</p></div>
                    <div><span className="text-sm text-gray-500">Viajeros:</span><p className="font-semibold">{form.travelers}</p></div>
                    <div><span className="text-sm text-gray-500">Fecha inicio:</span><p className="font-semibold">{form.startDate}</p></div>
                    <div><span className="text-sm text-gray-500">Fecha fin:</span><p className="font-semibold">{form.endDate}</p></div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between text-sm"><span>Precio por persona:</span><span>${selectedPackage.price.toLocaleString()}</span></div>
                    <div className="flex justify-between text-sm"><span>Viajeros:</span><span>×{form.travelers}</span></div>
                    <div className="flex justify-between text-xl font-bold mt-2 text-blue-600"><span>Total:</span><span>${totalPrice.toLocaleString()} MXN</span></div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                  <Shield size={16} className="text-green-500" />
                  <span>Tu reserva está protegida. Cancelación gratuita hasta 48h antes.</span>
                </div>
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setStep(2)} className="flex-1 border-2 border-gray-300 py-3 rounded-xl font-bold hover:bg-gray-50 transition">← Atrás</button>
                  <button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-bold hover:shadow-lg transition">
                    ✓ Confirmar Reserva
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
