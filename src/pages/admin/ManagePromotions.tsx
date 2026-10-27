import React, { useState } from 'react';
import { useStore, Promotion } from '../../data/store';
import { Plus, Edit2, Trash2, X, Search, ToggleLeft, ToggleRight, Tag, Percent, DollarSign } from 'lucide-react';

export default function ManagePromotions() {
  const { promotions, packages, addPromotion, updatePromotion, deletePromotion } = useStore();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Promotion | null>(null);
  const [creating, setCreating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Promotion>>({});

  const filtered = promotions.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => {
    setForm({ title: '', description: '', discount: 10, type: 'percent', code: '', startDate: '', endDate: '', active: true, image: '', packageIds: [] });
    setCreating(true);
  };

  const openEdit = (promo: Promotion) => { setForm(promo); setEditing(promo); };

  const handleSave = () => {
    if (!form.title || !form.code) return;
    if (creating) {
      addPromotion({ ...form, id: Date.now().toString() } as Promotion);
      setCreating(false);
    } else if (editing) {
      updatePromotion({ ...form, id: editing.id } as Promotion);
      setEditing(null);
    }
    setForm({});
  };

  const toggleActive = (promo: Promotion) => updatePromotion({ ...promo, active: !promo.active });
  const handleDelete = (id: string) => { deletePromotion(id); setShowDeleteConfirm(null); };

  const togglePackage = (pkgId: string) => {
    const current = form.packageIds || [];
    setForm({ ...form, packageIds: current.includes(pkgId) ? current.filter(id => id !== pkgId) : [...current, pkgId] });
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Promociones</h1>
          <p className="text-gray-500">{promotions.length} promociones • {promotions.filter(p => p.active).length} activas</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
          <Plus size={20} /> Nueva Promoción
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-5 text-white">
          <p className="text-sm opacity-80">Activas</p>
          <p className="text-3xl font-bold">{promotions.filter(p => p.active).length}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <p className="text-sm opacity-80">Descuento Promedio</p>
          <p className="text-3xl font-bold">{Math.round(promotions.reduce((s, p) => s + (p.type === 'percent' ? p.discount : 0), 0) / promotions.filter(p => p.type === 'percent').length) || 0}%</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-5 text-white">
          <p className="text-sm opacity-80">Total Promociones</p>
          <p className="text-3xl font-bold">{promotions.length}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-md mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar promoción..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.map(promo => (
          <div key={promo.id} className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${promo.active ? 'border-green-500' : 'border-gray-300'}`}>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-48 h-32 md:h-auto overflow-hidden">
                <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-lg">{promo.title}</h3>
                    <p className="text-gray-600 text-sm">{promo.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(promo)} className="text-gray-500">
                      {promo.active ? <ToggleRight size={32} className="text-green-500" /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1">
                    {promo.type === 'percent' ? <Percent size={14} /> : <DollarSign size={14} />}
                    {promo.type === 'percent' ? `${promo.discount}%` : `$${promo.discount}`} OFF
                  </span>
                  <code className="bg-gray-100 px-3 py-1 rounded font-mono font-bold text-blue-600">{promo.code}</code>
                  <span className="text-sm text-gray-500">📅 {promo.startDate} → {promo.endDate}</span>
                  <span className="text-sm text-gray-500">📦 {promo.packageIds.length} paquetes</span>
                </div>
              </div>
              <div className="p-4 flex md:flex-col gap-2 border-t md:border-t-0 md:border-l">
                <button onClick={() => openEdit(promo)} className="flex-1 md:flex-none px-3 py-2 text-orange-600 hover:bg-orange-50 rounded-lg transition text-sm font-semibold flex items-center justify-center gap-1"><Edit2 size={16} /> Editar</button>
                <button onClick={() => setShowDeleteConfirm(promo.id)} className="flex-1 md:flex-none px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition text-sm font-semibold flex items-center justify-center gap-1"><Trash2 size={16} /> Eliminar</button>
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
              <h3 className="text-xl font-bold">{creating ? 'Nueva Promoción' : 'Editar Promoción'}</h3>
              <button onClick={() => { setCreating(false); setEditing(null); }} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Título *</label>
                <input type="text" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Descripción</label>
                <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Tipo</label>
                  <select value={form.type || 'percent'} onChange={e => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="percent">Porcentaje %</option>
                    <option value="fixed">Monto fijo $</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Descuento</label>
                  <input type="number" value={form.discount || ''} onChange={e => setForm({ ...form, discount: parseInt(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Código *</label>
                  <input type="text" value={form.code || ''} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none uppercase" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Fecha inicio</label>
                  <input type="date" value={form.startDate || ''} onChange={e => setForm({ ...form, startDate: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Fecha fin</label>
                  <input type="date" value={form.endDate || ''} onChange={e => setForm({ ...form, endDate: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">URL de imagen</label>
                <input type="text" value={form.image || ''} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Paquetes aplicables</label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-3">
                  {packages.map(pkg => (
                    <label key={pkg.id} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input type="checkbox" checked={(form.packageIds || []).includes(pkg.id)} onChange={() => togglePackage(pkg.id)} className="w-4 h-4 text-blue-600 rounded" />
                      <span className="truncate">{pkg.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.active || false} onChange={e => setForm({ ...form, active: e.target.checked })} className="w-5 h-5 text-blue-600 rounded" />
                <span className="font-semibold">Promoción activa</span>
              </div>
              <button onClick={handleSave} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                {creating ? 'Crear Promoción' : 'Guardar Cambios'}
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
            <h3 className="text-xl font-bold mb-2">¿Eliminar promoción?</h3>
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
