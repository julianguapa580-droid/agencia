import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './data/store';
import Layout from './components/Layout';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Packages from './pages/Packages';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import About from './pages/About';
import AdminLayout from './pages/admin/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageBookings from './pages/admin/ManageBookings';
import ManageDestinations from './pages/admin/ManageDestinations';
import ManagePackages from './pages/admin/ManagePackages';
import ManageClients from './pages/admin/ManageClients';
import Settings from './pages/admin/Settings';

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/destinos" element={<Layout><Destinations /></Layout>} />
          <Route path="/paquetes" element={<Layout><Packages /></Layout>} />
          <Route path="/reservar" element={<Layout><Booking /></Layout>} />
          <Route path="/contacto" element={<Layout><Contact /></Layout>} />
          <Route path="/nosotros" element={<Layout><About /></Layout>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reservas" element={<ManageBookings />} />
            <Route path="destinos" element={<ManageDestinations />} />
            <Route path="paquetes" element={<ManagePackages />} />
            <Route path="clientes" element={<ManageClients />} />
            <Route path="configuracion" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
