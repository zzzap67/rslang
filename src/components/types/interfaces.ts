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

export interface IState {
  [key: string]: number | string;
  token: string;
  group: number;
  page: number;
  userName: string;
  userId: string;
}
