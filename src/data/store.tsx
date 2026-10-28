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
  spots: number;
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
  paymentStatus: 'pendiente' | 'pagado' | 'parcial';
  seat?: string; // Asiento asignado, formato "piso-número" (ej. "2-7")
}

export interface BusLayout {
  floors: 1 | 2;
  seatsPerFloor: number;
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

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount: number;
  type: 'percent' | 'fixed';
  code: string;
  startDate: string;
  endDate: string;
  active: boolean;
  image: string;
  packageIds: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  date: string;
  published: boolean;
  tags: string[];
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  department: string;
  commission: number;
  active: boolean;
  avatar: string;
  hireDate: string;
  sales: number;
}

export interface CustomerMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
  replied: boolean;
  priority: 'baja' | 'media' | 'alta';
}

export interface Departure {
  id: string;
  packageName: string;
  packageId: string;
  date: string;
  spotsTotal: number;
  spotsTaken: number;
  status: 'abierta' | 'llena' | 'cancelada' | 'en_curso';
  guide: string;
  price: number;
}

export interface Invoice {
  id: string;
  bookingId: string;
  clientName: string;
  amount: number;
  tax: number;
  total: number;
  date: string;
  dueDate: string;
  status: 'pagada' | 'pendiente' | 'vencida';
  method: 'tarjeta' | 'transferencia' | 'efectivo' | 'paypal';
  folio: string;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Rate relative to MXN (base currency)
}

export const currencies: Currency[] = [
  { code: 'MXN', symbol: '$', name: 'Peso Mexicano', rate: 1 },
  { code: 'USD', symbol: '$', name: 'Dólar Americano', rate: 0.058 },
  { code: 'PEN', symbol: 'S/', name: 'Sol Peruano', rate: 0.22 },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.053 },
  { code: 'COP', symbol: '$', name: 'Peso Colombiano', rate: 230 },
  { code: 'ARS', symbol: '$', name: 'Peso Argentino', rate: 50 },
  { code: 'CLP', symbol: '$', name: 'Peso Chileno', rate: 52 },
  { code: 'BRL', symbol: 'R$', name: 'Real Brasileño', rate: 0.29 },
];

export interface AgencySettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  taxRate: number;
  whatsapp: string;
  facebook: string;
  instagram: string;
  twitter: string;
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
  { id: '1', name: 'Cancún Todo Incluido 7 días', destinationId: '1', duration: '7 días / 6 noches', price: 1299, description: 'Disfruta de Cancún con vuelo, hotel 5 estrellas todo incluido, traslados y tour a Chichén Itzá.', includes: ['Vuelo redondo', 'Hotel 5★ Todo Incluido', 'Traslados', 'Tour Chichén Itzá', 'Seguro de viaje'], image: 'https://images.unsplash.com/photo-1510097467424-192d713fd8b2?w=800', category: 'playa', available: true, spots: 20 },
  { id: '2', name: 'París Romántico 5 días', destinationId: '2', duration: '5 días / 4 noches', price: 1899, description: 'Escapada romántica a París con vuelo, hotel boutique, crucero por el Sena y cena en la Torre Eiffel.', includes: ['Vuelo redondo', 'Hotel boutique 4★', 'Crucero por el Sena', 'Cena Torre Eiffel', 'City tour', 'Seguro de viaje'], image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', category: 'cultural', available: true, spots: 15 },
  { id: '3', name: 'Tokio Imperial 8 días', destinationId: '3', duration: '8 días / 7 noches', price: 2499, description: 'Descubre Japón desde Tokio: templos, gastronomía, tecnología y la cultura más fascinante del mundo.', includes: ['Vuelo redondo', 'Hotel 4★', 'Japan Rail Pass', 'Tour Mt. Fuji', 'Ceremonia del té', 'Seguro de viaje'], image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', category: 'cultural', available: true, spots: 12 },
  { id: '4', name: 'Machu Picchu Aventura 6 días', destinationId: '4', duration: '6 días / 5 noches', price: 1699, description: 'Aventura inca con trek por el Camino Inca, visita a Cusco, Valle Sagrado y la ciudadela de Machu Picchu.', includes: ['Vuelo redondo', 'Hotel 3★', 'Trek Camino Inca', 'Guía bilingüe', 'Entradas incluidas', 'Seguro de viaje'], image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800', category: 'aventura', available: true, spots: 10 },
  { id: '5', name: 'Maldivas Lujo 5 días', destinationId: '8', duration: '5 días / 4 noches', price: 3999, description: 'Escapada de lujo a las Maldivas con bungalow sobre el agua, spa, snorkel y gastronomía premium.', includes: ['Vuelo redondo', 'Bungalow sobre el agua', 'Pensión completa', 'Spa incluido', 'Snorkel', 'Seguro premium'], image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', category: 'lujo', available: true, spots: 8 },
  { id: '6', name: 'Bali Zen 10 días', destinationId: '6', duration: '10 días / 9 noches', price: 1899, description: 'Retiro espiritual en Bali con yoga, templos, arrozales, playas y la mejor gastronomía indonesia.', includes: ['Vuelo redondo', 'Villa privada', 'Clases de yoga', 'Tour templos', 'Rafting', 'Seguro de viaje'], image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', category: 'aventura', available: true, spots: 14 },
  { id: '7', name: 'Santorini Romance 6 días', destinationId: '5', duration: '6 días / 5 noches', price: 2199, description: 'Romance en Santorini con hotel con vista a la caldera, tour en catamarán y degustación de vinos.', includes: ['Vuelo redondo', 'Hotel caldera view', 'Tour catamarán', 'Degustación vinos', 'City tour', 'Seguro de viaje'], image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800', category: 'lujo', available: true, spots: 10 },
  { id: '8', name: 'Safari Kenia 7 días', destinationId: '12', duration: '7 días / 6 noches', price: 3299, description: 'Safari épico en Kenia con avistamiento de los Big Five, alojamiento en lodges de lujo y Masai Mara.', includes: ['Vuelo redondo', 'Lodge 5★', 'Safari 4x4', 'Guía experto', 'Pensión completa', 'Seguro premium'], image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800', category: 'aventura', available: true, spots: 8 },
];

const initialBookings: Booking[] = [
  { id: '1', clientName: 'Carlos García', clientEmail: 'carlos@email.com', clientPhone: '+52 555 123 4567', packageId: '1', packageName: 'Cancún Todo Incluido 7 días', destination: 'Cancún, México', travelers: 2, startDate: '2026-03-15', endDate: '2026-03-22', totalPrice: 2598, status: 'confirmada', createdAt: '2026-01-10', notes: 'Habitación con vista al mar', paymentStatus: 'pagado' },
  { id: '2', clientName: 'María López', clientEmail: 'maria@email.com', clientPhone: '+52 555 987 6543', packageId: '2', packageName: 'París Romántico 5 días', destination: 'París, Francia', travelers: 2, startDate: '2026-02-14', endDate: '2026-02-19', totalPrice: 3798, status: 'completada', createdAt: '2026-01-05', notes: 'Aniversario de bodas', paymentStatus: 'pagado' },
  { id: '3', clientName: 'Roberto Sánchez', clientEmail: 'roberto@email.com', clientPhone: '+52 555 456 7890', packageId: '5', packageName: 'Maldivas Lujo 5 días', destination: 'Maldivas', travelers: 2, startDate: '2026-04-01', endDate: '2026-04-06', totalPrice: 7998, status: 'pendiente', createdAt: '2026-01-20', notes: 'Luna de miel', paymentStatus: 'pendiente' },
  { id: '4', clientName: 'Ana Martínez', clientEmail: 'ana@email.com', clientPhone: '+52 555 321 0987', packageId: '4', packageName: 'Machu Picchu Aventura 6 días', destination: 'Machu Picchu, Perú', travelers: 4, startDate: '2026-05-10', endDate: '2026-05-16', totalPrice: 6796, status: 'confirmada', createdAt: '2026-01-15', notes: 'Familia con 2 niños', paymentStatus: 'parcial' },
  { id: '5', clientName: 'Pedro Fernández', clientEmail: 'pedro@email.com', clientPhone: '+52 555 654 3210', packageId: '3', packageName: 'Tokio Imperial 8 días', destination: 'Tokio, Japón', travelers: 1, startDate: '2026-06-01', endDate: '2026-06-09', totalPrice: 2499, status: 'pendiente', createdAt: '2026-01-25', notes: 'Viaje de negocios + turismo', paymentStatus: 'pendiente' },
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

const initialPromotions: Promotion[] = [
  { id: '1', title: '🔥 Hot Sale - 30% OFF', description: 'Descuento del 30% en todos los paquetes de playa. ¡Solo por tiempo limitado!', discount: 30, type: 'percent', code: 'HOTSALE30', startDate: '2026-05-01', endDate: '2026-05-31', active: true, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', packageIds: ['1', '5'] },
  { id: '2', title: '💑 Parejas - $500 OFF', description: 'Descuento de $500 MXN para parejas en paquetes románticos. Válido en febrero.', discount: 500, type: 'fixed', code: 'PAREJA500', startDate: '2026-02-01', endDate: '2026-02-28', active: true, image: 'https://images.unsplash.com/photo-1439130490301-25e322d88054?w=800', packageIds: ['2', '7'] },
  { id: '3', title: '🎄 Navidad Mágica 25% OFF', description: 'Celebra la Navidad en destinos increíbles con 25% de descuento.', discount: 25, type: 'percent', code: 'NAVIDAD25', startDate: '2026-12-01', endDate: '2026-12-31', active: false, image: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?w=800', packageIds: ['2', '3', '7'] },
  { id: '4', title: '👨‍👩‍👧‍👦 Familia Feliz 20% OFF', description: 'Viaja en familia con 20% de descuento. Los niños menores de 12 viajan gratis.', discount: 20, type: 'percent', code: 'FAMILIA20', startDate: '2026-06-01', endDate: '2026-08-31', active: true, image: 'https://images.unsplash.com/photo-1602002418816-5c0aeef426aa?w=800', packageIds: ['1', '4', '6'] },
];

const initialBlogPosts: BlogPost[] = [
  { id: '1', title: '10 Playas Paradisíacas que Debes Visitar en 2026', excerpt: 'Descubre las playas más impresionantes del mundo para tus próximas vacaciones.', content: 'El mundo está lleno de playas increíbles que te dejarán sin aliento. Desde las arenas blancas de Maldivas hasta las costas vírgenes de Tailandia...', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', author: 'Alejandra Ruiz', category: 'Destinos', date: '2026-01-15', published: true, tags: ['playas', 'caribe', 'asia'] },
  { id: '2', title: 'Guía Completa para Viajar a Japón por Primera Vez', excerpt: 'Todo lo que necesitas saber antes de tu primer viaje al país del sol naciente.', content: 'Japón es un destino fascinante que combina tradición milenaria con tecnología de vanguardia. En esta guía te contamos todo...', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800', author: 'Marco Delgado', category: 'Guías', date: '2026-01-10', published: true, tags: ['japón', 'asia', 'cultura'] },
  { id: '3', title: 'Cómo Empacar para un Viaje de 2 Semanas', excerpt: 'Tips y trucos para hacer la maleta perfecta sin olvidar nada esencial.', content: 'Empacar puede ser un arte. Con estos consejos podrás llevar todo lo necesario en una sola maleta...', image: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=800', author: 'Sofía Mendoza', category: 'Tips', date: '2026-01-08', published: true, tags: ['tips', 'equipaje', 'preparación'] },
  { id: '4', title: 'Los Mejores Destinos para Luna de Miel', excerpt: 'Romance y aventura se combinan en estos destinos perfectos para recién casados.', content: 'Tu luna de miel debe ser perfecta. Estos son los destinos más románticos del mundo...', image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800', author: 'Ricardo Torres', category: 'Romance', date: '2026-01-05', published: true, tags: ['luna de miel', 'romance', 'parejas'] },
  { id: '5', title: 'Safari en África: Todo lo que Debes Saber', excerpt: 'Prepárate para la aventura de tu vida en los parques nacionales de Kenia y Tanzania.', content: 'Un safari en África es una experiencia que cambia la vida. Ver a los Big Five en su hábitat natural...', image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800', author: 'Alejandra Ruiz', category: 'Aventura', date: '2026-01-02', published: true, tags: ['safari', 'áfrica', 'aventura'] },
  { id: '6', title: 'Presupuesto de Viaje: Cómo Ahorrar sin Sacrificar Calidad', excerpt: 'Estrategias inteligentes para viajar más gastando menos.', content: 'Viajar no tiene que ser caro. Con planificación y estos tips puedes ahorrar significativamente...', image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800', author: 'Marco Delgado', category: 'Tips', date: '2025-12-28', published: true, tags: ['ahorro', 'presupuesto', 'tips'] },
];

const initialEmployees: Employee[] = [
  { id: '1', name: 'Alejandra Ruiz', role: 'Directora General', email: 'alejandra@voyagex.com', phone: '+52 555 100 0001', department: 'Dirección', commission: 5, active: true, avatar: '👩‍💼', hireDate: '2010-03-15', sales: 245 },
  { id: '2', name: 'Marco Delgado', role: 'Dir. de Operaciones', email: 'marco@voyagex.com', phone: '+52 555 100 0002', department: 'Operaciones', commission: 4, active: true, avatar: '👨‍💼', hireDate: '2012-06-20', sales: 189 },
  { id: '3', name: 'Sofía Mendoza', role: 'Jefa de Ventas', email: 'sofia@voyagex.com', phone: '+52 555 100 0003', department: 'Ventas', commission: 6, active: true, avatar: '👩‍💻', hireDate: '2015-01-10', sales: 312 },
  { id: '4', name: 'Ricardo Torres', role: 'Dir. de Marketing', email: 'ricardo@voyagex.com', phone: '+52 555 100 0004', department: 'Marketing', commission: 3, active: true, avatar: '👨‍💻', hireDate: '2018-09-01', sales: 98 },
  { id: '5', name: 'Valentina Cruz', role: 'Agente de Viajes Senior', email: 'valentina@voyagex.com', phone: '+52 555 100 0005', department: 'Ventas', commission: 7, active: true, avatar: '👩‍🦰', hireDate: '2016-04-12', sales: 278 },
  { id: '6', name: 'Andrés Morales', role: 'Agente de Viajes', email: 'andres@voyagex.com', phone: '+52 555 100 0006', department: 'Ventas', commission: 7, active: true, avatar: '👨‍🦱', hireDate: '2020-02-18', sales: 156 },
  { id: '7', name: 'Camila Vega', role: 'Contadora', email: 'camila@voyagex.com', phone: '+52 555 100 0007', department: 'Finanzas', commission: 2, active: true, avatar: '👩‍🦳', hireDate: '2019-07-22', sales: 0 },
  { id: '8', name: 'Fernando Ríos', role: 'Soporte al Cliente', email: 'fernando@voyagex.com', phone: '+52 555 100 0008', department: 'Atención', commission: 3, active: true, avatar: '🧑‍💼', hireDate: '2021-11-05', sales: 45 },
  { id: '9', name: 'Isabella Navarro', role: 'Coordinadora de Grupos', email: 'isabella@voyagex.com', phone: '+52 555 100 0009', department: 'Operaciones', commission: 5, active: true, avatar: '👩', hireDate: '2017-08-30', sales: 134 },
  { id: '10', name: 'Mateo Jiménez', role: 'Guía Turístico', email: 'mateo@voyagex.com', phone: '+52 555 100 0010', department: 'Operaciones', commission: 4, active: false, avatar: '🧔', hireDate: '2019-01-15', sales: 0 },
];

const initialMessages: CustomerMessage[] = [
  { id: '1', name: 'Lucía Ramírez', email: 'lucia@email.com', phone: '+52 555 222 3344', subject: 'Cotización viaje grupal', message: 'Hola, somos un grupo de 15 personas interesadas en ir a Cancún en julio. ¿Podrían enviarnos una cotización especial para grupos?', date: '2026-01-28', read: false, replied: false, priority: 'alta' },
  { id: '2', name: 'Jorge Herrera', email: 'jorge@email.com', phone: '+52 555 333 4455', subject: 'Cambio de fecha reserva', message: 'Necesito cambiar la fecha de mi reserva #3 del 1 de abril al 15 de abril. ¿Es posible?', date: '2026-01-27', read: true, replied: true, priority: 'media' },
  { id: '3', name: 'Patricia Gómez', email: 'patricia@email.com', phone: '+52 555 444 5566', subject: 'Información sobre visa', message: 'Quisiera saber si necesito visa para viajar a Japón con pasaporte mexicano. Gracias.', date: '2026-01-26', read: true, replied: true, priority: 'baja' },
  { id: '4', name: 'Miguel Ángel Soto', email: 'miguel@email.com', phone: '+52 555 555 6677', subject: 'Queja por servicio', message: 'Tuve un problema con el traslado en mi último viaje a París. El chofer llegó tarde y perdimos el tour. Quiero una compensación.', date: '2026-01-25', read: false, replied: false, priority: 'alta' },
  { id: '5', name: 'Elena Castillo', email: 'elena@email.com', phone: '+52 555 666 7788', subject: 'Pregunta sobre seguro', message: '¿El seguro de viaje cubre cancelaciones por enfermedad? Necesito saber antes de reservar.', date: '2026-01-24', read: true, replied: false, priority: 'media' },
  { id: '6', name: 'Raúl Domínguez', email: 'raul@email.com', phone: '+52 555 777 8899', subject: 'Viaje corporativo', message: 'Somos una empresa de 50 empleados y queremos organizar un viaje de integración. ¿Manejan viajes corporativos?', date: '2026-01-23', read: true, replied: true, priority: 'alta' },
];

const initialDepartures: Departure[] = [
  { id: '1', packageName: 'Cancún Todo Incluido 7 días', packageId: '1', date: '2026-02-15', spotsTotal: 30, spotsTaken: 22, status: 'abierta', guide: 'Mateo Jiménez', price: 1299 },
  { id: '2', packageName: 'París Romántico 5 días', packageId: '2', date: '2026-02-14', spotsTotal: 20, spotsTaken: 20, status: 'llena', guide: 'Valentina Cruz', price: 1899 },
  { id: '3', packageName: 'Machu Picchu Aventura 6 días', packageId: '4', date: '2026-03-10', spotsTotal: 15, spotsTaken: 8, status: 'abierta', guide: 'Andrés Morales', price: 1699 },
  { id: '4', packageName: 'Tokio Imperial 8 días', packageId: '3', date: '2026-03-20', spotsTotal: 12, spotsTaken: 5, status: 'abierta', guide: 'Isabella Navarro', price: 2499 },
  { id: '5', packageName: 'Safari Kenia 7 días', packageId: '8', date: '2026-04-05', spotsTotal: 10, spotsTaken: 3, status: 'abierta', guide: 'Mateo Jiménez', price: 3299 },
  { id: '6', packageName: 'Maldivas Lujo 5 días', packageId: '5', date: '2026-04-15', spotsTotal: 8, spotsTaken: 8, status: 'llena', guide: 'Valentina Cruz', price: 3999 },
  { id: '7', packageName: 'Bali Zen 10 días', packageId: '6', date: '2026-05-01', spotsTotal: 14, spotsTaken: 6, status: 'abierta', guide: 'Isabella Navarro', price: 1899 },
  { id: '8', packageName: 'Santorini Romance 6 días', packageId: '7', date: '2026-05-20', spotsTotal: 12, spotsTaken: 0, status: 'abierta', guide: 'Por asignar', price: 2199 },
];

const initialInvoices: Invoice[] = [
  { id: '1', bookingId: '1', clientName: 'Carlos García', amount: 2598, tax: 415.68, total: 3013.68, date: '2026-01-10', dueDate: '2026-01-25', status: 'pagada', method: 'tarjeta', folio: 'VX-2026-001' },
  { id: '2', bookingId: '2', clientName: 'María López', amount: 3798, tax: 607.68, total: 4405.68, date: '2026-01-05', dueDate: '2026-01-20', status: 'pagada', method: 'transferencia', folio: 'VX-2026-002' },
  { id: '3', bookingId: '3', clientName: 'Roberto Sánchez', amount: 7998, tax: 1279.68, total: 9277.68, date: '2026-01-20', dueDate: '2026-02-05', status: 'pendiente', method: 'tarjeta', folio: 'VX-2026-003' },
  { id: '4', bookingId: '4', clientName: 'Ana Martínez', amount: 6796, tax: 1087.36, total: 7883.36, date: '2026-01-15', dueDate: '2026-01-30', status: 'pendiente', method: 'transferencia', folio: 'VX-2026-004' },
  { id: '5', bookingId: '5', clientName: 'Pedro Fernández', amount: 2499, tax: 399.84, total: 2898.84, date: '2026-01-25', dueDate: '2026-02-10', status: 'pendiente', method: 'paypal', folio: 'VX-2026-005' },
];

// Context
interface StoreContextType {
  destinations: Destination[];
  packages: TravelPackage[];
  bookings: Booking[];
  clients: Client[];
  promotions: Promotion[];
  blogPosts: BlogPost[];
  employees: Employee[];
  messages: CustomerMessage[];
  departures: Departure[];
  invoices: Invoice[];
  settings: AgencySettings;
  isAdmin: boolean;
  selectedCurrency: string;
  setSelectedCurrency: (code: string) => void;
  formatPrice: (priceMXN: number) => string;
  convertPrice: (priceMXN: number) => number;
  getCurrentCurrency: () => Currency;
  setIsAdmin: (v: boolean) => void;
  busLayout: BusLayout;
  setBusLayout: (layout: BusLayout) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
  deleteBooking: (id: string) => void;
  addDestination: (dest: Destination) => void;
  updateDestination: (dest: Destination) => void;
  deleteDestination: (id: string) => void;
  addPackage: (pkg: TravelPackage) => void;
  updatePackage: (pkg: TravelPackage) => void;
  deletePackage: (id: string) => void;
  addPromotion: (p: Promotion) => void;
  updatePromotion: (p: Promotion) => void;
  deletePromotion: (id: string) => void;
  addBlogPost: (p: BlogPost) => void;
  updateBlogPost: (p: BlogPost) => void;
  deleteBlogPost: (id: string) => void;
  addEmployee: (e: Employee) => void;
  updateEmployee: (e: Employee) => void;
  deleteEmployee: (id: string) => void;
  updateMessage: (m: CustomerMessage) => void;
  deleteMessage: (id: string) => void;
  addDeparture: (d: Departure) => void;
  updateDeparture: (d: Departure) => void;
  deleteDeparture: (id: string) => void;
  addInvoice: (i: Invoice) => void;
  updateInvoice: (i: Invoice) => void;
  updateSettings: (settings: AgencySettings) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [destinations, setDestinations] = useState<Destination[]>(initialDestinations);
  const [packages, setPackages] = useState<TravelPackage[]>(initialPackages);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [clients] = useState<Client[]>(initialClients);
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [messages, setMessages] = useState<CustomerMessage[]>(initialMessages);
  const [departures, setDepartures] = useState<Departure[]>(initialDepartures);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [isAdmin, setIsAdmin] = useState(false);
  const [busLayout, setBusLayout] = useState<BusLayout>({ floors: 1, seatsPerFloor: 40 });
  const [settings, setSettings] = useState<AgencySettings>({
    name: 'VoyageX Travel Agency',
    email: 'info@voyagex.com',
    phone: '+52 555 800 9000',
    address: 'Av. Reforma 250, CDMX, México',
    currency: 'MXN',
    taxRate: 16,
    whatsapp: '+525558009000',
    facebook: 'https://facebook.com/voyagex',
    instagram: '@voyagex',
    twitter: '@voyagex',
  });
  // La moneda activa arranca con la configurada por el admin; cambiarla en cualquier vista la actualiza en todo el sitio
  const [selectedCurrency, setSelectedCurrency] = useState<string>(settings.currency);

  const getCurrentCurrency = (): Currency => {
    return currencies.find(c => c.code === selectedCurrency) || currencies[0];
  };

  const convertPrice = (priceMXN: number): number => {
    const currency = getCurrentCurrency();
    return Math.round(priceMXN * currency.rate);
  };

  const formatPrice = (priceMXN: number): string => {
    const currency = getCurrentCurrency();
    const converted = convertPrice(priceMXN);
    return `${currency.symbol}${converted.toLocaleString()}`;
  };

  const addBooking = (booking: Booking) => setBookings(prev => [...prev, booking]);
  const updateBooking = (booking: Booking) => setBookings(prev => prev.map(b => b.id === booking.id ? booking : b));
  const deleteBooking = (id: string) => setBookings(prev => prev.filter(b => b.id !== id));

  const addDestination = (dest: Destination) => setDestinations(prev => [...prev, dest]);
  const updateDestination = (dest: Destination) => setDestinations(prev => prev.map(d => d.id === dest.id ? dest : d));
  const deleteDestination = (id: string) => setDestinations(prev => prev.filter(d => d.id !== id));

  const addPackage = (pkg: TravelPackage) => setPackages(prev => [...prev, pkg]);
  const updatePackage = (pkg: TravelPackage) => setPackages(prev => prev.map(p => p.id === pkg.id ? pkg : p));
  const deletePackage = (id: string) => setPackages(prev => prev.filter(p => p.id !== id));

  const addPromotion = (p: Promotion) => setPromotions(prev => [...prev, p]);
  const updatePromotion = (p: Promotion) => setPromotions(prev => prev.map(x => x.id === p.id ? p : x));
  const deletePromotion = (id: string) => setPromotions(prev => prev.filter(x => x.id !== id));

  const addBlogPost = (p: BlogPost) => setBlogPosts(prev => [...prev, p]);
  const updateBlogPost = (p: BlogPost) => setBlogPosts(prev => prev.map(x => x.id === p.id ? p : x));
  const deleteBlogPost = (id: string) => setBlogPosts(prev => prev.filter(x => x.id !== id));

  const addEmployee = (e: Employee) => setEmployees(prev => [...prev, e]);
  const updateEmployee = (e: Employee) => setEmployees(prev => prev.map(x => x.id === e.id ? e : x));
  const deleteEmployee = (id: string) => setEmployees(prev => prev.filter(x => x.id !== id));

  const updateMessage = (m: CustomerMessage) => setMessages(prev => prev.map(x => x.id === m.id ? m : x));
  const deleteMessage = (id: string) => setMessages(prev => prev.filter(x => x.id !== id));

  const addDeparture = (d: Departure) => setDepartures(prev => [...prev, d]);
  const updateDeparture = (d: Departure) => setDepartures(prev => prev.map(x => x.id === d.id ? d : x));
  const deleteDeparture = (id: string) => setDepartures(prev => prev.filter(x => x.id !== id));

  const addInvoice = (i: Invoice) => setInvoices(prev => [...prev, i]);
  const updateInvoice = (i: Invoice) => setInvoices(prev => prev.map(x => x.id === i.id ? i : x));

  // Al guardar en el panel admin, la moneda elegida pasa a ser la moneda activa del sitio
  const updateSettings = (s: AgencySettings) => {
    setSettings(s);
    if (currencies.some(c => c.code === s.currency)) {
      setSelectedCurrency(s.currency);
    }
  };

  return (
    <StoreContext.Provider value={{
      destinations, packages, bookings, clients, promotions, blogPosts, employees, messages, departures, invoices, settings, isAdmin, selectedCurrency, setSelectedCurrency, formatPrice, convertPrice, getCurrentCurrency, setIsAdmin, busLayout, setBusLayout,
      addBooking, updateBooking, deleteBooking,
      addDestination, updateDestination, deleteDestination,
      addPackage, updatePackage, deletePackage,
      addPromotion, updatePromotion, deletePromotion,
      addBlogPost, updateBlogPost, deleteBlogPost,
      addEmployee, updateEmployee, deleteEmployee,
      updateMessage, deleteMessage,
      addDeparture, updateDeparture, deleteDeparture,
      addInvoice, updateInvoice,
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
