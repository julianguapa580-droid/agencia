import React from 'react';
import { useStore } from '../data/store';

const SEATS_PER_ROW = 4; // 2 asientos + pasillo + 2 asientos

// Croquis de solo lectura para el sitio público: muestra la distribución y los asientos
// ocupados o libres, pero nunca los nombres de los pasajeros.
export default function SeatMap() {
  const { busLayout, bookings } = useStore();
  const seatCapacity = busLayout.seatsPerFloor;
  const floors = Array.from({ length: busLayout.floors }, (_, i) => i + 1);
  const isOccupied = (seatId: string) =>
    bookings.some(b => b.status !== 'cancelada' && b.seat === seatId);

  const rowsFor = () => {
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

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 flex flex-col md:flex-row gap-6">
        {floors.map(floor => (
          <div key={floor}>
            <p className="text-sm font-semibold text-gray-600 mb-2">Piso {floor}</p>
            <div className="inline-block border-2 border-gray-300 rounded-2xl p-4 bg-gray-50">
              {floor === 1 && (
                <div className="mb-3 flex justify-center">
                  <span className="text-[11px] font-semibold text-gray-500 border border-dashed border-gray-400 rounded px-3 py-1">Frente · Conductor</span>
                </div>
              )}
              <div className="space-y-2">
                {rowsFor().map((row, r) => (
                  <div key={r} className="flex items-center gap-2">
                    {row.map((n, k) => (
                      <React.Fragment key={k}>
                        {k === 2 && <div className="w-6" />}
                        {n === null ? (
                          <div className="w-10 h-10" />
                        ) : (
                          <div
                            title={isOccupied(`${floor}-${n}`) ? 'Ocupado' : 'Disponible'}
                            className={`w-10 h-10 rounded-md text-xs font-bold flex items-center justify-center border-2 ${
                              isOccupied(`${floor}-${n}`)
                                ? 'bg-gray-300 border-gray-400 text-gray-600'
                                : 'bg-white border-green-500 text-green-700'
                            }`}
                          >
                            {n}
                          </div>
                        )}
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
      <div className="text-sm text-gray-600 space-y-2 lg:w-56">
        <p className="font-semibold text-gray-800">Capacidad: {busLayout.floors * busLayout.seatsPerFloor} asientos</p>
        <p className="flex items-center gap-2"><span className="w-4 h-4 rounded border-2 border-green-500 bg-white inline-block" /> Disponible</p>
        <p className="flex items-center gap-2"><span className="w-4 h-4 rounded bg-gray-300 border-2 border-gray-400 inline-block" /> Ocupado</p>
      </div>
    </div>
  );
}
