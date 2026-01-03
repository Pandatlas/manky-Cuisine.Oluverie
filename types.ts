
export enum OilCategory {
  ALL = 'Toutes les catégories',
  OLIVE = 'Olive',
  ARGAN = 'Argan',
  SUNFLOWER = 'Tournesol',
  COLZA = 'Colza',
  SESAME = 'Sésame',
  AVOCADO = 'Avocat'
}

export enum MedalType {
  GOLD = 'Or (Best in Class)',
  SILVER = 'Argent',
  BRONZE = 'Bronze',
  NONE = 'Certifié'
}

export interface OilProduct {
  id: string;
  rank: number;
  name: string;
  producer: string;
  origin: string;
  score: number;
  category: OilCategory;
  medal: MedalType;
  description: string;
  image: string;
  stats: {
    smokePoint: number;
    omega3: number;
    acidity: number;
  };
}

export interface AIRecipe {
  dishName: string;
  country: string;
  ingredients: string[];
  instructions: string[];
  history: string;
}

export interface AIAnalysis {
  sommelierNote: string;
  recipe: AIRecipe;
}
