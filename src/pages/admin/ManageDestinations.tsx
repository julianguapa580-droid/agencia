import React, { useState } from 'react';
import { useStore, Destination } from '../../data/store';
import { Plus, Edit2, Trash2, X, Star, Search } from 'lucide-react';

export default function ManageDestinations() {
  const { formatPrice, destinations, addDestination, updateDestination, deleteDestination } = useStore();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Destination | null>(null);
  const [creating, setCreating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Destination>>({});

  const filtered = destinations.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) || d.country.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setForm({ name: '', country: '', continent: 'América', description: '', image: '', rating: 4.5, priceFrom: 500, featured: false });
    setCreating(true);
  };

  const openEdit = (dest: Destination) => {
    setForm(dest);
    setEditing(dest);
  };

  const handleSave = () => {
    if (!form.name || !form.country) return;
    if (creating) {
      addDestination({ ...form, id: Date.now().toString() } as Destination);
      setCreating(false);
    } else if (editing) {
      updateDestination({ ...form, id: editing.id } as Destination);
      setEditing(null);
    }
    setForm({});
  };

  const handleDelete = (id: string) => {
    deleteDestination(id);
    setShowDeleteConfirm(null);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Destinos</h1>
          <p className="text-gray-500">{destinations.length} destinos registrados</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
          <Plus size={20} /> Nuevo Destino
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-md mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar destino..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(dest => (
          <div key={dest.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-40">
              <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
              {dest.featured && <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">⭐ Destacado</span>}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{dest.name}</h3>
                  <p className="text-gray-500 text-sm">{dest.country} • {dest.continent}</p>
                </div>
                <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded">
                  <Star className="text-yellow-500 fill-yellow-500" size={14} />
                  <span className="text-sm font-bold">{dest.rating}</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{dest.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-blue-600 font-bold">Desde {formatPrice(dest.priceFrom)}</p>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(dest)} className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition"><Edit2 size={18} /></button>
                  <button onClick={() => setShowDeleteConfirm(dest.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(creating || editing) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setCreating(false); setEditing(null); }}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{creating ? 'Nuevo Destino' : 'Editar Destino'}</h3>
              <button onClick={() => { setCreating(false); setEditing(null); }} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Nombre *</label>
                  <input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">País *</label>
                  <input type="text" value={form.country || ''} onChange={e => setForm({ ...form, country: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Continente</label>
                  <select value={form.continent || ''} onChange={e => setForm({ ...form, continent: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="América">América</option>
                    <option value="Europa">Europa</option>
                    <option value="Asia">Asia</option>
                    <option value="África">África</option>
                    <option value="Oceanía">Oceanía</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Precio desde</label>
                  <input type="number" value={form.priceFrom || ''} onChange={e => setForm({ ...form, priceFrom: parseInt(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">URL de imagen</label>
                <input type="text" value={form.image || ''} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Descripción</label>
                <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Rating (1-5)</label>
                  <input type="number" step="0.1" min="1" max="5" value={form.rating || ''} onChange={e => setForm({ ...form, rating: parseFloat(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.featured || false} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-5 h-5 text-blue-600 rounded" />
                    <span className="font-semibold">Destacado</span>
                  </label>
                </div>
              </div>
              <button onClick={handleSave} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                {creating ? 'Crear Destino' : 'Guardar Cambios'}
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
            <h3 className="text-xl font-bold mb-2">¿Eliminar destino?</h3>
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
