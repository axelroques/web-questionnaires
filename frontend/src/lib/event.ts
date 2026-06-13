
export interface BigFiveResponseEvent {
  t: number;
  q: number | null;
  v: number | null;
}

export interface D2ResponseEvent {
  t: number;
  line: number | null;
  pos: number | null;
  letter: string | null;
  upper: number | null;
  below: number | null;
  action: 'select' | 'unselect' | null;
}

export interface WAISResponseEvent {
  t: number;
  order: 'direct' | 'indirect' | null;
  item: number | null;
  essai: number | null;
  score: number | null;
}

export interface SAMResponseEvent {
  t: number;
  line: number | null;
  imagePos: number | null;
}

export interface NASATLXResponseEvent {
  t: number;
  subscale: string | null;
  score: number |null;
}

export interface ISAResponseEvent {
  t: number;
  idEval: number |null;
  score: number |null;
}