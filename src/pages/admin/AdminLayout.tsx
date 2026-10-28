import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useStore } from '../../data/store';
import { LayoutDashboard, MapPin, Package, Calendar, Users, Settings, LogOut, Plane, Menu, X, ChevronDown, Tag, FileText, Mail, CalendarDays, Receipt, BarChart3 } from 'lucide-react';

export default function AdminLayout() {
  const { isAdmin, setIsAdmin } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin && location.pathname === '/admin') {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, location.pathname, navigate]);

  if (!isAdmin) {
    return <Outlet />;
  }

  const menuItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { to: '/admin/reservas', icon: Calendar, label: 'Reservas' },
    { to: '/admin/destinos', icon: MapPin, label: 'Destinos' },
    { to: '/admin/paquetes', icon: Package, label: 'Paquetes' },
    { to: '/admin/clientes', icon: Users, label: 'Clientes' },
    { to: '/admin/promociones', icon: Tag, label: 'Promociones' },
    { to: '/admin/blog', icon: FileText, label: 'Blog' },
    { to: '/admin/empleados', icon: Users, label: 'Empleados' },
    { to: '/admin/mensajes', icon: Mail, label: 'Mensajes' },
    { to: '/admin/salidas', icon: CalendarDays, label: 'Calendario' },
    { to: '/admin/facturas', icon: Receipt, label: 'Facturación' },
    { to: '/admin/reportes', icon: BarChart3, label: 'Reportes' },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-blue-700">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-400 p-2 rounded-lg">
              <Plane className="text-white" size={20} />
            </div>
            <div>
              <span className="text-lg font-bold">VoyageX</span>
              <p className="text-xs text-blue-300">Panel Admin</p>
            </div>
          </Link>
        </div>
        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)]">
          {menuItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive(item.to, item.exact) ? 'bg-white/20 text-white font-semibold' : 'text-blue-200 hover:bg-white/10 hover:text-white'}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-200 hover:bg-white/10 hover:text-white transition mb-2">
            <ChevronDown size={20} className="rotate-90" />
            <span>Ver sitio web</span>
          </Link>
          <button onClick={() => setIsAdmin(false)} className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/20 hover:text-red-200 transition w-full">
            <LogOut size={20} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right">
              <p className="font-semibold text-sm">Administrador</p>
              <p className="text-xs text-gray-500">admin@voyagex.com</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
