export type Dimension = 'usage' | 'range' | 'physical' | 'playmaking' | 'defense' | 'temperament';
export interface QuizOption { key: 'A'|'B'|'C'; text: string; score: 1|2|3; triggers?: 'keyboard-warrior'; }
export interface QuizQuestion { id:number; dimension:Dimension; prompt:string; hiddenTrigger?: boolean; options:QuizOption[]; }
export interface CharacterProfile {
  id: string;
  index: number;
  name: string;
  enName: string;
  vector: Record<Dimension, number>;
  style: string;
  personality: string;
}
