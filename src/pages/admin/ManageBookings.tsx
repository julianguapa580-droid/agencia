import React, { useState } from 'react';
import { useStore, Booking } from '../../data/store';
import { Search, Filter, Eye, Edit2, Trash2, Plus, X, Calendar, Users } from 'lucide-react';

export default function ManageBookings() {
  const { bookings, updateBooking, deleteBooking } = useStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editing, setEditing] = useState<Booking | null>(null);
  const [viewing, setViewing] = useState<Booking | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filtered = bookings.filter(b => {
    const matchSearch = b.clientName.toLowerCase().includes(search.toLowerCase()) || b.packageName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = (booking: Booking, newStatus: Booking['status']) => {
    updateBooking({ ...booking, status: newStatus });
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    deleteBooking(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Reservas</h1>
          <p className="text-gray-500">{bookings.length} reservas registradas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-md mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar por cliente o paquete..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-500" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="all">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="completada">Completada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Cliente</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Paquete</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Fecha</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Viajeros</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Total</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Estado</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(booking => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-semibold text-sm">{booking.clientName}</p>
                    <p className="text-xs text-gray-500">{booking.clientEmail}</p>
                  </td>
                  <td className="px-6 py-4 text-sm">{booking.packageName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{booking.startDate}</td>
                  <td className="px-6 py-4 text-sm">{booking.travelers}</td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-600">${booking.totalPrice.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      booking.status === 'confirmada' ? 'bg-green-100 text-green-700' :
                      booking.status === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                      booking.status === 'completada' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewing(booking)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Ver">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => setEditing(booking)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition" title="Editar">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => setShowDeleteConfirm(booking.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition" title="Eliminar">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">No se encontraron reservas</div>
        )}
      </div>

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Detalle de Reserva</h3>
              <button onClick={() => setViewing(null)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-500">Cliente</p><p className="font-semibold">{viewing.clientName}</p></div>
                <div><p className="text-xs text-gray-500">Email</p><p className="font-semibold">{viewing.clientEmail}</p></div>
                <div><p className="text-xs text-gray-500">Teléfono</p><p className="font-semibold">{viewing.clientPhone}</p></div>
                <div><p className="text-xs text-gray-500">Destino</p><p className="font-semibold">{viewing.destination}</p></div>
                <div><p className="text-xs text-gray-500">Paquete</p><p className="font-semibold">{viewing.packageName}</p></div>
                <div><p className="text-xs text-gray-500">Viajeros</p><p className="font-semibold">{viewing.travelers}</p></div>
                <div><p className="text-xs text-gray-500">Fecha inicio</p><p className="font-semibold">{viewing.startDate}</p></div>
                <div><p className="text-xs text-gray-500">Fecha fin</p><p className="font-semibold">{viewing.endDate}</p></div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">Notas</p>
                <p className="font-semibold">{viewing.notes || 'Sin notas'}</p>
              </div>
              <div className="pt-4 border-t flex justify-between items-center">
                <div>
                  <p className="text-xs text-gray-500">Total</p>
                  <p className="text-2xl font-bold text-blue-600">${viewing.totalPrice.toLocaleString()}</p>
                </div>
                <span className={`text-sm px-4 py-2 rounded-full font-medium ${
                  viewing.status === 'confirmada' ? 'bg-green-100 text-green-700' :
                  viewing.status === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                  viewing.status === 'completada' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {viewing.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Editar Estado</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <p className="text-gray-600 mb-4">Reserva de <strong>{editing.clientName}</strong></p>
            <div className="space-y-3">
              {(['pendiente', 'confirmada', 'completada', 'cancelada'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(editing, status)}
                  className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-all ${editing.status === status ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                >
                  <span className="font-semibold capitalize">{status}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2 className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">¿Eliminar reserva?</h3>
            <p className="text-gray-500 mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 border-2 border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50">Cancelar</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
