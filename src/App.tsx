import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './data/store';
import Layout from './components/Layout';
import WhatsAppWidget from './components/WhatsAppWidget';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Packages from './pages/Packages';
import Booking from './pages/Booking';
import Contact from './pages/Contact';
import About from './pages/About';
import Promotions from './pages/Promotions';
import Blog from './pages/Blog';
import QuoteCalculator from './pages/QuoteCalculator';
import FAQ from './pages/FAQ';
import AdminLayout from './pages/admin/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import ManageBookings from './pages/admin/ManageBookings';
import ManageDestinations from './pages/admin/ManageDestinations';
import ManagePackages from './pages/admin/ManagePackages';
import ManageClients from './pages/admin/ManageClients';
import ManagePromotions from './pages/admin/ManagePromotions';
import ManageBlog from './pages/admin/ManageBlog';
import ManageEmployees from './pages/admin/ManageEmployees';
import ManageMessages from './pages/admin/ManageMessages';
import ManageDepartures from './pages/admin/ManageDepartures';
import ManageInvoices from './pages/admin/ManageInvoices';
import Reports from './pages/admin/Reports';
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
          <Route path="/promociones" element={<Layout><Promotions /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/cotizador" element={<Layout><QuoteCalculator /></Layout>} />
          <Route path="/faq" element={<Layout><FAQ /></Layout>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Login />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="reservas" element={<ManageBookings />} />
            <Route path="destinos" element={<ManageDestinations />} />
            <Route path="paquetes" element={<ManagePackages />} />
            <Route path="clientes" element={<ManageClients />} />
            <Route path="promociones" element={<ManagePromotions />} />
            <Route path="blog" element={<ManageBlog />} />
            <Route path="empleados" element={<ManageEmployees />} />
            <Route path="mensajes" element={<ManageMessages />} />
            <Route path="salidas" element={<ManageDepartures />} />
            <Route path="facturas" element={<ManageInvoices />} />
            <Route path="reportes" element={<Reports />} />
            <Route path="configuracion" element={<Settings />} />
          </Route>
        </Routes>
        {/* WhatsApp Widget for public pages */}
        <WhatsAppWidget />
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
