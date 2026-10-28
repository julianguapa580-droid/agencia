import React, { useState } from 'react';
import { useStore } from '../../data/store';
import { Search, Mail, Phone, Calendar, DollarSign, Eye, X } from 'lucide-react';

export default function ManageClients() {
  const { formatPrice, clients, bookings } = useStore();
  const [search, setSearch] = useState('');
  const [viewing, setViewing] = useState<string | null>(null);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  const getClientBookings = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return [];
    return bookings.filter(b => b.clientEmail === client.email);
  };

  const selectedClient = viewing ? clients.find(c => c.id === viewing) : null;
  const clientBookings = viewing ? getClientBookings(viewing) : [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
        <p className="text-gray-500">{clients.length} clientes registrados</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-md">
          <p className="text-sm text-gray-500">Total Clientes</p>
          <p className="text-3xl font-bold text-blue-600">{clients.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md">
          <p className="text-sm text-gray-500">Ingresos Totales</p>
          <p className="text-3xl font-bold text-green-600">{formatPrice(clients.reduce((s, c) => s + c.totalSpent, 0))}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md">
          <p className="text-sm text-gray-500">Promedio por Cliente</p>
          <p className="text-3xl font-bold text-purple-600">{formatPrice(Math.round(clients.reduce((s, c) => s + c.totalSpent, 0) / clients.length))}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-md mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Cliente</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Contacto</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Reservas</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Total Gastado</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Registro</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(client => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{client.name}</p>
                        <p className="text-xs text-gray-500">ID: {client.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm flex items-center gap-1"><Mail size={14} className="text-gray-400" /> {client.email}</p>
                    <p className="text-sm flex items-center gap-1"><Phone size={14} className="text-gray-400" /> {client.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">{client.bookings}</td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">{formatPrice(client.totalSpent)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{client.registeredAt}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => setViewing(client.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Ver detalle">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewing && selectedClient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Detalle del Cliente</h3>
              <button onClick={() => setViewing(null)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {selectedClient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-lg font-bold">{selectedClient.name}</h4>
                <p className="text-gray-500 text-sm">Cliente desde {selectedClient.registeredAt}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600">Email</p>
                <p className="font-semibold text-sm">{selectedClient.email}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600">Teléfono</p>
                <p className="font-semibold text-sm">{selectedClient.phone}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-600">Total Reservas</p>
                <p className="font-bold text-lg">{selectedClient.bookings}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-600">Total Gastado</p>
                <p className="font-bold text-lg">{formatPrice(selectedClient.totalSpent)}</p>
              </div>
            </div>
            {clientBookings.length > 0 && (
              <div>
                <h4 className="font-bold mb-3">Historial de Reservas</h4>
                <div className="space-y-2">
                  {clientBookings.map(b => (
                    <div key={b.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-sm">{b.packageName}</p>
                        <p className="text-xs text-gray-500">{b.startDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-blue-600">{formatPrice(b.totalPrice)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          b.status === 'confirmada' ? 'bg-green-100 text-green-700' :
                          b.status === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                          b.status === 'completada' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>{b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
