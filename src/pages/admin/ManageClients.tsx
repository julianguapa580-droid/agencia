import React, { useState } from 'react';
import { useStore } from '../../data/store';
import { Search, Mail, Phone, Calendar, DollarSign, Eye, X, Bus, Download } from 'lucide-react';

const SEATS_PER_ROW = 4; // 2 asientos + pasillo + 2 asientos

export default function ManageClients() {
  const { formatPrice, clients, bookings, updateBooking, busLayout, setBusLayout, siteIcon, setSiteIcon, clientsBackground, setClientsBackground } = useStore();

  // Lee una imagen del equipo y la devuelve como data URL
  const readImage = (file: File, onLoad: (dataUrl: string) => void) => {
    if (!file.type.startsWith('image/')) return alert('Selecciona un archivo de imagen.');
    if (file.size > 2 * 1024 * 1024) return alert('La imagen no debe pesar más de 2 MB.');
    const reader = new FileReader();
    reader.onload = () => onLoad(reader.result as string);
    reader.readAsDataURL(file);
  };
  const [search, setSearch] = useState('');
  const [viewing, setViewing] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);

  // ---- Mapa de asientos ----
  const seatCapacity = busLayout.seatsPerFloor;
  const floorsArray = Array.from({ length: busLayout.floors }, (_, i) => i + 1);
  const activeBookings = bookings.filter(b => b.status !== 'cancelada');
  const occupantOf = (seatId: string) => activeBookings.find(b => b.seat === seatId);

  const seatRows = (floor: number) => {
    const rows: (number | null)[][] = [];
    for (let start = 0; start < seatCapacity; start += SEATS_PER_ROW) {
      const row: (number | null)[] = [];
      for (let k = 0; k < SEATS_PER_ROW; k++) {
        const n = start + k + 1;
        row.push(n <= seatCapacity ? n : null);
      }
      rows.push(row);
    }
    return rows;
  };

  const handleCapacityChange = (floors: 1 | 2, seatsPerFloor: number) => {
    const safe = Math.max(SEATS_PER_ROW, Math.min(200, seatsPerFloor || SEATS_PER_ROW));
    // Libera asientos que quedan fuera de la nueva configuración
    bookings.forEach(b => {
      if (!b.seat) return;
      const [f, n] = b.seat.split('-').map(Number);
      if (f > floors || n > safe) updateBooking({ ...b, seat: undefined });
    });
    setBusLayout({ floors, seatsPerFloor: safe });
  };

  const assignSeat = (seatId: string, bookingId: string) => {
    // Quita el asiento a quien lo tuviera
    const current = occupantOf(seatId);
    if (current && current.id !== bookingId) updateBooking({ ...current, seat: undefined });
    if (bookingId) {
      const target = bookings.find(b => b.id === bookingId);
      if (target && target.seat !== seatId) updateBooking({ ...target, seat: seatId });
    }
  };

  const seatLabel = (seatId: string) => {
    const [f, n] = seatId.split('-');
    return `Piso ${f} · Asiento ${n}`;
  };

  // Manifiesto ordenado por asiento (sin asignar al final)
  const manifestRows = () =>
    [...activeBookings]
      .sort((a, b) => {
        const [fa, na] = (a.seat || '99-999').split('-').map(Number);
        const [fb, nb] = (b.seat || '99-999').split('-').map(Number);
        return fa - fb || na - nb;
      })
      .map(b => ({
        asiento: b.seat ? `Piso ${b.seat.split('-')[0]} · ${b.seat.split('-')[1]}` : 'Sin asignar',
        pasajero: b.clientName,
        telefono: b.clientPhone || '',
        origen: b.origin || '—',
        destino: b.destination || '—',
        paquete: b.packageName,
        viajeros: b.travelers,
        estado: b.status,
      }));

  // Manifiesto en PDF (horizontal, con origen y destino)
  const downloadManifest = async () => {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'landscape' });
    const today = new Date().toISOString().slice(0, 10);
    doc.setFontSize(16);
    doc.text('Manifiesto de pasajeros', 14, 18);
    doc.setFontSize(10);
    doc.text(`Fecha: ${today}    Capacidad: ${busLayout.floors * busLayout.seatsPerFloor} asientos (${busLayout.floors} piso${busLayout.floors > 1 ? 's' : ''})`, 14, 26);

    const cols = [14, 48, 100, 135, 175, 210, 245, 265];
    const heads = ['Asiento', 'Pasajero', 'Teléfono', 'Origen', 'Destino', 'Paquete', 'Viajeros', 'Estado'];
    let y = 36;
    doc.setFont('helvetica', 'bold');
    heads.forEach((h, i) => doc.text(h, cols[i], y));
    doc.setFont('helvetica', 'normal');
    y += 6;
    const rows = manifestRows();
    rows.forEach(r => {
      if (y > 190) { doc.addPage(); y = 20; }
      [r.asiento, r.pasajero.slice(0, 28), r.telefono, r.origen.slice(0, 20), r.destino.slice(0, 20), r.paquete.slice(0, 22), String(r.viajeros), r.estado]
        .forEach((v, i) => doc.text(v, cols[i], y));
      y += 7;
    });
    if (rows.length === 0) doc.text('No hay pasajeros registrados.', 14, y);
    doc.save(`manifiesto_${today}.pdf`);
  };

  // Manifiesto en Excel (.xlsx), con origen y destino
  const downloadManifestXLSX = async () => {
    const XLSX = await import('xlsx');
    const sheet = XLSX.utils.json_to_sheet(manifestRows().map(r => ({
      Asiento: r.asiento,
      Pasajero: r.pasajero,
      Teléfono: r.telefono,
      Origen: r.origen,
      Destino: r.destino,
      Paquete: r.paquete,
      Viajeros: r.viajeros,
      Estado: r.estado,
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, 'Manifiesto');
    XLSX.writeFile(workbook, `manifiesto_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  const getClientBookings = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return [];
    return bookings.filter(b => b.clientEmail === client.email);
  };

  const selectedClient = viewing ? clients.find(c => c.id === viewing) : null;
  const clientBookings = viewing ? getClientBookings(viewing) : [];

  return (
    <div className="rounded-2xl p-4 min-h-[80vh]" style={clientsBackground ? { backgroundImage: `url("${clientsBackground}")`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
      {/* Personalización: icono del sitio y fondo de esta pestaña */}
      <div className="bg-white/90 backdrop-blur rounded-xl shadow-md p-5 mb-6">
        <h3 className="font-bold mb-4">Personalización</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-semibold mb-1">Icono del sitio (favicon)</p>
            <p className="text-xs text-gray-500 mb-2">Se muestra en la pestaña del navegador. Recomendado: cuadrado, 64×64 px o más.</p>
            <div className="flex items-center gap-3">
              {siteIcon && <img src={siteIcon} alt="Icono" className="w-10 h-10 rounded border object-contain bg-white" />}
              <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) readImage(f, setSiteIcon); e.target.value = ''; }} className="text-sm" />
              {siteIcon && <button onClick={() => setSiteIcon(null)} className="text-sm text-red-600 hover:underline">Quitar</button>}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-1">Imagen de fondo</p>
            <p className="text-xs text-gray-500 mb-2">Solo se aplica a esta pestaña de Clientes.</p>
            <div className="flex items-center gap-3">
              {clientsBackground && <img src={clientsBackground} alt="Fondo" className="w-16 h-10 rounded border object-cover" />}
              <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) readImage(f, setClientsBackground); e.target.value = ''; }} className="text-sm" />
              {clientsBackground && <button onClick={() => setClientsBackground(null)} className="text-sm text-red-600 hover:underline">Quitar</button>}
            </div>
          </div>
        </div>
      </div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Clientes</h1>
        <p className="text-gray-500">{clients.length} clientes registrados</p>
      </div>

      {/* Mapa de asientos del autobús */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2"><Bus size={22} className="text-blue-600" /> Mapa de asientos</h3>
          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm font-semibold">Pisos
              <select value={busLayout.floors} onChange={e => handleCapacityChange(Number(e.target.value) as 1 | 2, busLayout.seatsPerFloor)} className="ml-2 border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value={1}>1 piso</option>
                <option value={2}>2 pisos</option>
              </select>
            </label>
            <label className="text-sm font-semibold">Asientos por piso
              <input type="number" min={SEATS_PER_ROW} max={200} step={SEATS_PER_ROW} value={busLayout.seatsPerFloor} onChange={e => handleCapacityChange(busLayout.floors, parseInt(e.target.value))} className="ml-2 w-24 border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500" />
            </label>
            <span className="text-sm text-gray-500">Capacidad total: {busLayout.floors * busLayout.seatsPerFloor}</span>
            <button onClick={downloadManifest} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2">
              <Download size={16} /> Manifiesto (PDF)
            </button>
            <button onClick={downloadManifestXLSX} className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition flex items-center gap-2">
              <Download size={16} /> Manifiesto (Excel)
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-6">
            {floorsArray.map(floor => (
              <div key={floor}>
                <p className="text-sm font-semibold text-gray-600 mb-2">Piso {floor}</p>
                <div className="inline-block border-2 border-gray-300 rounded-2xl p-4 bg-gray-50">
                  {floor === 1 && (
                    <div className="mb-3 flex justify-center">
                      <span className="text-[11px] font-semibold text-gray-500 border border-dashed border-gray-400 rounded px-3 py-1">Frente · Conductor</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    {seatRows(floor).map((row, r) => (
                      <div key={r} className="flex items-center gap-2">
                        {row.map((n, k) => (
                          <React.Fragment key={k}>
                            {k === 2 && <div className="w-6" />}
                            {n === null ? (
                              <div className="w-10 h-10" />
                            ) : (() => {
                              const seatId = `${floor}-${n}`;
                              const occ = occupantOf(seatId);
                              const isSel = selectedSeat === seatId;
                              return (
                                <button
                                  onClick={() => setSelectedSeat(isSel ? null : seatId)}
                                  title={occ ? `${occ.clientName} · ${occ.packageName}` : `Libre · ${seatLabel(seatId)}`}
                                  className={`w-10 h-10 rounded-md text-xs font-bold transition border-2 ${
                                    isSel ? 'ring-2 ring-blue-500' : ''
                                  } ${occ ? 'bg-green-500 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-500 hover:border-blue-400'}`}
                                >
                                  {n}
                                </button>
                              );
                            })()}
                          </React.Fragment>
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    {busLayout.floors === 2 && (
                      <span className="text-[11px] font-semibold text-gray-600 bg-yellow-100 rounded px-3 py-1">
                        {floor === 1 ? 'Escalera ↑' : 'Escalera ↓'}
                      </span>
                    )}
                    <span className="ml-auto text-[11px] font-semibold text-gray-600 bg-blue-100 rounded px-3 py-1">Baño</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:w-80">
            {selectedSeat ? (
              <div className="border rounded-xl p-4">
                <p className="font-bold mb-1">{seatLabel(selectedSeat)}</p>
                <p className="text-xs text-gray-500 mb-3">
                  {occupantOf(selectedSeat) ? `Ocupado por ${occupantOf(selectedSeat)!.clientName}` : 'Libre'}
                </p>
                <label className="block text-sm font-semibold mb-1">Asignar pasajero</label>
                <select
                  value={occupantOf(selectedSeat)?.id || ''}
                  onChange={e => assignSeat(selectedSeat, e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">— Libre —</option>
                  {activeBookings
                    .filter(b => !b.seat || b.seat === selectedSeat)
                    .map(b => (
                      <option key={b.id} value={b.id}>{b.clientName} · {b.packageName}</option>
                    ))}
                </select>
                <button onClick={() => setSelectedSeat(null)} className="mt-3 text-sm text-gray-500 hover:text-gray-700">Cerrar</button>
              </div>
            ) : (
              <div className="border rounded-xl p-4 text-sm text-gray-500">
                <p className="mb-2">Haz clic en un asiento para ver o asignar al pasajero.</p>
                <p className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-green-500 inline-block" /> Ocupado · <span className="w-4 h-4 rounded bg-white border border-gray-300 inline-block" /> Libre</p>
                <p className="mt-3">Ocupados: {floorsArray.reduce((s, f) => s + seatRows(f).flat().filter(n => n !== null && occupantOf(`${f}-${n}`)).length, 0)} de {busLayout.floors * busLayout.seatsPerFloor}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-5 shadow-md">
          <p className="text-sm text-gray-500">Total Clientes</p>
          <p className="text-3xl font-bold text-blue-600">{clients.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md">
          <p className="text-sm text-gray-500">Ingresos Totales</p>
          <p className="text-3xl font-bold text-green-600">{formatPrice(clients.reduce((s, c) => s + c.totalSpent, 0))}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-md">
          <p className="text-sm text-gray-500">Promedio por Cliente</p>
          <p className="text-3xl font-bold text-purple-600">{formatPrice(Math.round(clients.reduce((s, c) => s + c.totalSpent, 0) / clients.length))}</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-md mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Cliente</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Contacto</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Reservas</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Total Gastado</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Registro</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(client => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{client.name}</p>
                        <p className="text-xs text-gray-500">ID: {client.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm flex items-center gap-1"><Mail size={14} className="text-gray-400" /> {client.email}</p>
                    <p className="text-sm flex items-center gap-1"><Phone size={14} className="text-gray-400" /> {client.phone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold">{client.bookings}</td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">{formatPrice(client.totalSpent)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{client.registeredAt}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => setViewing(client.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Ver detalle">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewing && selectedClient && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setViewing(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Detalle del Cliente</h3>
              <button onClick={() => setViewing(null)} className="p-1 hover:bg-gray-100 rounded"><X size={20} /></button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {selectedClient.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h4 className="text-lg font-bold">{selectedClient.name}</h4>
                <p className="text-gray-500 text-sm">Cliente desde {selectedClient.registeredAt}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600">Email</p>
                <p className="font-semibold text-sm">{selectedClient.email}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-blue-600">Teléfono</p>
                <p className="font-semibold text-sm">{selectedClient.phone}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-green-600">Total Reservas</p>
                <p className="font-bold text-lg">{selectedClient.bookings}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-purple-600">Total Gastado</p>
                <p className="font-bold text-lg">{formatPrice(selectedClient.totalSpent)}</p>
              </div>
            </div>
            {clientBookings.length > 0 && (
              <div>
                <h4 className="font-bold mb-3">Historial de Reservas</h4>
                <div className="space-y-2">
                  {clientBookings.map(b => (
                    <div key={b.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-sm">{b.packageName}</p>
                        <p className="text-xs text-gray-500">{b.startDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm text-blue-600">{formatPrice(b.totalPrice)}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          b.status === 'confirmada' ? 'bg-green-100 text-green-700' :
                          b.status === 'pendiente' ? 'bg-yellow-100 text-yellow-700' :
                          b.status === 'completada' ? 'bg-blue-100 text-blue-700' :
                          'bg-red-100 text-red-700'
                        }`}>{b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
