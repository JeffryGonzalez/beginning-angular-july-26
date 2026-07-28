export interface Trail {
  name: string;
  miles: number;
  difficulty: 'easy' | 'moderate' | 'hard' | 'extreme';
  favorite: boolean;
}
