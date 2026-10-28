import React, { useState } from 'react';
import { useStore, TravelPackage } from '../../data/store';
import { Plus, Edit2, Trash2, X, Search, ToggleLeft, ToggleRight } from 'lucide-react';

export default function ManagePackages() {
  const { formatPrice, packages, destinations, addPackage, updatePackage, deletePackage } = useStore();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<TravelPackage | null>(null);
  const [creating, setCreating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<TravelPackage>>({});

  const filtered = packages.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setForm({ name: '', destinationId: destinations[0]?.id || '', duration: '', price: 0, description: '', includes: [], image: '', category: 'playa', available: true });
    setCreating(true);
  };

  const openEdit = (pkg: TravelPackage) => {
    setForm(pkg);
    setEditing(pkg);
  };

  const handleSave = () => {
    if (!form.name || !form.destinationId) return;
    if (creating) {
      addPackage({ ...form, id: Date.now().toString() } as TravelPackage);
      setCreating(false);
    } else if (editing) {
      updatePackage({ ...form, id: editing.id } as TravelPackage);
      setEditing(null);
    }
    setForm({});
  };

  const handleDelete = (id: string) => {
    deletePackage(id);
    setShowDeleteConfirm(null);
  };

  const toggleAvailable = (pkg: TravelPackage) => {
    updatePackage({ ...pkg, available: !pkg.available });
  };

  const handleIncludesChange = (value: string) => {
    setForm({ ...form, includes: value.split('\n').filter(v => v.trim()) });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Paquetes</h1>
          <p className="text-gray-500">{packages.length} paquetes registrados</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
          <Plus size={20} /> Nuevo Paquete
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-md mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar paquete..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Paquete</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Categoría</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Duración</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Precio</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Disponible</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(pkg => (
                <tr key={pkg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={pkg.image} alt={pkg.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <p className="font-semibold text-sm">{pkg.name}</p>
                        <p className="text-xs text-gray-500">{destinations.find(d => d.id === pkg.destinationId)?.name || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-50 text-blue-700 capitalize">{pkg.category}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{pkg.duration}</td>
                  <td className="px-6 py-4 text-sm font-bold text-blue-600">{formatPrice(pkg.price)}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleAvailable(pkg)} className="text-gray-600 hover:text-blue-600 transition">
                      {pkg.available ? <ToggleRight size={28} className="text-green-500" /> : <ToggleLeft size={28} className="text-gray-400" />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(pkg)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition"><Edit2 size={18} /></button>
                      <button onClick={() => setShowDeleteConfirm(pkg.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(creating || editing) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setCreating(false); setEditing(null); }}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{creating ? 'Nuevo Paquete' : 'Editar Paquete'}</h3>
              <button onClick={() => { setCreating(false); setEditing(null); }} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Nombre del paquete *</label>
                <input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Destino *</label>
                  <select value={form.destinationId || ''} onChange={e => setForm({ ...form, destinationId: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    {destinations.map(d => <option key={d.id} value={d.id}>{d.name}, {d.country}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Categoría</label>
                  <select value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value as TravelPackage['category'] })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="playa">Playa</option>
                    <option value="aventura">Aventura</option>
                    <option value="cultural">Cultural</option>
                    <option value="lujo">Lujo</option>
                    <option value="familiar">Familiar</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Duración</label>
                  <input type="text" value={form.duration || ''} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="7 días / 6 noches" className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Precio</label>
                  <input type="number" value={form.price || ''} onChange={e => setForm({ ...form, price: parseInt(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">URL de imagen</label>
                <input type="text" value={form.image || ''} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Descripción</label>
                <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Incluye (uno por línea)</label>
                <textarea value={(form.includes || []).join('\n')} onChange={e => handleIncludesChange(e.target.value)} rows={4} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Vuelo redondo&#10;Hotel 5 estrellas&#10;Traslados" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.available || false} onChange={e => setForm({ ...form, available: e.target.checked })} className="w-5 h-5 text-blue-600 rounded" />
                <span className="font-semibold">Disponible para reserva</span>
              </div>
              <button onClick={handleSave} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                {creating ? 'Crear Paquete' : 'Guardar Cambios'}
              </button>
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
            <h3 className="text-xl font-bold mb-2">¿Eliminar paquete?</h3>
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
