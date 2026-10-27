import React from 'react';
import { Award, Users, Globe, Heart, Target, Shield } from 'lucide-react';

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-cyan-800 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Sobre Nosotros</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">Más de 15 años creando experiencias de viaje inolvidables</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Nuestra Historia</h2>
            <p className="text-gray-600 text-lg mb-4">
              VoyageX nació en 2010 con una visión clara: hacer que viajar sea accesible, emocionante y sin complicaciones para todos. Lo que comenzó como una pequeña oficina con 3 empleados, hoy es una de las agencias de viajes más reconocidas de México.
            </p>
            <p className="text-gray-600 text-lg mb-4">
              Nuestro equipo de más de 50 expertos en viajes ha recorrido cada destino que ofrecemos, garantizando experiencias auténticas y de la más alta calidad. Creemos que cada viaje debe ser una historia que contar.
            </p>
            <p className="text-gray-600 text-lg">
              Con más de 50,000 viajeros satisfechos y presencia en más de 100 destinos alrededor del mundo, seguimos comprometidos con hacer realidad tus sueños de viaje.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white text-center">
              <p className="text-4xl font-bold">15+</p>
              <p className="text-blue-200">Años</p>
            </div>
            <div className="bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-2xl p-6 text-white text-center">
              <p className="text-4xl font-bold">50K+</p>
              <p className="text-cyan-200">Viajeros</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-6 text-white text-center">
              <p className="text-4xl font-bold">100+</p>
              <p className="text-purple-200">Destinos</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white text-center">
              <p className="text-4xl font-bold">50+</p>
              <p className="text-green-200">Empleados</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Nuestros Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: 'Pasión', desc: 'Amamos lo que hacemos. Cada viaje es una oportunidad de crear recuerdos inolvidables.', color: 'text-red-500 bg-red-50' },
              { icon: Shield, title: 'Confianza', desc: 'Transparencia total en precios, servicios y condiciones. Tu tranquilidad es nuestra prioridad.', color: 'text-blue-500 bg-blue-50' },
              { icon: Target, title: 'Excelencia', desc: 'Nos esforzamos por superar las expectativas en cada detalle de tu experiencia de viaje.', color: 'text-green-500 bg-green-50' },
              { icon: Globe, title: 'Innovación', desc: 'Siempre a la vanguardia con las mejores tecnologías y tendencias del mundo del turismo.', color: 'text-purple-500 bg-purple-50' },
              { icon: Users, title: 'Servicio', desc: 'Atención personalizada 24/7. Estamos contigo antes, durante y después de tu viaje.', color: 'text-orange-500 bg-orange-50' },
              { icon: Award, title: 'Calidad', desc: 'Seleccionamos cuidadosamente cada proveedor para garantizar la mejor experiencia posible.', color: 'text-cyan-500 bg-cyan-50' },
            ].map((v, i) => (
              <div key={i} className="p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`w-14 h-14 rounded-xl ${v.color} flex items-center justify-center mb-4`}>
                  <v.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-2">{v.title}</h3>
                <p className="text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Nuestro Equipo</h2>
          <p className="text-gray-600 text-center mb-12 text-lg">Profesionales apasionados por los viajes</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { name: 'Alejandra Ruiz', role: 'Directora General', emoji: '👩‍💼' },
              { name: 'Marco Delgado', role: 'Dir. de Operaciones', emoji: '👨‍💼' },
              { name: 'Sofía Mendoza', role: 'Jefa de Ventas', emoji: '👩‍💻' },
              { name: 'Ricardo Torres', role: 'Dir. de Marketing', emoji: '👨‍💻' },
            ].map((m, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center text-4xl">
                  {m.emoji}
                </div>
                <h3 className="font-bold text-lg">{m.name}</h3>
                <p className="text-gray-500">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">Certificaciones y Alianzas</h2>
          <div className="flex flex-wrap justify-center gap-8">
            {['IATA', 'AMAV', 'SECTUR', 'PROFECO', 'CNET'].map((cert, i) => (
              <div key={i} className="bg-gray-50 rounded-xl px-8 py-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-400">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
