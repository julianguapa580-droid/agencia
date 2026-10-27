import React, { useState } from 'react';
import { useStore, currencies } from '../data/store';
import { ChevronDown, Globe } from 'lucide-react';

export default function CurrencySelector() {
  const { selectedCurrency, setSelectedCurrency, getCurrentCurrency } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const currentCurrency = getCurrentCurrency();

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg transition text-sm font-medium"
      >
        <Globe size={16} />
        <span>{currentCurrency.code}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
              <p className="font-semibold text-sm">Seleccionar Moneda</p>
              <p className="text-xs opacity-80">Los precios se convertirán automáticamente</p>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {currencies.map(currency => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setSelectedCurrency(currency.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition flex items-center justify-between ${
                    selectedCurrency === currency.code ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-700 w-8">{currency.symbol}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{currency.code}</p>
                      <p className="text-xs text-gray-500">{currency.name}</p>
                    </div>
                  </div>
                  {selectedCurrency === currency.code && (
                    <span className="text-blue-600 text-xs font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
