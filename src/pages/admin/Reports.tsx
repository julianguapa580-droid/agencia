import React from 'react';
import { useStore } from '../../data/store';
import { Download } from 'lucide-react';
import { TrendingUp, DollarSign, Users, Calendar, ArrowUpRight, PieChart as PieIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, Legend } from 'recharts';

export default function Reports() {
  const { formatPrice, getCurrentCurrency, bookings, invoices, packages, employees, clients } = useStore();

  const totalRevenue = invoices.reduce((s, i) => s + i.total, 0);
  const totalPaid = invoices.filter(i => i.status === 'pagada').reduce((s, i) => s + i.total, 0);
  const totalPending = invoices.filter(i => i.status !== 'pagada').reduce((s, i) => s + i.total, 0);
  const avgTicket = bookings.length > 0 ? bookings.reduce((s, b) => s + b.totalPrice, 0) / bookings.length : 0;

  // Revenue by month
  const monthlyRevenue = [
    { month: 'Ene', ingresos: 28500, gastos: 12000, ganancia: 16500 },
    { month: 'Feb', ingresos: 35200, gastos: 14000, ganancia: 21200 },
    { month: 'Mar', ingresos: 31800, gastos: 13500, ganancia: 18300 },
    { month: 'Abr', ingresos: 42400, gastos: 16000, ganancia: 26400 },
    { month: 'May', ingresos: 38600, gastos: 15000, ganancia: 23600 },
    { month: 'Jun', ingresos: 45800, gastos: 17000, ganancia: 28800 },
  ];

  // Sales by category
  const salesByCategory = [
    { name: 'Playa', value: 35, color: '#06b6d4' },
    { name: 'Aventura', value: 25, color: '#10b981' },
    { name: 'Cultural', value: 20, color: '#8b5cf6' },
    { name: 'Lujo', value: 15, color: '#f59e0b' },
    { name: 'Familiar', value: 5, color: '#ef4444' },
  ];

  // Top sellers
  const topSellers = employees.filter(e => e.sales > 0).sort((a, b) => b.sales - a.sales).slice(0, 5);

  // Conversion funnel
  const funnelData = [
    { stage: 'Consultas', value: 450 },
    { stage: 'Cotizaciones', value: 280 },
    { stage: 'Reservas', value: 150 },
    { stage: 'Confirmadas', value: 120 },
    { stage: 'Completadas', value: 95 },
  ];

  // Payment methods
  const paymentMethods = [
    { name: 'Tarjeta', value: 45, color: '#3b82f6' },
    { name: 'Transferencia', value: 30, color: '#10b981' },
    { name: 'PayPal', value: 15, color: '#8b5cf6' },
    { name: 'Efectivo', value: 10, color: '#f59e0b' },
  ];

  // Exporta a PDF todo el contenido de reportes: indicadores, gráficas dibujadas y tablas
  const exportReportPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const M = 14; // margen
      const contentW = pageW - M * 2;
      const today = new Date().toISOString().slice(0, 10);
      let y = 20;

      const hex = (h: string): [number, number, number] => {
        const n = parseInt(h.replace('#', ''), 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
      };
      const ensure = (space: number) => {
        if (y + space > pageH - 15) { pdf.addPage(); y = 20; }
      };
      const sectionTitle = (text: string) => {
        ensure(16);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(13);
        pdf.setTextColor(37, 99, 235);
        pdf.text(text, M, y);
        pdf.setTextColor(0, 0, 0);
        y += 4;
        pdf.setDrawColor(200, 200, 200);
        pdf.line(M, y, pageW - M, y);
        y += 6;
      };
      const tableRow = (cells: string[], xs: number[], bold = false) => {
        ensure(7);
        pdf.setFont('helvetica', bold ? 'bold' : 'normal');
        pdf.setFontSize(10);
        cells.forEach((c, i) => pdf.text(c, xs[i], y));
        y += 6;
      };
      const drawPie = (cx: number, cy: number, r: number, slices: { value: number; color: string }[]) => {
        const total = slices.reduce((s, x) => s + x.value, 0);
        let start = -Math.PI / 2;
        slices.forEach(sl => {
          const angle = (sl.value / total) * 2 * Math.PI;
          const steps = Math.max(2, Math.ceil(angle * 24));
          pdf.setFillColor(...hex(sl.color));
          for (let i = 0; i < steps; i++) {
            const a1 = start + (angle * i) / steps;
            const a2 = start + (angle * (i + 1)) / steps;
            pdf.triangle(cx, cy, cx + r * Math.cos(a1), cy + r * Math.sin(a1), cx + r * Math.cos(a2), cy + r * Math.sin(a2), 'F');
          }
          start += angle;
        });
      };
      const legend = (items: { label: string; color: string }[], x: number, startY: number) => {
        let ly = startY;
        items.forEach(it => {
          pdf.setFillColor(...hex(it.color));
          pdf.rect(x, ly - 3, 3, 3, 'F');
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          pdf.text(it.label, x + 5, ly);
          ly += 6;
        });
      };

      // Encabezado
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.text('Reportes y Finanzas', M, y);
      y += 7;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text(`Fecha: ${today}    Moneda: ${getCurrentCurrency().code}`, M, y);
      y += 10;

      // 1. Indicadores (tarjetas)
      sectionTitle('Indicadores generales');
      const kpis = [
        { label: 'Ingresos Totales', value: formatPrice(totalRevenue), color: '#10b981' },
        { label: 'Ganancia Neta', value: formatPrice(totalRevenue * 0.6), color: '#3b82f6' },
        { label: 'Ticket Promedio', value: formatPrice(Math.round(avgTicket)), color: '#8b5cf6' },
        { label: 'Total Reservas', value: String(bookings.length), color: '#f97316' },
      ];
      const kpiW = (contentW - 9) / 4;
      ensure(28);
      kpis.forEach((k, i) => {
        const x = M + i * (kpiW + 3);
        pdf.setFillColor(248, 250, 252);
        pdf.setDrawColor(226, 232, 240);
        pdf.roundedRect(x, y, kpiW, 24, 2, 2, 'FD');
        pdf.setFillColor(...hex(k.color));
        pdf.rect(x, y, 2, 24, 'F');
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        pdf.text(k.label, x + 5, y + 7);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.text(k.value, x + 5, y + 17);
      });
      y += 32;

      // 2. Ingresos vs Gastos vs Ganancia (gráfica de líneas)
      sectionTitle('Ingresos vs Gastos vs Ganancia');
      {
        const chartH = 62;
        ensure(chartH + 20);
        const left = M + 22;
        const right = pageW - M - 2;
        const top = y + 2;
        const bottom = y + chartH;
        const maxV = Math.max(...monthlyRevenue.flatMap(m => [m.ingresos, m.gastos, m.ganancia])) * 1.1;
        const xAt = (i: number) => left + ((right - left) * i) / (monthlyRevenue.length - 1);
        const yAt = (v: number) => bottom - ((bottom - top) * v) / maxV;
        pdf.setFontSize(8);
        pdf.setTextColor(100, 100, 100);
        for (let g = 0; g <= 4; g++) {
          const v = (maxV * g) / 4;
          pdf.setDrawColor(230, 230, 230);
          pdf.line(left, yAt(v), right, yAt(v));
          pdf.text(formatPrice(Math.round(v)), M, yAt(v) + 1);
        }
        pdf.setTextColor(0, 0, 0);
        monthlyRevenue.forEach((m, i) => pdf.text(m.month, xAt(i) - 3, bottom + 5));
        const series: { key: 'ingresos' | 'gastos' | 'ganancia'; color: string; label: string }[] = [
          { key: 'ingresos', color: '#3b82f6', label: 'Ingresos' },
          { key: 'gastos', color: '#ef4444', label: 'Gastos' },
          { key: 'ganancia', color: '#10b981', label: 'Ganancia' },
        ];
        series.forEach(s => {
          pdf.setDrawColor(...hex(s.color));
          pdf.setLineWidth(0.8);
          monthlyRevenue.forEach((m, i) => {
            if (i > 0) pdf.line(xAt(i - 1), yAt(monthlyRevenue[i - 1][s.key]), xAt(i), yAt(m[s.key]));
          });
        });
        pdf.setLineWidth(0.2);
        legend(series.map(s => ({ label: s.label, color: s.color })), left, bottom + 12);
        y = bottom + 20;
      }

      // Tabla de datos mensuales
      ensure(30);
      const mxX = [M, 60, 110, 160];
      tableRow(['Mes', 'Ingresos', 'Gastos', 'Ganancia'], mxX, true);
      monthlyRevenue.forEach(m => tableRow([m.month, formatPrice(m.ingresos), formatPrice(m.gastos), formatPrice(m.ganancia)], mxX));
      y += 6;

      // 3. Ventas por categoría (pastel)
      sectionTitle('Ventas por Categoría');
      ensure(60);
      drawPie(M + 30, y + 26, 24, salesByCategory.map(c => ({ value: c.value, color: c.color })));
      legend(salesByCategory.map(c => ({ label: `${c.name} (${c.value}%)`, color: c.color })), M + 70, y + 10);
      y += 62;

      // 4. Top vendedores (barras)
      sectionTitle('Top Vendedores');
      if (topSellers.length === 0) {
        tableRow(['Sin datos'], [M]);
      } else {
        const maxSales = topSellers[0].sales || 1;
        topSellers.forEach((emp, i) => {
          ensure(10);
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          pdf.text(`#${i + 1}  ${emp.name}`, M, y + 4);
          const barX = M + 60;
          const barMax = contentW - 60 - 30;
          pdf.setFillColor(226, 232, 240);
          pdf.rect(barX, y, barMax, 5, 'F');
          pdf.setFillColor(59, 130, 246);
          pdf.rect(barX, y, barMax * (emp.sales / maxSales), 5, 'F');
          pdf.text(`${emp.sales} ventas`, barX + barMax + 2, y + 4);
          y += 9;
        });
      }
      y += 4;

      // 5. Embudo de conversión (barras horizontales)
      sectionTitle('Embudo de Conversión');
      funnelData.forEach(item => {
        ensure(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.text(item.stage, M, y + 4);
        const barX = M + 35;
        const barMax = contentW - 35 - 30;
        pdf.setFillColor(226, 232, 240);
        pdf.rect(barX, y, barMax, 6, 'F');
        pdf.setFillColor(6, 182, 212);
        pdf.rect(barX, y, barMax * (item.value / funnelData[0].value), 6, 'F');
        pdf.text(`${item.value} (${Math.round((item.value / funnelData[0].value) * 100)}%)`, barX + barMax + 2, y + 4.5);
        y += 10;
      });
      y += 4;

      // 6. Métodos de pago (pastel)
      sectionTitle('Métodos de Pago');
      ensure(60);
      drawPie(M + 30, y + 26, 24, paymentMethods.map(m => ({ value: m.value, color: m.color })));
      legend(paymentMethods.map(m => ({ label: `${m.name} (${m.value}%)`, color: m.color })), M + 70, y + 10);
      y += 62;

      // 7. Resumen financiero
      sectionTitle('Resumen Financiero');
      const resumen = [
        { label: 'Total Cobrado', value: formatPrice(totalPaid) },
        { label: 'Por Cobrar', value: formatPrice(totalPending) },
        { label: 'Comisiones Pagadas', value: formatPrice(totalPaid * 0.05) },
        { label: 'Clientes Activos', value: String(clients.length) },
      ];
      const boxW = (contentW - 6) / 2;
      ensure(36);
      resumen.forEach((r, i) => {
        const x = M + (i % 2) * (boxW + 6);
        const by = y + Math.floor(i / 2) * 18;
        pdf.setFillColor(241, 245, 249);
        pdf.roundedRect(x, by, boxW, 14, 2, 2, 'F');
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(r.label, x + 4, by + 5.5);
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.text(r.value, x + 4, by + 11.5);
      });
      y += 40;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.text('Margen de ganancia: 60%', M, y);

      pdf.save(`reportes_${today}.pdf`);
    } catch (err) {
      console.error('Error al generar el PDF de reportes', err);
      alert('No se pudo generar el PDF. Revisa la consola para más detalles.');
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reportes y Finanzas</h1>
          <p className="text-gray-500">Análisis detallado del rendimiento de la agencia</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportReportPDF} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center gap-2">
            <Download size={16} /> Exportar PDF
          </button>
          <select className="border rounded-lg px-4 py-2 text-sm">
            <option>Últimos 6 meses</option>
            <option>Este año</option>
            <option>Último mes</option>
            <option>Personalizado</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
              <DollarSign className="text-white" size={24} />
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-green-600"><ArrowUpRight size={16} /> +18.2%</span>
          </div>
          <p className="text-3xl font-bold">{formatPrice(totalRevenue)}</p>
          <p className="text-gray-500 text-sm">Ingresos Totales</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
              <TrendingUp className="text-white" size={24} />
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-green-600"><ArrowUpRight size={16} /> +12.5%</span>
          </div>
          <p className="text-3xl font-bold">{formatPrice((totalRevenue * 0.6))}</p>
          <p className="text-gray-500 text-sm">Ganancia Neta</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
              <Users className="text-white" size={24} />
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-green-600"><ArrowUpRight size={16} /> +8.1%</span>
          </div>
          <p className="text-3xl font-bold">{formatPrice(Math.round(avgTicket))}</p>
          <p className="text-gray-500 text-sm">Ticket Promedio</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center">
              <Calendar className="text-white" size={24} />
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-green-600"><ArrowUpRight size={16} /> +22%</span>
          </div>
          <p className="text-3xl font-bold">{bookings.length}</p>
          <p className="text-gray-500 text-sm">Total Reservas</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">Ingresos vs Gastos vs Ganancia</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${formatPrice(value)}`} />
              <Legend />
              <Area type="monotone" dataKey="ingresos" stackId="1" stroke="#3b82f6" fill="#93c5fd" />
              <Area type="monotone" dataKey="gastos" stackId="2" stroke="#ef4444" fill="#fca5a5" />
              <Area type="monotone" dataKey="ganancia" stackId="3" stroke="#10b981" fill="#6ee7b7" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">Ventas por Categoría</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={salesByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                {salesByCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {salesByCategory.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }}></div>
                <span className="text-xs text-gray-600">{s.name} ({s.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Sellers */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">🏆 Top Vendedores</h3>
          <div className="space-y-4">
            {topSellers.map((emp, i) => (
              <div key={emp.id} className="flex items-center gap-4">
                <span className="text-2xl font-bold text-gray-300 w-8">#{i + 1}</span>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center text-xl">{emp.avatar}</div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold text-sm">{emp.name}</span>
                    <span className="text-sm font-bold text-green-600">{emp.sales} ventas</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full" style={{ width: `${(emp.sales / topSellers[0].sales) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">📊 Embudo de Conversión</h3>
          <div className="space-y-3">
            {funnelData.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-24 text-sm font-semibold text-gray-700">{item.stage}</div>
                <div className="flex-1">
                  <div className="w-full bg-gray-100 rounded-full h-8 relative overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-end pr-3" style={{ width: `${(item.value / funnelData[0].value) * 100}%` }}>
                      <span className="text-white text-xs font-bold">{item.value}</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500 w-12 text-right">{Math.round((item.value / funnelData[0].value) * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">💳 Métodos de Pago</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={paymentMethods} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${value}%`}>
                {paymentMethods.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {paymentMethods.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: m.color }}></div>
                <span className="text-xs text-gray-600">{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-md">
          <h3 className="font-bold text-lg mb-4">📋 Resumen Financiero</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600 font-semibold">Total Cobrado</p>
              <p className="text-2xl font-bold text-green-700">{formatPrice(totalPaid)}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <p className="text-sm text-yellow-600 font-semibold">Por Cobrar</p>
              <p className="text-2xl font-bold text-yellow-700">{formatPrice(totalPending)}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-semibold">Comisiones Pagadas</p>
              <p className="text-2xl font-bold text-blue-700">{formatPrice((totalPaid * 0.05))}</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-purple-600 font-semibold">Clientes Activos</p>
              <p className="text-2xl font-bold text-purple-700">{clients.length}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Margen de ganancia:</span>
              <span className="text-2xl font-bold text-green-600">60%</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">ROI:</span>
              <span className="text-2xl font-bold text-blue-600">150%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
