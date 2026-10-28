import React from 'react';
import { useStore, currencies } from '../../data/store';
import { DollarSign, Calendar, Users, MapPin, TrendingUp, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function Dashboard() {
  const { bookings, destinations, packages, clients, selectedCurrency, setSelectedCurrency, formatPrice, convertPrice, getCurrentCurrency } = useStore();

  // Todos los montos se convierten con la moneda seleccionada; los precios base están en MXN
  const totalRevenueMXN = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const activeCurrency = getCurrentCurrency();
  const totalRevenue = convertPrice(totalRevenueMXN);
  const confirmedBookings = bookings.filter(b => b.status === 'confirmada').length;
  const pendingBookings = bookings.filter(b => b.status === 'pendiente').length;
  const totalClients = clients.length;

  const statusData = [
    { name: 'Confirmadas', value: bookings.filter(b => b.status === 'confirmada').length, color: '#10b981' },
    { name: 'Pendientes', value: bookings.filter(b => b.status === 'pendiente').length, color: '#f59e0b' },
    { name: 'Completadas', value: bookings.filter(b => b.status === 'completada').length, color: '#3b82f6' },
    { name: 'Canceladas', value: bookings.filter(b => b.status === 'cancelada').length, color: '#ef4444' },
  ];

  const monthlyDataMXN = [
    { month: 'Ene', ingresos: 12500, reservas: 8 },
    { month: 'Feb', ingresos: 18200, reservas: 12 },
    { month: 'Mar', ingresos: 15800, reservas: 10 },
    { month: 'Abr', ingresos: 22400, reservas: 15 },
    { month: 'May', ingresos: 19600, reservas: 13 },
    { month: 'Jun', ingresos: 25800, reservas: 18 },
  ];
  const monthlyData = monthlyDataMXN.map(m => ({ ...m, ingresos: convertPrice(m.ingresos) }));

  const topDestinations = destinations.slice(0, 5).map(d => ({
    name: d.name,
    reservas: Math.floor(Math.random() * 20) + 5,
  }));

  const recentBookings = bookings.slice(-5).reverse();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Resumen general de la agencia</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Ingresos Totales', value: `${activeCurrency.symbol}${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-green-500 to-green-600', change: '+12.5%', up: true },
          { label: 'Reservas', value: bookings.length, icon: Calendar, color: 'from-blue-500 to-blue-600', change: '+8.2%', up: true },
          { label: 'Clientes', value: totalClients, icon: Users, color: 'from-purple-500 to-purple-600', change: '+5.1%', up: true },
          { label: 'Destinos', value: destinations.length, icon: MapPin, color: 'from-orange-500 to-orange-600', change: '+2', up: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <span className={`flex items-center gap-1 text-sm font-semibold ${stat.up ? 'text-green-600' : 'text-red-600'}`}>
                {stat.up ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-gray-500 text-sm">{stat.label}</p>
            {stat.label === 'Ingresos Totales' && (
              <select
                value={selectedCurrency}
                onChange={e => setSelectedCurrency(e.target.value)}
                className="mt-3 w-full border rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.code} - {c.name}</option>
                ))}
              </select>
            )}
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">Ingresos Mensuales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => [`${activeCurrency.symbol}${value.toLocaleString()}`, 'Ingresos']} />
              <Bar dataKey="ingresos" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">Estado de Reservas</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                {statusData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {statusData.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
                <span className="text-xs text-gray-600">{s.name} ({s.value})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">Reservas Recientes</h3>
          <div className="space-y-3">
            {recentBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold text-sm">{b.clientName}</p>
                  <p className="text-xs text-gray-500">{b.packageName}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-blue-600">{formatPrice(b.totalPrice)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    b.status === 'confirmada' ? 'bg-green-100 text-green-700' :
                    b.status === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                    b.status === 'completada' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Destinations */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">Destinos Populares</h3>
          <div className="space-y-4">
            {topDestinations.map((d, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-300 w-8">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-sm">{d.name}</span>
                    <span className="text-sm text-gray-500">{d.reservas} reservas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: `${(d.reservas / 25) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Clock size={24} />
            <h4 className="font-bold">Pendientes</h4>
          </div>
          <p className="text-3xl font-bold">{pendingBookings}</p>
          <p className="text-blue-200 text-sm">Reservas por confirmar</p>
        </div>
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle size={24} />
            <h4 className="font-bold">Confirmadas</h4>
          </div>
          <p className="text-3xl font-bold">{confirmedBookings}</p>
          <p className="text-green-200 text-sm">Reservas activas</p>
        </div>
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp size={24} />
            <h4 className="font-bold">Paquetes</h4>
          </div>
          <p className="text-3xl font-bold">{packages.length}</p>
          <p className="text-purple-200 text-sm">Paquetes disponibles</p>
        </div>
      </div>
    </div>
  );
}
