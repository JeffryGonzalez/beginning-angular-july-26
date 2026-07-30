export interface Trail {
  id: string;
  name: string;
  miles: number;
  difficulty: 'easy' | 'moderate' | 'hard' | 'extreme';
}

// export interface TrailModel extends Trail {
//   favorite: boolean;
// }

export type TrailModel = Trail & {
  favorite: boolean;
};
