import React, { useState } from 'react';
import { useStore, Departure } from '../../data/store';
import { Plus, Edit2, Trash2, X, Calendar, Users, MapPin, DollarSign } from 'lucide-react';

export default function ManageDepartures() {
  const { formatPrice, departures, packages, addDeparture, updateDeparture, deleteDeparture } = useStore();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Departure | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Departure>>({});
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const openCreate = () => {
    setForm({ packageName: '', packageId: packages[0]?.id || '', date: '', spotsTotal: 20, spotsTaken: 0, status: 'abierta', guide: 'Por asignar', price: packages[0]?.price || 0 });
    setCreating(true);
  };

  const openEdit = (dep: Departure) => { setForm(dep); setEditing(dep); };

  const handleSave = () => {
    if (!form.date || !form.packageId) return;
    const pkg = packages.find(p => p.id === form.packageId);
    const data = { ...form, packageName: pkg?.name || form.packageName || '' };
    if (creating) {
      addDeparture({ ...data, id: Date.now().toString() } as Departure);
      setCreating(false);
    } else if (editing) {
      updateDeparture({ ...data, id: editing.id } as Departure);
      setEditing(null);
    }
    setForm({});
  };

  const handleDelete = (id: string) => { deleteDeparture(id); setShowDeleteConfirm(null); };

  const getStatusColor = (status: Departure['status']) => {
    switch (status) {
      case 'abierta': return 'bg-green-100 text-green-700';
      case 'llena': return 'bg-red-100 text-red-700';
      case 'en_curso': return 'bg-blue-100 text-blue-700';
      case 'cancelada': return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusLabel = (status: Departure['status']) => {
    switch (status) {
      case 'abierta': return '🟢 Abierta';
      case 'llena': return '🔴 Llena';
      case 'en_curso': return '🔵 En curso';
      case 'cancelada': return '⚫ Cancelada';
    }
  };

  // Calendar view data
  const getDaysInMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const getDeparturesForDay = (day: number) => {
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return departures.filter(d => d.date === dateStr);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendario de Salidas</h1>
          <p className="text-gray-500">{departures.length} salidas programadas</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${view === 'list' ? 'bg-white shadow' : ''}`}>Lista</button>
            <button onClick={() => setView('calendar')} className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${view === 'calendar' ? 'bg-white shadow' : ''}`}>Calendario</button>
          </div>
          <button onClick={openCreate} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
            <Plus size={20} /> Nueva Salida
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Abiertas</p>
          <p className="text-2xl font-bold text-green-600">{departures.filter(d => d.status === 'abierta').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Llenas</p>
          <p className="text-2xl font-bold text-red-600">{departures.filter(d => d.status === 'llena').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">En Curso</p>
          <p className="text-2xl font-bold text-blue-600">{departures.filter(d => d.status === 'en_curso').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Cupos Disponibles</p>
          <p className="text-2xl font-bold text-purple-600">{departures.reduce((s, d) => s + (d.spotsTotal - d.spotsTaken), 0)}</p>
        </div>
      </div>

      {view === 'list' ? (
        <div className="space-y-4">
          {departures.sort((a, b) => a.date.localeCompare(b.date)).map(dep => {
            const occupancy = (dep.spotsTaken / dep.spotsTotal) * 100;
            return (
              <div key={dep.id} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Calendar className="text-blue-600" size={20} />
                      <h3 className="font-bold text-lg">{dep.packageName}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(dep.status)}`}>
                        {getStatusLabel(dep.status)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {dep.date}</span>
                      <span className="flex items-center gap-1"><Users size={14} /> {dep.spotsTaken}/{dep.spotsTotal} cupos</span>
                      <span className="flex items-center gap-1"><MapPin size={14} /> Guía: {dep.guide}</span>
                      <span className="flex items-center gap-1"><DollarSign size={14} /> {formatPrice(dep.price)}/persona</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Ocupación</span>
                        <span className="font-semibold">{Math.round(occupancy)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full ${occupancy >= 100 ? 'bg-red-500' : occupancy >= 75 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${Math.min(occupancy, 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(dep)} className="px-3 py-2 text-orange-600 bg-orange-50 rounded-lg text-sm font-semibold hover:bg-orange-100 transition flex items-center gap-1"><Edit2 size={16} /> Editar</button>
                    <button onClick={() => setShowDeleteConfirm(dep.id)} className="px-3 py-2 text-red-600 bg-red-50 rounded-lg text-sm font-semibold hover:bg-red-100 transition"><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-lg mb-4">{new Date().toLocaleDateString('es', { month: 'long', year: 'numeric' })}</h3>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(d => (
              <div key={d} className="text-center text-xs font-semibold text-gray-500 py-2">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {getDaysInMonth().map(day => {
              const dayDeps = getDeparturesForDay(day);
              const isToday = day === new Date().getDate();
              return (
                <div key={day} className={`min-h-[80px] border rounded-lg p-1 ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}`}>
                  <p className={`text-xs font-bold ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>{day}</p>
                  {dayDeps.map(dep => (
                    <div key={dep.id} className={`text-[10px] px-1 py-0.5 rounded mt-0.5 truncate ${getStatusColor(dep.status)}`}>
                      {dep.packageName.split(' ').slice(0, 2).join(' ')}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(creating || editing) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setCreating(false); setEditing(null); }}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{creating ? 'Nueva Salida' : 'Editar Salida'}</h3>
              <button onClick={() => { setCreating(false); setEditing(null); }} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Paquete</label>
                <select value={form.packageId || ''} onChange={e => {
                  const pkg = packages.find(p => p.id === e.target.value);
                  setForm({ ...form, packageId: e.target.value, packageName: pkg?.name || '', price: pkg?.price || 0 });
                }} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  {packages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Fecha de salida</label>
                  <input type="date" value={form.date || ''} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Guía</label>
                  <input type="text" value={form.guide || ''} onChange={e => setForm({ ...form, guide: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Cupos totales</label>
                  <input type="number" value={form.spotsTotal || ''} onChange={e => setForm({ ...form, spotsTotal: parseInt(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Cupos ocupados</label>
                  <input type="number" value={form.spotsTaken || ''} onChange={e => setForm({ ...form, spotsTaken: parseInt(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Estado</label>
                <select value={form.status || 'abierta'} onChange={e => setForm({ ...form, status: e.target.value as Departure['status'] })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="abierta">Abierta</option>
                  <option value="llena">Llena</option>
                  <option value="en_curso">En curso</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <button onClick={handleSave} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                {creating ? 'Crear Salida' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"><Trash2 className="text-red-600" size={32} /></div>
            <h3 className="text-xl font-bold mb-2">¿Eliminar salida?</h3>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 border-2 border-gray-300 py-2 rounded-lg font-semibold hover:bg-gray-50">Cancelar</button>
              <button onClick={() => handleDelete(showDeleteConfirm)} className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
