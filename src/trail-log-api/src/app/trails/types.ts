export const difficultyLevels = ['easy', 'moderate', 'hard', 'extreme'] as const;

export type DifficultyLevel = (typeof difficultyLevels)[number];
export interface Trail {
  id: string;
  name: string;
  miles: number;
  difficulty: DifficultyLevel;
}

export type TrailCreate = Omit<Trail, 'id'>;

// export interface TrailModel extends Trail {
//   favorite: boolean;
// }

export type TrailModel = Trail & {
  favorite: boolean;
};

/*
GET /trails

GET /extreme-trails

POST http://localhost:3000/hard-trails
Content-Type: application/json

{
  "name": "Bright Angel",
  "miles": 13.8,

}

*/
