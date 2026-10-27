import React, { useState } from 'react';
import { useStore } from '../../data/store';
import { Save, Building, Mail, Phone, MapPin, DollarSign, Percent } from 'lucide-react';

export default function Settings() {
  const { settings, updateSettings } = useStore();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500">Configuración general de la agencia</p>
      </div>

      <div className="max-w-3xl">
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Building size={24} className="text-blue-600" /> Datos de la Agencia</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Nombre de la agencia</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Teléfono</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                  <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Dirección</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><DollarSign size={24} className="text-green-600" /> Configuración Financiera</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Moneda</label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
                <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="MXN">MXN - Peso Mexicano</option>
                  <option value="USD">USD - Dólar Americano</option>
                  <option value="PEN">PEN - Sol Peruano</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="COP">COP - Peso Colombiano</option>
                  <option value="ARS">ARS - Peso Argentino</option>
                  <option value="CLP">CLP - Peso Chileno</option>
                  <option value="BRL">BRL - Real Brasileño</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Tasa de impuesto (%)</label>
              <div className="relative">
                <Percent className="absolute left-3 top-3 text-gray-400" size={18} />
                <input type="number" value={form.taxRate} onChange={e => setForm({ ...form, taxRate: parseFloat(e.target.value) })} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-6">🔔 Notificaciones</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
              <div>
                <p className="font-semibold text-sm">Notificaciones por email</p>
                <p className="text-xs text-gray-500">Recibir alertas de nuevas reservas</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
              <div>
                <p className="font-semibold text-sm">Resumen diario</p>
                <p className="text-xs text-gray-500">Reporte diario de actividad</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
              <div>
                <p className="font-semibold text-sm">Alertas de cancelación</p>
                <p className="text-xs text-gray-500">Notificar cuando un cliente cancele</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded" />
            </label>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-6">🌐 Redes Sociales</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Facebook</label>
              <input type="text" placeholder="https://facebook.com/voyagex" className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Instagram</label>
              <input type="text" placeholder="@voyagex" className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Twitter / X</label>
              <input type="text" placeholder="@voyagex" className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition flex items-center gap-2">
          <Save size={20} /> Guardar Configuración
        </button>
        {saved && (
          <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-semibold">
            ✅ Configuración guardada exitosamente
          </div>
        )}
      </div>
    </div>
  );
}
