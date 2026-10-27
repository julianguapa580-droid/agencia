import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-cyan-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Contáctanos</h1>
          <p className="text-xl text-blue-200">Estamos aquí para ayudarte a planificar tu viaje perfecto</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-lg mb-4">Información de Contacto</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg"><MapPin className="text-blue-600" size={20} /></div>
                  <div><p className="font-semibold">Dirección</p><p className="text-gray-600 text-sm">Av. Reforma 250, Col. Juárez, CDMX, México, CP 06600</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-lg"><Phone className="text-green-600" size={20} /></div>
                  <div><p className="font-semibold">Teléfono</p><p className="text-gray-600 text-sm">+52 555 800 9000</p><p className="text-gray-600 text-sm">+52 555 800 9001</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg"><Mail className="text-purple-600" size={20} /></div>
                  <div><p className="font-semibold">Email</p><p className="text-gray-600 text-sm">info@voyagex.com</p><p className="text-gray-600 text-sm">reservas@voyagex.com</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-orange-100 p-2 rounded-lg"><Clock className="text-orange-600" size={20} /></div>
                  <div><p className="font-semibold">Horario</p><p className="text-gray-600 text-sm">Lun - Vie: 9:00 - 19:00</p><p className="text-gray-600 text-sm">Sáb: 9:00 - 14:00</p><p className="text-gray-600 text-sm">Dom: Cerrado</p></div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-white rounded-xl overflow-hidden shadow-md">
              <div className="h-48 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="text-blue-600 mx-auto mb-2" size={32} />
                  <p className="text-blue-800 font-semibold">Av. Reforma 250, CDMX</p>
                  <p className="text-blue-600 text-sm">México</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="bg-white rounded-xl p-12 shadow-md text-center">
                <CheckCircle className="text-green-500 mx-auto mb-4" size={64} />
                <h3 className="text-2xl font-bold mb-2">¡Mensaje Enviado!</h3>
                <p className="text-gray-600 mb-6">Gracias por contactarnos. Un asesor te responderá en menos de 24 horas.</p>
                <button onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-xl p-8 shadow-md">
                <h3 className="text-2xl font-bold mb-6">Envíanos un mensaje</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Nombre completo *</label>
                    <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Tu nombre" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Email *</label>
                    <input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="tu@email.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Teléfono</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="+52 555 123 4567" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Asunto *</label>
                    <select required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="">Selecciona un asunto</option>
                      <option value="cotizacion">Cotización de viaje</option>
                      <option value="reserva">Consulta sobre reserva</option>
                      <option value="grupo">Viaje grupal</option>
                      <option value="corporativo">Viaje corporativo</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-1">Mensaje *</label>
                  <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Cuéntanos sobre tu viaje ideal..." />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-bold text-lg hover:shadow-lg transition flex items-center justify-center gap-2">
                  <Send size={20} /> Enviar Mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
