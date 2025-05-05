export interface AdvancePolicyModel {
  firstheading: string;
  questions: string;
  className: string;
  selectAnswer: string;
  bottomDesc:string,
  Ans: Answer[];
}

export interface Answer {
  a1?: string;
  a2: string;
  a3: string;
  a4: string;
  a5: string;
}
