import React, { useState } from 'react';
import { MessageCircle, X, Send, Phone, Mail } from 'lucide-react';
import { useStore } from '../data/store';
import { useLocation } from 'react-router-dom';

export default function WhatsAppWidget() {
  const { settings, isAdmin } = useStore();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Don't show on admin pages
  if (location.pathname.startsWith('/admin')) return null;

  const handleSend = () => {
    const text = encodeURIComponent(message || 'Hola, me gustaría información sobre sus paquetes de viaje.');
    window.open(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 bg-white rounded-2xl shadow-2xl w-80 overflow-hidden animate-in slide-in-from-bottom-4">
          <div className="bg-green-500 p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold">¡Hola! 👋</h3>
              <button onClick={() => setIsOpen(false)} className="hover:bg-green-600 p-1 rounded"><X size={18} /></button>
            </div>
            <p className="text-green-100 text-sm">¿En qué podemos ayudarte? Escríbenos por WhatsApp o elige otra opción.</p>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Escribe tu mensaje..." rows={3} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none resize-none" />
              <button onClick={handleSend} className="mt-2 w-full bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2 text-sm">
                <Send size={16} /> Enviar por WhatsApp
              </button>
            </div>
            <div className="border-t pt-3 space-y-2">
              <a href={`tel:${settings.phone}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                <div className="bg-blue-100 p-2 rounded-lg"><Phone size={16} className="text-blue-600" /></div>
                <div>
                  <p className="text-sm font-semibold">Llamar ahora</p>
                  <p className="text-xs text-gray-500">{settings.phone}</p>
                </div>
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition">
                <div className="bg-purple-100 p-2 rounded-lg"><Mail size={16} className="text-purple-600" /></div>
                <div>
                  <p className="text-sm font-semibold">Enviar email</p>
                  <p className="text-xs text-gray-500">{settings.email}</p>
                </div>
              </a>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-2 text-center">
            <p className="text-xs text-gray-400">Respondemos en menos de 5 minutos</p>
          </div>
        </div>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 ${isOpen ? 'bg-gray-500' : 'bg-green-500 hover:bg-green-600'}`}>
        {isOpen ? <X className="text-white" size={28} /> : <MessageCircle className="text-white" size={28} />}
      </button>
      {!isOpen && (
        <div className="absolute bottom-20 right-0 bg-white px-3 py-2 rounded-lg shadow-lg text-sm font-semibold whitespace-nowrap animate-bounce">
          ¿Necesitas ayuda? 💬
        </div>
      )}
    </div>
  );
}
