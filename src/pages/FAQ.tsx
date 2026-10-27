import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

const faqData = [
  { category: 'Reservas', questions: [
    { q: '¿Cómo puedo hacer una reserva?', a: 'Puedes reservar directamente desde nuestra página web en la sección "Reservar", llamando al +52 555 800 9000, visitando nuestra oficina o enviando un mensaje por WhatsApp. Un asesor te guiará en todo el proceso.' },
    { q: '¿Cuánto tiempo antes debo reservar?', a: 'Recomendamos reservar con al menos 2-3 meses de anticipación para destinos nacionales y 4-6 meses para internacionales. En temporada alta (Semana Santa, verano, diciembre) es mejor reservar con aún más tiempo.' },
    { q: '¿Puedo modificar o cancelar mi reserva?', a: 'Sí, puedes modificar tu reserva hasta 30 días antes del viaje sin costo. Las cancelaciones tienen diferentes políticas según el destino y la anticipación. Consulta los términos y condiciones de tu paquete.' },
    { q: '¿Qué métodos de pago aceptan?', a: 'Aceptamos tarjetas de crédito/débito (Visa, Mastercard, AMEX), transferencia bancaria, depósito en OXXO, PayPal y pago en efectivo en nuestra oficina. También ofrecemos planes de pago a meses sin intereses.' },
  ]},
  { category: 'Documentación', questions: [
    { q: '¿Necesito pasaporte para todos los destinos?', a: 'Para destinos internacionales sí necesitas pasaporte vigente (mínimo 6 meses de vigencia). Para destinos nacionales solo necesitas identificación oficial. Te recomendamos verificar los requisitos específicos de cada país.' },
    { q: '¿Necesito visa para viajar?', a: 'Depende del destino y tu nacionalidad. Con pasaporte mexicano puedes viajar sin visa a más de 150 países. Para destinos como EE.UU., Canadá o Australia necesitas trámite especial. Te asesoramos en todo el proceso.' },
    { q: '¿Qué vacunas necesito para viajar?', a: 'Algunos destinos requieren vacunas específicas (fiebre amarilla para ciertos países de África y Sudamérica). Te recomendamos visitar a tu médico 2 meses antes del viaje y consultar los requisitos del país destino.' },
  ]},
  { category: 'Paquetes', questions: [
    { q: '¿Qué incluyen los paquetes?', a: 'Nuestros paquetes generalmente incluyen: vuelo redondo, alojamiento, traslados aeropuerto-hotel-aeropuerto, seguro de viaje y actividades según el paquete. Cada paquete detalla exactamente qué incluye.' },
    { q: '¿Puedo personalizar un paquete?', a: '¡Por supuesto! Podemos adaptar cualquier paquete a tus necesidades: cambiar hotel, agregar excursiones, extender la estancia, etc. Un asesor te ayudará a crear el viaje perfecto para ti.' },
    { q: '¿Los precios son por persona?', a: 'Sí, todos los precios publicados son por persona en ocupación doble (2 personas por habitación). Para niños aplican tarifas especiales. Consulta con tu asesor los precios para tu caso particular.' },
    { q: '¿Ofrecen descuentos para grupos?', a: 'Sí, ofrecemos precios especiales para grupos de 10 o más personas. También tenemos tarifas para viajes corporativos, lunas de miel y ocasiones especiales. Contáctanos para una cotización grupal.' },
  ]},
  { category: 'Durante el Viaje', questions: [
    { q: '¿Qué pasa si tengo un problema durante el viaje?', a: 'Contamos con soporte 24/7 durante tu viaje. Tendrás un número de emergencia local y nuestro equipo en México estará disponible para asistirte ante cualquier inconveniente.' },
    { q: '¿El seguro de viaje cubre cancelaciones?', a: 'Nuestro seguro básico cubre emergencias médicas, equipaje perdido y cancelación de vuelo por parte de la aerolínea. El seguro premium incluye cancelación por enfermedad, robo y más. Consulta las coberturas detalladas.' },
    { q: '¿Puedo llevar equipaje especial?', a: 'Cada aerolínea tiene sus propias políticas de equipaje. Generalmente incluye 1 maleta documentada de 23kg y 1 equipaje de mano. Para equipaje especial (deportes, instrumentos) consulta con tu asesor.' },
  ]},
];

export default function FAQ() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = ['all', ...faqData.map(f => f.category)];

  const filteredFaq = faqData.filter(f => activeCategory === 'all' || f.category === activeCategory);

  const totalResults = filteredFaq.reduce((sum, f) => sum + f.questions.filter(q => q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase())).length, 0);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-amber-700 to-orange-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <HelpCircle className="mx-auto mb-4" size={48} />
          <h1 className="text-5xl font-bold mb-4">Preguntas Frecuentes</h1>
          <p className="text-xl text-amber-100 max-w-2xl mx-auto">Encuentra respuestas a las dudas más comunes de nuestros viajeros</p>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 px-4 bg-white shadow-sm">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            <input type="text" placeholder="Buscar pregunta..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none text-lg" />
          </div>
          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-semibold transition ${activeCategory === cat ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                {cat === 'all' ? 'Todas' : cat}
              </button>
            ))}
          </div>
          {search && <p className="text-center text-gray-500 mt-3 text-sm">{totalResults} resultados encontrados</p>}
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          {filteredFaq.map(category => {
            const filteredQuestions = category.questions.filter(q =>
              q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase())
            );
            if (filteredQuestions.length === 0) return null;
            return (
              <div key={category.category}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-2 h-8 bg-amber-500 rounded-full"></span>
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {filteredQuestions.map((item, i) => {
                    const key = `${category.category}-${i}`;
                    const isOpen = openItem === key;
                    return (
                      <div key={key} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <button onClick={() => setOpenItem(isOpen ? null : key)} className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition">
                          <span className="font-semibold text-gray-900 pr-4">{item.q}</span>
                          <ChevronDown className={`text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} size={20} />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4">
                            <p className="text-gray-600 leading-relaxed">{item.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-amber-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿No encontraste tu respuesta?</h2>
          <p className="text-gray-600 mb-8">Nuestro equipo está listo para ayudarte. Contáctanos por cualquier medio.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/525558009000" className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-green-600 transition flex items-center justify-center gap-2">
              💬 WhatsApp
            </a>
            <a href="tel:+525558009000" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2">
              📞 Llamar
            </a>
            <a href="/contacto" className="bg-amber-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-700 transition flex items-center justify-center gap-2">
              ✉️ Email
            </a>
            <a href="/reservar" className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition flex items-center justify-center gap-2">
              🎯 Reservar
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
