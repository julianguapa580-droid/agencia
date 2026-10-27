import React, { useState } from 'react';
import { useStore, Employee } from '../../data/store';
import { Plus, Edit2, Trash2, X, Search, Mail, Phone, Briefcase, DollarSign } from 'lucide-react';

export default function ManageEmployees() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useStore();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Employee | null>(null);
  const [creating, setCreating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Employee>>({});
  const [viewing, setViewing] = useState<Employee | null>(null);

  const filtered = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.department.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => {
    setForm({ name: '', role: '', email: '', phone: '', department: 'Ventas', commission: 5, active: true, avatar: '🧑‍💼', hireDate: new Date().toISOString().split('T')[0], sales: 0 });
    setCreating(true);
  };

  const openEdit = (emp: Employee) => { setForm(emp); setEditing(emp); };

  const handleSave = () => {
    if (!form.name || !form.role) return;
    if (creating) {
      addEmployee({ ...form, id: Date.now().toString() } as Employee);
      setCreating(false);
    } else if (editing) {
      updateEmployee({ ...form, id: editing.id } as Employee);
      setEditing(null);
    }
    setForm({});
  };

  const handleDelete = (id: string) => { deleteEmployee(id); setShowDeleteConfirm(null); };

  const departments = ['Ventas', 'Operaciones', 'Marketing', 'Finanzas', 'Atención', 'Dirección'];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Empleados</h1>
          <p className="text-gray-500">{employees.length} empleados • {employees.filter(e => e.active).length} activos</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
          <Plus size={20} /> Nuevo Empleado
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-md">
          <p className="text-sm text-gray-500">Total Empleados</p>
          <p className="text-2xl font-bold text-blue-600">{employees.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <p className="text-sm text-gray-500">Ventas Totales</p>
          <p className="text-2xl font-bold text-green-600">{employees.reduce((s, e) => s + e.sales, 0)}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <p className="text-sm text-gray-500">Comisión Promedio</p>
          <p className="text-2xl font-bold text-purple-600">{(employees.reduce((s, e) => s + e.commission, 0) / employees.length).toFixed(1)}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md">
          <p className="text-sm text-gray-500">Departamentos</p>
          <p className="text-2xl font-bold text-orange-600">{new Set(employees.map(e => e.department)).size}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-md mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar empleado..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(emp => (
          <div key={emp.id} className={`bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow ${!emp.active ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center text-3xl">
                  {emp.avatar}
                </div>
                <div>
                  <h3 className="font-bold">{emp.name}</h3>
                  <p className="text-sm text-gray-500">{emp.role}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${emp.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {emp.active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            <div className="space-y-2 text-sm mb-4">
              <p className="flex items-center gap-2 text-gray-600"><Briefcase size={14} className="text-gray-400" /> {emp.department}</p>
              <p className="flex items-center gap-2 text-gray-600"><Mail size={14} className="text-gray-400" /> {emp.email}</p>
              <p className="flex items-center gap-2 text-gray-600"><Phone size={14} className="text-gray-400" /> {emp.phone}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 pt-3 border-t text-center">
              <div><p className="text-xs text-gray-500">Comisión</p><p className="font-bold text-purple-600">{emp.commission}%</p></div>
              <div><p className="text-xs text-gray-500">Ventas</p><p className="font-bold text-green-600">{emp.sales}</p></div>
              <div><p className="text-xs text-gray-500">Desde</p><p className="font-bold text-gray-700 text-xs">{emp.hireDate}</p></div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setViewing(emp)} className="flex-1 py-2 text-blue-600 bg-blue-50 rounded-lg text-sm font-semibold hover:bg-blue-100 transition">Ver</button>
              <button onClick={() => openEdit(emp)} className="flex-1 py-2 text-orange-600 bg-orange-50 rounded-lg text-sm font-semibold hover:bg-orange-100 transition">Editar</button>
              <button onClick={() => setShowDeleteConfirm(emp.id)} className="py-2 px-3 text-red-600 bg-red-50 rounded-lg text-sm font-semibold hover:bg-red-100 transition"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Detalle del Empleado</h3>
              <button onClick={() => setViewing(null)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center text-5xl mb-3">{viewing.avatar}</div>
              <h4 className="text-xl font-bold">{viewing.name}</h4>
              <p className="text-gray-500">{viewing.role}</p>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-gray-500">Departamento:</span><span className="font-semibold">{viewing.department}</span></div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-gray-500">Email:</span><span className="font-semibold">{viewing.email}</span></div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-gray-500">Teléfono:</span><span className="font-semibold">{viewing.phone}</span></div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-gray-500">Comisión:</span><span className="font-bold text-purple-600">{viewing.commission}%</span></div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-gray-500">Ventas realizadas:</span><span className="font-bold text-green-600">{viewing.sales}</span></div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-gray-500">Fecha ingreso:</span><span className="font-semibold">{viewing.hireDate}</span></div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-gray-500">Estado:</span><span className={`font-semibold ${viewing.active ? 'text-green-600' : 'text-gray-500'}`}>{viewing.active ? 'Activo' : 'Inactivo'}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(creating || editing) && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setCreating(false); setEditing(null); }}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{creating ? 'Nuevo Empleado' : 'Editar Empleado'}</h3>
              <button onClick={() => { setCreating(false); setEditing(null); }} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Nombre *</label>
                  <input type="text" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Cargo *</label>
                  <input type="text" value={form.role || ''} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Teléfono</label>
                  <input type="tel" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Departamento</label>
                  <select value={form.department || ''} onChange={e => setForm({ ...form, department: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Comisión (%)</label>
                  <input type="number" value={form.commission || ''} onChange={e => setForm({ ...form, commission: parseFloat(e.target.value) })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Avatar (emoji)</label>
                <input type="text" value={form.avatar || ''} onChange={e => setForm({ ...form, avatar: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.active || false} onChange={e => setForm({ ...form, active: e.target.checked })} className="w-5 h-5 text-blue-600 rounded" />
                <span className="font-semibold">Empleado activo</span>
              </div>
              <button onClick={handleSave} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                {creating ? 'Crear Empleado' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"><Trash2 className="text-red-600" size={32} /></div>
            <h3 className="text-xl font-bold mb-2">¿Eliminar empleado?</h3>
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
