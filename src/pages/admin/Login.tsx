import React, { useState } from 'react';
import { useStore } from '../../data/store';
import { Lock, User, Plane } from 'lucide-react';

export default function Login() {
  const { setIsAdmin } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      setIsAdmin(true);
    } else {
      setError('Credenciales incorrectas. Usa admin / admin123');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Panel Administrativo</h1>
          <p className="text-gray-500">VoyageX Travel Agency</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Usuario</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="admin" className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>}
          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-bold hover:shadow-lg transition">
            Iniciar Sesión
          </button>
        </form>
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-800 font-semibold">Credenciales de demo:</p>
          <p className="text-sm text-blue-600">Usuario: <strong>admin</strong> | Contraseña: <strong>admin123</strong></p>
        </div>
      </div>
    </div>
  );
}
