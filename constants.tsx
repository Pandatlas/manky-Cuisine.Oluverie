
import { OilProduct, OilCategory, MedalType } from './types';

export const OIL_DATA: OilProduct[] = [
  {
    id: 'olive-1',
    rank: 1,
    name: 'Castillo de Canena - Reserva Familiar',
    producer: 'Familia Vañó',
    origin: 'Espagne (Andalousie)',
    score: 9.9,
    category: OilCategory.OLIVE,
    medal: MedalType.GOLD,
    description: 'Une huile Picual d\'une intensité rare, aux notes d\'herbe fraîche et de tomate verte.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=800',
    stats: { smokePoint: 210, omega3: 0.8, acidity: 0.12 }
  },
  {
    id: 'olive-2',
    rank: 2,
    name: 'Terra Creta Grand Cru',
    producer: 'Terra Creta',
    origin: 'Grèce (Crète)',
    score: 9.7,
    category: OilCategory.OLIVE,
    medal: MedalType.GOLD,
    description: 'L\'expression pure du terroir de Kolymvari, équilibrée entre amertume et ardence.',
    image: 'https://images.unsplash.com/photo-1543073395-92600037a36e?auto=format&fit=crop&q=80&w=800',
    stats: { smokePoint: 190, omega3: 0.7, acidity: 0.18 }
  },
  {
    id: 'olive-3',
    rank: 3,
    name: 'Frantoio Franci Villa Magra',
    producer: 'Frantoio Franci',
    origin: 'Italie (Toscane)',
    score: 9.6,
    category: OilCategory.OLIVE,
    medal: MedalType.SILVER,
    description: 'Une huile puissante et élégante, pilier de la haute gastronomie toscane.',
    image: 'https://images.unsplash.com/photo-1590540179852-2110a54f813a?auto=format&fit=crop&q=80&w=800',
    stats: { smokePoint: 200, omega3: 0.6, acidity: 0.21 }
  },
  {
    id: 'olive-4',
    rank: 4,
    name: 'Triomphe de Thuccabor',
    producer: 'Domaine Ben Ismail',
    origin: 'Tunisie (Béja)',
    score: 9.5,
    category: OilCategory.OLIVE,
    medal: MedalType.SILVER,
    description: 'Variété Chetoui offrant des notes de fruits secs et une finale poivrée remarquable.',
    image: 'https://images.unsplash.com/photo-1509112756314-34a0badb29d4?auto=format&fit=crop&q=80&w=800',
    stats: { smokePoint: 195, omega3: 0.9, acidity: 0.15 }
  }
];
