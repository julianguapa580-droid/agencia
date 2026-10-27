import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plane, Menu, X, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import CurrencySelector from './CurrencySelector';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Inicio' },
    { to: '/destinos', label: 'Destinos' },
    { to: '/paquetes', label: 'Paquetes' },
    { to: '/promociones', label: 'Promociones' },
    { to: '/cotizador', label: 'Cotizador' },
    { to: '/reservar', label: 'Reservar' },
    { to: '/blog', label: 'Blog' },
    { to: '/nosotros', label: 'Nosotros' },
    { to: '/faq', label: 'FAQ' },
    { to: '/contacto', label: 'Contacto' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Bar */}
      <div className="bg-blue-900 text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1"><Phone size={14} /> +52 555 800 9000</span>
            <span className="flex items-center gap-1"><Mail size={14} /> info@voyagex.com</span>
            <span className="flex items-center gap-1"><MapPin size={14} /> CDMX, México</span>
          </div>
          <div className="flex items-center gap-3">
            <CurrencySelector />
            <Link to="/admin" className="text-blue-200 hover:text-white transition">Admin</Link>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg">
              <Plane className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">VoyageX</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-medium text-sm transition-colors ${isActive(link.to) ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-700 hover:text-blue-600'}`}
              >
                {link.label}
              </Link>
            ))}
            <Link to="/reservar" className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg transition-transform hover:scale-105 ml-2">
              ¡Reserva Ya!
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`block font-medium ${isActive(link.to) ? 'text-blue-600' : 'text-gray-700'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg">
                <Plane className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold text-white">VoyageX</span>
            </div>
            <p className="text-sm leading-relaxed">Tu agencia de viajes de confianza. Más de 15 años creando experiencias inolvidables alrededor del mundo.</p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-600 transition"><Facebook size={18} /></a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-pink-600 transition"><Instagram size={18} /></a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-blue-400 transition"><Twitter size={18} /></a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-red-600 transition"><Youtube size={18} /></a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Explorar</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/destinos" className="hover:text-white transition">Destinos</Link></li>
              <li><Link to="/paquetes" className="hover:text-white transition">Paquetes Turísticos</Link></li>
              <li><Link to="/promociones" className="hover:text-white transition">Promociones</Link></li>
              <li><Link to="/cotizador" className="hover:text-white transition">Cotizador de Viajes</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">Blog de Viajes</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Destinos Populares</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/destinos" className="hover:text-white transition">Cancún, México</Link></li>
              <li><Link to="/destinos" className="hover:text-white transition">París, Francia</Link></li>
              <li><Link to="/destinos" className="hover:text-white transition">Tokio, Japón</Link></li>
              <li><Link to="/destinos" className="hover:text-white transition">Maldivas</Link></li>
              <li><Link to="/destinos" className="hover:text-white transition">Santorini, Grecia</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Ayuda</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="hover:text-white transition">Preguntas Frecuentes</Link></li>
              <li><Link to="/reservar" className="hover:text-white transition">Cómo Reservar</Link></li>
              <li><Link to="/contacto" className="hover:text-white transition">Contacto</Link></li>
              <li><Link to="/nosotros" className="hover:text-white transition">Sobre Nosotros</Link></li>
              <li><a href="#" className="hover:text-white transition">Términos y Condiciones</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><MapPin size={16} /> Av. Reforma 250, CDMX</li>
              <li className="flex items-center gap-2"><Phone size={16} /> +52 555 800 9000</li>
              <li className="flex items-center gap-2"><Mail size={16} /> info@voyagex.com</li>
              <li className="flex items-center gap-2">🕐 Lun-Vie: 9:00 - 19:00</li>
              <li className="flex items-center gap-2">🕐 Sáb: 9:00 - 14:00</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 py-4 text-center text-sm text-gray-500">
          © 2026 VoyageX Travel Agency. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
