import React, { useState } from 'react';
import { useStore, Invoice } from '../../data/store';
import { FileText, Search, Download, Eye, DollarSign, CreditCard, CheckCircle, Clock, AlertTriangle, Printer } from 'lucide-react';

export default function ManageInvoices() {
  const { formatPrice, convertPrice, getCurrentCurrency, invoices, bookings, updateInvoice } = useStore();

  // Origen y destino del pasajero, tomados de la reserva asociada a la factura
  const routeOf = (inv: Invoice) => {
    const b = bookings.find(x => x.id === inv.bookingId);
    return { origen: b?.origin || '—', destino: b?.destination || '—' };
  };
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pagada' | 'pendiente' | 'vencida'>('all');
  const [viewing, setViewing] = useState<Invoice | null>(null);

  const filtered = invoices.filter(inv => {
    const matchSearch = inv.clientName.toLowerCase().includes(search.toLowerCase()) || inv.folio.toLowerCase().includes(search.toLowerCase());
    if (filter === 'all') return matchSearch;
    return matchSearch && inv.status === filter;
  });

  const totalPaid = invoices.filter(i => i.status === 'pagada').reduce((s, i) => s + i.total, 0);
  const totalPending = invoices.filter(i => i.status === 'pendiente').reduce((s, i) => s + i.total, 0);
  const totalOverdue = invoices.filter(i => i.status === 'vencida').reduce((s, i) => s + i.total, 0);

  const markAsPaid = (inv: Invoice) => updateInvoice({ ...inv, status: 'pagada' });

  // Exporta las facturas visibles (con sus filtros) a Excel, en la moneda seleccionada
  const exportToXLSX = async () => {
    const XLSX = await import('xlsx');
    const currency = getCurrentCurrency();
    const rows = filtered.map(inv => ({
      Folio: inv.folio,
      Cliente: inv.clientName,
      Origen: routeOf(inv).origen,
      Destino: routeOf(inv).destino,
      Fecha: inv.date,
      Vencimiento: inv.dueDate,
      Estado: inv.status,
      Método: inv.method,
      [`Subtotal (${currency.code})`]: convertPrice(inv.amount),
      [`IVA (${currency.code})`]: convertPrice(inv.tax),
      [`Total (${currency.code})`]: convertPrice(inv.total),
    }));
    const sheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Facturas');
    XLSX.writeFile(workbook, `facturas_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Listado de facturas visibles en PDF, en la moneda seleccionada
  const exportToPDF = async () => {
    const { jsPDF } = await import('jspdf');
    const currency = getCurrentCurrency();
    const doc = new jsPDF({ orientation: 'landscape' });
    const today = new Date().toISOString().slice(0, 10);
    doc.setFontSize(16);
    doc.text('Reporte de facturación', 14, 18);
    doc.setFontSize(10);
    doc.text(`Fecha: ${today}    Moneda: ${currency.code}    Facturas: ${filtered.length}`, 14, 26);

    let y = 36;
    doc.setFont('helvetica', 'bold');
    const cols = [14, 44, 100, 135, 170, 205, 240, 265];
    ['Folio', 'Cliente', 'Origen', 'Destino', 'Fecha', 'Vencimiento', 'Estado', 'Total'].forEach((h, i) => {
      doc.text(h, cols[i], y);
    });
    doc.setFont('helvetica', 'normal');
    y += 6;
    filtered.forEach(inv => {
      if (y > 190) { doc.addPage(); y = 20; }
      doc.text(inv.folio, cols[0], y);
      doc.text(inv.clientName.slice(0, 30), cols[1], y);
      doc.text(routeOf(inv).origen.slice(0, 16), cols[2], y);
      doc.text(routeOf(inv).destino.slice(0, 16), cols[3], y);
      doc.text(inv.date, cols[4], y);
      doc.text(inv.dueDate, cols[5], y);
      doc.text(inv.status, cols[6], y);
      doc.text(`${currency.symbol}${convertPrice(inv.total).toLocaleString()}`, cols[7], y);
      y += 7;
    });
    const totalAll = filtered.reduce((s, i) => s + i.total, 0);
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total: ${formatPrice(totalAll)}`, 14, y);
    doc.save(`facturas_${today}.pdf`);
  };

  // Factura individual en PDF
  const downloadInvoicePDF = async (inv: Invoice) => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235);
    doc.text('VoyageX', 14, 20);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('Agencia de Viajes · Av. Reforma 250, CDMX', 14, 27);

    doc.setFontSize(12);
    doc.text(`Factura ${inv.folio}`, 14, 42);
    doc.setFontSize(10);
    doc.text(`Fecha: ${inv.date}`, 14, 50);
    doc.text(`Vencimiento: ${inv.dueDate}`, 14, 56);
    doc.text(`Cliente: ${inv.clientName}`, 14, 62);
    doc.text(`Origen: ${routeOf(inv).origen}`, 14, 68);
    doc.text(`Destino: ${routeOf(inv).destino}`, 14, 74);
    doc.text(`Método de pago: ${inv.method}`, 14, 80);
    doc.text(`Estado: ${inv.status}`, 14, 86);

    doc.line(14, 94, 196, 94);
    doc.text('Subtotal', 14, 104);
    doc.text(formatPrice(inv.amount), 196, 104, { align: 'right' });
    doc.text('IVA', 14, 112);
    doc.text(formatPrice(inv.tax), 196, 112, { align: 'right' });
    doc.setFont('helvetica', 'bold');
    doc.text('Total', 14, 122);
    doc.text(formatPrice(inv.total), 196, 122, { align: 'right' });
    doc.save(`factura_${inv.folio}.pdf`);
  };

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'pagada': return 'bg-green-100 text-green-700';
      case 'pendiente': return 'bg-yellow-100 text-yellow-700';
      case 'vencida': return 'bg-red-100 text-red-700';
    }
  };

  const getMethodIcon = (method: Invoice['method']) => {
    switch (method) {
      case 'tarjeta': return '💳';
      case 'transferencia': return '🏦';
      case 'efectivo': return '💵';
      case 'paypal': return '🅿️';
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
          <p className="text-gray-500">{invoices.length} facturas emitidas</p>
        </div>
        <button onClick={exportToXLSX} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
          <Download size={20} /> Exportar Excel (.xlsx)
        </button>
        <button onClick={exportToPDF} className="bg-gray-800 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-900 transition flex items-center gap-2">
          <Download size={20} /> Exportar PDF
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-1"><CheckCircle size={18} /><span className="text-sm opacity-80">Cobrado</span></div>
          <p className="text-2xl font-bold">{formatPrice(totalPaid)}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-1"><Clock size={18} /><span className="text-sm opacity-80">Pendiente</span></div>
          <p className="text-2xl font-bold">{formatPrice(totalPending)}</p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-rose-600 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-1"><AlertTriangle size={18} /><span className="text-sm opacity-80">Vencido</span></div>
          <p className="text-2xl font-bold">{formatPrice(totalOverdue)}</p>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-1"><DollarSign size={18} /><span className="text-sm opacity-80">Total Facturado</span></div>
          <p className="text-2xl font-bold">{formatPrice(invoices.reduce((s, i) => s + i.total, 0))}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-md mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar por cliente o folio..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div className="flex gap-2">
          {(['all', 'pagada', 'pendiente', 'vencida'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${filter === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              {f === 'all' ? 'Todas' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Folio</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Cliente</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Método</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Fecha</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Total</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Estado</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono font-bold text-sm text-blue-600">{inv.folio}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{inv.clientName}</td>
                  <td className="px-6 py-4 text-sm"><span className="flex items-center gap-1">{getMethodIcon(inv.method)} {inv.method}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{inv.date}</td>
                  <td className="px-6 py-4 text-sm font-bold">{formatPrice(inv.total)}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(inv.status)}`}>{inv.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewing(inv)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Ver"><Eye size={18} /></button>
                      {inv.status !== 'pagada' && (
                        <button onClick={() => markAsPaid(inv)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition" title="Marcar pagada"><CheckCircle size={18} /></button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Invoice Modal */}
      {viewing && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Factura {viewing.folio}</h3>
              <button onClick={() => setViewing(null)} className="flex gap-2">
                <Printer size={20} className="text-gray-500 hover:text-blue-600" />
                <span className="text-gray-400 hover:text-gray-600">✕</span>
              </button>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6">
              <div className="text-center mb-6 pb-4 border-b">
                <h4 className="text-2xl font-bold text-blue-600">VoyageX</h4>
                <p className="text-sm text-gray-500">Agencia de Viajes</p>
                <p className="text-xs text-gray-400">Av. Reforma 250, CDMX</p>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500">Folio:</p>
                  <p className="font-bold">{viewing.folio}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Fecha:</p>
                  <p className="font-bold">{viewing.date}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cliente:</p>
                  <p className="font-bold">{viewing.clientName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Vencimiento:</p>
                  <p className="font-bold">{viewing.dueDate}</p>
                </div>
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm"><span>Subtotal:</span><span>{formatPrice(viewing.amount)}</span></div>
                <div className="flex justify-between text-sm"><span>IVA (16%):</span><span>{formatPrice(viewing.tax)}</span></div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t"><span>Total:</span><span className="text-blue-600">{formatPrice(viewing.total)}</span></div>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="text-sm text-gray-500">Método de pago: {getMethodIcon(viewing.method)} {viewing.method}</span>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(viewing.status)}`}>{viewing.status}</span>
              </div>
            </div>
            <button onClick={() => downloadInvoicePDF(viewing)} className="mt-4 w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2">
              <Download size={18} /> Descargar PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
