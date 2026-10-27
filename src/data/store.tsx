import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types
export interface Destination {
  id: string;
  name: string;
  country: string;
  continent: string;
  description: string;
  image: string;
  rating: number;
  priceFrom: number;
  featured: boolean;
}

export interface TravelPackage {
  id: string;
  name: string;
  destinationId: string;
  duration: string;
  price: number;
  description: string;
  includes: string[];
  image: string;
  category: 'playa' | 'aventura' | 'cultural' | 'lujo' | 'familiar';
  available: boolean;
}

export interface Booking {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  packageId: string;
  packageName: string;
  destination: string;
  travelers: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  createdAt: string;
  notes: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookings: number;
  totalSpent: number;
  registeredAt: string;
}

export interface AgencySettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  taxRate: number;
}

// Initial Data
const initialDestinations: Destination[] = [
  { id: '1', name: 'Cancún', country: 'México', continent: 'América', description: 'Playas de arena blanca y aguas cristalinas del Caribe mexicano. Descubre ruinas mayas y vida nocturna vibrante.', image: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=800', rating: 4.8, priceFrom: 899, featured: true },
  { id: '2', name: 'París', country: 'Francia', continent: 'Europa', description: 'La ciudad del amor te espera con la Torre Eiffel, el Louvre, gastronomía exquisita y romance en cada esquina.', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', rating: 4.9, priceFrom: 1299, featured: true },
  { id: '3', name: 'Tokio', country: 'Japón', continent: 'Asia', description: 'Una fusión perfecta de tradición y modernidad. Templos ancestrales junto a rascacielos futuristas.', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', rating: 4.7, priceFrom: 1599, featured: true },
  { id: '4', name: 'Machu Picchu', country: 'Perú', continent: 'América', description: 'La ciudadela inca perdida entre las nubes. Una de las 7 maravillas del mundo moderno.', image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800', rating: 4.9, priceFrom: 1199, featured: true },
  { id: '5', name: 'Santorini', country: 'Grecia', continent: 'Europa', description: 'Islas con casas blancas y cúpulas azules sobre el mar Egeo. Atardeceres mágicos e inolvidables.', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800', rating: 4.8, priceFrom: 1399, featured: false },
  { id: '6', name: 'Bali', country: 'Indonesia', continent: 'Asia', description: 'Paraíso tropical con templos hindúes, arrozales escalonados, playas paradisíacas y spa de lujo.', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', rating: 4.6, priceFrom: 1099, featured: true },
  { id: '7', name: 'Nueva York', country: 'EE.UU.', continent: 'América', description: 'La ciudad que nunca duerme. Broadway, Central Park, Times Square y una energía incomparable.', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800', rating: 4.7, priceFrom: 999, featured: false },
  { id: '8', name: 'Maldivas', country: 'Maldivas', continent: 'Asia', description: 'Islas paradisíacas con bungalows sobre el agua, arrecifes de coral y la tranquilidad absoluta.', image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', rating: 5.0, priceFrom: 2499, featured: true },
  { id: '9', name: 'Roma', country: 'Italia', continent: 'Europa', description: 'La ciudad eterna con el Coliseo, Vaticano, fontana di Trevi y la mejor pasta del mundo.', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', rating: 4.8, priceFrom: 1199, featured: false },
  { id: '10', name: 'Dubái', country: 'Emiratos Árabes', continent: 'Asia', description: 'Lujo extremo, rascacielos impresionantes, desierto dorado y compras de clase mundial.', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800', rating: 4.6, priceFrom: 1799, featured: false },
  { id: '11', name: 'Punta Cana', country: 'Rep. Dominicana', continent: 'América', description: 'Playas de ensueño con palmeras, resorts todo incluido y la calidez del Caribe.', image: 'https://images.unsplash.com/photo-1580237072353-751a8a5b2561?w=800', rating: 4.5, priceFrom: 799, featured: false },
  { id: '12', name: 'Safari Kenia', country: 'Kenia', continent: 'África', description: 'Vive la aventura de ver los Big Five en su hábitat natural. Una experiencia que cambia la vida.', image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', rating: 4.9, priceFrom: 2199, featured: false },
];

const initialPackages: TravelPackage[] = [
  { id: '1', name: 'Cancún Todo Incluido 7 días', destinationId: '1', duration: '7 días / 6 noches', price: 1299, description: 'Disfruta de Cancún con vuelo, hotel 5 estrellas todo incluido, traslados y tour a Chichén Itzá.', includes: ['Vuelo redondo', 'Hotel 5★ Todo Incluido', 'Traslados', 'Tour Chichén Itzá', 'Seguro de viaje'], image: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=800', category: 'playa', available: true },
  { id: '2', name: 'París Romántico 5 días', destinationId: '2', duration: '5 días / 4 noches', price: 1899, description: 'Escapada romántica a París con vuelo, hotel boutique, crucero por el Sena y cena en la Torre Eiffel.', includes: ['Vuelo redondo', 'Hotel boutique 4★', 'Crucero por el Sena', 'Cena Torre Eiffel', 'City tour', 'Seguro de viaje'], image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', category: 'cultural', available: true },
  { id: '3', name: 'Tokio Imperial 8 días', destinationId: '3', duration: '8 días / 7 noches', price: 2499, description: 'Descubre Japón desde Tokio: templos, gastronomía, tecnología y la cultura más fascinante del mundo.', includes: ['Vuelo redondo', 'Hotel 4★', 'Japan Rail Pass', 'Tour Mt. Fuji', 'Ceremonia del té', 'Seguro de viaje'], image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', category: 'cultural', available: true },
  { id: '4', name: 'Machu Picchu Aventura 6 días', destinationId: '4', duration: '6 días / 5 noches', price: 1699, description: 'Aventura inca con trek por el Camino Inca, visita a Cusco, Valle Sagrado y la ciudadela de Machu Picchu.', includes: ['Vuelo redondo', 'Hotel 3★', 'Trek Camino Inca', 'Guía bilingüe', 'Entradas incluidas', 'Seguro de viaje'], image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800', category: 'aventura', available: true },
  { id: '5', name: 'Maldivas Lujo 5 días', destinationId: '8', duration: '5 días / 4 noches', price: 3999, description: 'Escapada de lujo a las Maldivas con bungalow sobre el agua, spa, snorkel y gastronomía premium.', includes: ['Vuelo redondo', 'Bungalow sobre el agua', 'Pensión completa', 'Spa incluido', 'Snorkel', 'Seguro premium'], image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', category: 'lujo', available: true },
  { id: '6', name: 'Bali Zen 10 días', destinationId: '6', duration: '10 días / 9 noches', price: 1899, description: 'Retiro espiritual en Bali con yoga, templos, arrozales, playas y la mejor gastronomía indonesia.', includes: ['Vuelo redondo', 'Villa privada', 'Clases de yoga', 'Tour templos', 'Rafting', 'Seguro de viaje'], image: 'https://images.unsplash.com/photo-1537996194471-e657df973ab4?w=800', category: 'aventura', available: true },
  { id: '7', name: 'Santorini Romance 6 días', destinationId: '5', duration: '6 días / 5 noches', price: 2199, description: 'Romance en Santorini con hotel con vista a la caldera, tour en catamarán y degustación de vinos.', includes: ['Vuelo redondo', 'Hotel caldera view', 'Tour catamarán', 'Degustación vinos', 'City tour', 'Seguro de viaje'], image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800', category: 'lujo', available: true },
  { id: '8', name: 'Safari Kenia 7 días', destinationId: '12', duration: '7 días / 6 noches', price: 3299, description: 'Safari épico en Kenia con avistamiento de los Big Five, alojamiento en lodges de lujo y Masai Mara.', includes: ['Vuelo redondo', 'Lodge 5★', 'Safari 4x4', 'Guía experto', 'Pensión completa', 'Seguro premium'], image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', category: 'aventura', available: true },
];

const initialBookings: Booking[] = [
  { id: '1', clientName: 'Carlos García', clientEmail: 'carlos@email.com', clientPhone: '+52 555 123 4567', packageId: '1', packageName: 'Cancún Todo Incluido 7 días', destination: 'Cancún, México', travelers: 2, startDate: '2026-03-15', endDate: '2026-03-22', totalPrice: 2598, status: 'confirmada', createdAt: '2026-01-10', notes: 'Habitación con vista al mar' },
  { id: '2', clientName: 'María López', clientEmail: 'maria@email.com', clientPhone: '+52 555 987 6543', packageId: '2', packageName: 'París Romántico 5 días', destination: 'París, Francia', travelers: 2, startDate: '2026-02-14', endDate: '2026-02-19', totalPrice: 3798, status: 'completada', createdAt: '2026-01-05', notes: 'Aniversario de bodas' },
  { id: '3', clientName: 'Roberto Sánchez', clientEmail: 'roberto@email.com', clientPhone: '+52 555 456 7890', packageId: '5', packageName: 'Maldivas Lujo 5 días', destination: 'Maldivas', travelers: 2, startDate: '2026-04-01', endDate: '2026-04-06', totalPrice: 7998, status: 'pendiente', createdAt: '2026-01-20', notes: 'Luna de miel' },
  { id: '4', clientName: 'Ana Martínez', clientEmail: 'ana@email.com', clientPhone: '+52 555 321 0987', packageId: '4', packageName: 'Machu Picchu Aventura 6 días', destination: 'Machu Picchu, Perú', travelers: 4, startDate: '2026-05-10', endDate: '2026-05-16', totalPrice: 6796, status: 'confirmada', createdAt: '2026-01-15', notes: 'Familia con 2 niños' },
  { id: '5', clientName: 'Pedro Fernández', clientEmail: 'pedro@email.com', clientPhone: '+52 555 654 3210', packageId: '3', packageName: 'Tokio Imperial 8 días', destination: 'Tokio, Japón', travelers: 1, startDate: '2026-06-01', endDate: '2026-06-09', totalPrice: 2499, status: 'pendiente', createdAt: '2026-01-25', notes: 'Viaje de negocios + turismo' },
];

const initialClients: Client[] = [
  { id: '1', name: 'Carlos García', email: 'carlos@email.com', phone: '+52 555 123 4567', bookings: 3, totalSpent: 5894, registeredAt: '2024-06-15' },
  { id: '2', name: 'María López', email: 'maria@email.com', phone: '+52 555 987 6543', bookings: 5, totalSpent: 12450, registeredAt: '2023-11-20' },
  { id: '3', name: 'Roberto Sánchez', email: 'roberto@email.com', phone: '+52 555 456 7890', bookings: 2, totalSpent: 11297, registeredAt: '2025-01-10' },
  { id: '4', name: 'Ana Martínez', email: 'ana@email.com', phone: '+52 555 321 0987', bookings: 4, totalSpent: 8996, registeredAt: '2024-03-22' },
  { id: '5', name: 'Pedro Fernández', email: 'pedro@email.com', phone: '+52 555 654 3210', bookings: 1, totalSpent: 2499, registeredAt: '2025-12-01' },
  { id: '6', name: 'Laura Hernández', email: 'laura@email.com', phone: '+52 555 111 2233', bookings: 6, totalSpent: 15780, registeredAt: '2023-08-05' },
  { id: '7', name: 'Diego Torres', email: 'diego@email.com', phone: '+52 555 444 5566', bookings: 2, totalSpent: 4398, registeredAt: '2025-07-18' },
];

// Context
interface StoreContextType {
  destinations: Destination[];
  packages: TravelPackage[];
  bookings: Booking[];
  clients: Client[];
  settings: AgencySettings;
  isAdmin: boolean;
  setIsAdmin: (v: boolean) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  deleteBooking: (id: string) => void;
  addDestination: (dest: Destination) => void;
  updateDestination: (dest: Destination) => void;
  deleteDestination: (id: string) => void;
  addPackage: (pkg: TravelPackage) => void;
  updatePackage: (pkg: TravelPackage) => void;
  deletePackage: (id: string) => void;
  updateSettings: (settings: AgencySettings) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
  const [packages, setPackages] = useState<TravelPackage[]>(initialPackages);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [clients] = useState<Client[]>(initialClients);
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState<AgencySettings>({
    name: 'VoyageX Travel Agency',
    email: 'info@voyagex.com',
    phone: '+52 555 800 9000',
    address: 'Av. Reforma 250, CDMX, México',
    currency: 'MXN',
    taxRate: 16,
  });

  const addBooking = (booking: Booking) => setBookings(prev => [...prev, booking]);
  const updateBooking = (booking: Booking) => setBookings(prev => prev.map(b => b.id === booking.id ? booking : b));
  const deleteBooking = (id: string) => setBookings(prev => prev.filter(b => b.id !== id));

  const addDestination = (dest: Destination) => setDestinations(prev => [...prev, dest]);
  const updateDestination = (dest: Destination) => setDestinations(prev => prev.map(d => d.id === dest.id ? dest : d));
  const deleteDestination = (id: string) => setDestinations(prev => prev.filter(d => d.id !== id));

  const addPackage = (pkg: TravelPackage) => setPackages(prev => [...prev, pkg]);
  const updatePackage = (pkg: TravelPackage) => setPackages(prev => prev.map(p => p.id === pkg.id ? pkg : p));
  const deletePackage = (id: string) => setPackages(prev => prev.filter(p => p.id !== id));

  const updateSettings = (s: AgencySettings) => setSettings(s);

  return (
    <StoreContext.Provider value={{
      destinations, packages, bookings, clients, settings, isAdmin, setIsAdmin,
      addBooking, updateBooking, deleteBooking,
      addDestination, updateDestination, deleteDestination,
      addPackage, updatePackage, deletePackage,
      updateSettings,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
