import React, { useState } from 'react';
import { useStore, CustomerMessage } from '../../data/store';
import { Mail, Eye, Trash2, X, Search, AlertCircle, CheckCircle, Clock, Reply, Star } from 'lucide-react';

export default function ManageMessages() {
  const { messages, updateMessage, deleteMessage } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'replied'>('all');
  const [viewing, setViewing] = useState<CustomerMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const filtered = messages.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase());
    if (filter === 'unread') return matchSearch && !m.read;
    if (filter === 'replied') return matchSearch && m.replied;
    return matchSearch;
  });

  const unreadCount = messages.filter(m => !m.read).length;
  const highPriorityCount = messages.filter(m => m.priority === 'alta' && !m.replied).length;

  const markAsRead = (msg: CustomerMessage) => {
    updateMessage({ ...msg, read: true });
    setViewing(msg);
  };

  const markAsReplied = (msg: CustomerMessage) => {
    updateMessage({ ...msg, read: true, replied: true });
    setViewing(null);
    setReplyText('');
  };

  const handleDelete = (id: string) => { deleteMessage(id); setShowDeleteConfirm(null); };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mensajes y Consultas</h1>
        <p className="text-gray-500">{messages.length} mensajes • {unreadCount} sin leer</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Total Mensajes</p>
          <p className="text-2xl font-bold">{messages.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-yellow-500">
          <p className="text-sm text-gray-500">Sin Leer</p>
          <p className="text-2xl font-bold text-yellow-600">{unreadCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Alta Prioridad</p>
          <p className="text-2xl font-bold text-red-600">{highPriorityCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Respondidos</p>
          <p className="text-2xl font-bold text-green-600">{messages.filter(m => m.replied).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-md mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar mensaje..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="flex gap-2">
          {(['all', 'unread', 'replied'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {f === 'all' ? 'Todos' : f === 'unread' ? 'Sin leer' : 'Respondidos'}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filtered.map(msg => (
          <div key={msg.id} className={`bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow border-l-4 ${!msg.read ? 'border-blue-500' : msg.priority === 'alta' ? 'border-red-500' : msg.priority === 'media' ? 'border-yellow-500' : 'border-gray-200'}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {!msg.read && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                  <h3 className="font-bold">{msg.subject}</h3>
                  {msg.priority === 'alta' && <AlertCircle size={16} className="text-red-500" />}
                  {msg.replied && <CheckCircle size={16} className="text-green-500" />}
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">{msg.message}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="font-semibold text-gray-700">{msg.name}</span>
                  <span>{msg.email}</span>
                  <span>{msg.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${msg.priority === 'alta' ? 'bg-red-100 text-red-700' : msg.priority === 'media' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                  {msg.priority}
                </span>
                <button onClick={() => markAsRead(msg)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"><Eye size={18} /></button>
                <button onClick={() => setShowDeleteConfirm(msg.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-gray-500">No hay mensajes</div>}
      </div>

      {/* View/Reply Modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">{viewing.subject}</h3>
              <button onClick={() => setViewing(null)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">{viewing.name[0]}</div>
                  <div>
                    <p className="font-bold">{viewing.name}</p>
                    <p className="text-xs text-gray-500">{viewing.email} • {viewing.phone}</p>
                  </div>
                  <span className={`ml-auto text-xs px-2 py-1 rounded-full font-medium ${viewing.priority === 'alta' ? 'bg-red-100 text-red-700' : viewing.priority === 'media' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                    Prioridad {viewing.priority}
                  </span>
                </div>
                <p className="text-gray-700 leading-relaxed">{viewing.message}</p>
                <p className="text-xs text-gray-400 mt-3">{viewing.date}</p>
              </div>
              {!viewing.replied && (
                <div>
                  <label className="block text-sm font-semibold mb-1">Respuesta:</label>
                  <textarea value={replyText} onChange={e => setReplyText(e.target.value)} rows={4} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Escribe tu respuesta..." />
                  <button onClick={() => markAsReplied(viewing)} disabled={!replyText} className="mt-2 w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                    <Reply size={16} /> Marcar como respondido
                  </button>
                </div>
              )}
              {viewing.replied && (
                <div className="bg-green-50 rounded-lg p-3 flex items-center gap-2">
                  <CheckCircle className="text-green-600" size={20} />
                  <span className="text-green-700 font-semibold">Este mensaje ya fue respondido</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"><Trash2 className="text-red-600" size={32} /></div>
            <h3 className="text-xl font-bold mb-2">¿Eliminar mensaje?</h3>
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
