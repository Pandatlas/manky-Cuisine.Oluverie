
import { OilProduct, OilCategory, MedalType } from './types';

export const OIL_DATA: OilProduct[] = [
  {
    id: 'olive-1',
    rank: 1,
    name: 'Castillo de Canena - Reserva Familiar',
    producer: 'Familia Vañó',
    origin: 'Espagne',
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
    origin: 'Grèce',
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
    origin: 'Italie',
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
    origin: 'Tunisie',
    score: 9.5,
    category: OilCategory.OLIVE,
    medal: MedalType.SILVER,
    description: 'Variété Chetoui offrant des notes de fruits secs et une finale poivrée remarquable.',
    image: 'https://images.unsplash.com/photo-1509112756314-34a0badb29d4?auto=format&fit=crop&q=80&w=800',
    stats: { smokePoint: 195, omega3: 0.9, acidity: 0.15 }
  },
  {
    id: 'olive-5',
    rank: 5,
    name: 'Oulmès Terroir d\'Exception',
    producer: 'Les Domaines Agricoles',
    origin: 'Maroc',
    score: 9.4,
    category: OilCategory.OLIVE,
    medal: MedalType.BRONZE,
    description: 'Huile d\'olive extra-vierge issue des contreforts du Moyen Atlas, douce et fruitée.',
    image: 'https://images.unsplash.com/photo-1464364109121-7f938f321946?auto=format&fit=crop&q=80&w=800',
    stats: { smokePoint: 185, omega3: 0.65, acidity: 0.25 }
  },
  {
    id: 'olive-6',
    rank: 6,
    name: 'Château d\'Estoublon - Bouteillan',
    producer: 'Château d\'Estoublon',
    origin: 'France',
    score: 9.3,
    category: OilCategory.OLIVE,
    medal: MedalType.BRONZE,
    description: 'Une huile délicate aux arômes de poire et de foin coupé, typique de la Provence.',
    image: 'https://images.unsplash.com/photo-1463183547458-6a2c760d0912?auto=format&fit=crop&q=80&w=800',
    stats: { smokePoint: 180, omega3: 0.5, acidity: 0.22 }
  },
  {
    id: 'olive-7',
    rank: 7,
    name: 'Nova Vera - Memecik',
    producer: 'Nova Vera',
    origin: 'Turquie',
    score: 9.2,
    category: OilCategory.OLIVE,
    medal: MedalType.NONE,
    description: 'Une huile turque primée pour sa richesse en polyphénols et son fruité vert intense.',
    image: 'https://images.unsplash.com/photo-1579294800821-694d95e86143?auto=format&fit=crop&q=80&w=800',
    stats: { smokePoint: 192, omega3: 0.72, acidity: 0.19 }
  },
  {
    id: 'olive-8',
    rank: 8,
    name: 'Huile H - Domaine Leos',
    producer: 'Patrick Bruel',
    origin: 'France',
    score: 9.1,
    category: OilCategory.OLIVE,
    medal: MedalType.NONE,
    description: 'Une huile de caractère, équilibrée avec des notes de thym et de romarin sauvage.',
    image: 'https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&q=80&w=800',
    stats: { smokePoint: 188, omega3: 0.55, acidity: 0.28 }
  }
];
