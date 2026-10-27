import React, { useState } from 'react';
import { useStore, BlogPost } from '../../data/store';
import { Plus, Edit2, Trash2, X, Search, Eye, EyeOff, FileText } from 'lucide-react';

export default function ManageBlog() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useStore();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [creating, setCreating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<BlogPost>>({});

  const filtered = blogPosts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const openCreate = () => {
    setForm({ title: '', excerpt: '', content: '', image: '', author: '', category: '', date: new Date().toISOString().split('T')[0], published: false, tags: [] });
    setCreating(true);
  };

  const openEdit = (post: BlogPost) => { setForm(post); setEditing(post); };

  const handleSave = () => {
    if (!form.title) return;
    if (creating) {
      addBlogPost({ ...form, id: Date.now().toString() } as BlogPost);
      setCreating(false);
    } else if (editing) {
      updateBlogPost({ ...form, id: editing.id } as BlogPost);
      setEditing(null);
    }
    setForm({});
  };

  const togglePublish = (post: BlogPost) => updateBlogPost({ ...post, published: !post.published });
  const handleDelete = (id: string) => { deleteBlogPost(id); setShowDeleteConfirm(null); };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Blog</h1>
          <p className="text-gray-500">{blogPosts.length} artículos • {blogPosts.filter(p => p.published).length} publicados</p>
        </div>
        <button onClick={openCreate} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
          <Plus size={20} /> Nuevo Artículo
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-md mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar artículo..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Artículo</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Categoría</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Autor</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Fecha</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Estado</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(post => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={post.image} alt={post.title} className="w-14 h-10 rounded object-cover" />
                      <div>
                        <p className="font-semibold text-sm line-clamp-1">{post.title}</p>
                        <p className="text-xs text-gray-500 line-clamp-1">{post.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><span className="text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">{post.category}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-600">{post.author}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{post.date}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => togglePublish(post)} className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${post.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {post.published ? <><Eye size={12} /> Publicado</> : <><EyeOff size={12} /> Borrador</>}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(post)} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition"><Edit2 size={18} /></button>
                      <button onClick={() => setShowDeleteConfirm(post.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"><Trash2 size={18} /></button>
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
              <h3 className="text-xl font-bold">{creating ? 'Nuevo Artículo' : 'Editar Artículo'}</h3>
              <button onClick={() => { setCreating(false); setEditing(null); }} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Título *</label>
                <input type="text" value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Extracto</label>
                <textarea value={form.excerpt || ''} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Contenido</label>
                <textarea value={form.content || ''} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Categoría</label>
                  <select value={form.category || ''} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="">Seleccionar</option>
                    <option value="Destinos">Destinos</option>
                    <option value="Guías">Guías</option>
                    <option value="Tips">Tips</option>
                    <option value="Romance">Romance</option>
                    <option value="Aventura">Aventura</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Autor</label>
                  <input type="text" value={form.author || ''} onChange={e => setForm({ ...form, author: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">URL de imagen</label>
                <input type="text" value={form.image || ''} onChange={e => setForm({ ...form, image: e.target.value })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Tags (separados por coma)</label>
                <input type="text" value={(form.tags || []).join(', ')} onChange={e => setForm({ ...form, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="playas, caribe, tips" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={form.published || false} onChange={e => setForm({ ...form, published: e.target.checked })} className="w-5 h-5 text-blue-600 rounded" />
                <span className="font-semibold">Publicar inmediatamente</span>
              </div>
              <button onClick={handleSave} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                {creating ? 'Crear Artículo' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center"><Trash2 className="text-red-600" size={32} /></div>
            <h3 className="text-xl font-bold mb-2">¿Eliminar artículo?</h3>
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
