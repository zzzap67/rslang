export interface ICard {
  [key: string]: number | string;
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  textExampleTranslate: string;
  textMeaningTranslate: string;
  wordTranslate: string;
}

export type ICards = Array<ICard>;

export interface IAudioCallCard {
  id: string;
  word: string;
  image: string;
  audio: string;
  wordTranslate: string;
}

export interface IAudioCallAnswers {
  wordTranslate: string;
  correct: boolean;
}

export interface IState {
  [key: string]: number | string;
  token: string;
  group: number;
  page: number;
  userName: string;
  userId: string;
}

export interface IUserWord {
  id: string;
  difficulty: string;
  wordId: string;
}
