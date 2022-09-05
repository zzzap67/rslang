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

export interface ISprintAnswer {
  englishWord: string;
  russianWord: string;
  wordId: string;
}

export interface IState {
  [key: string]: number | string | boolean | IStatsData;
  token: string;
  refreshToken: string;
  group: number;
  page: number;
  tokenExpireTime: number;
  userName: string;
  userId: string;
  sprintAudio: boolean;
  currentPage: string;
  todayDate: string;
  statsData: IStatsData;
}

export interface IUserWord {
  id: string;
  difficulty: string;
  wordId: string;
}

export interface IUserStat {
  id: string;
  rightAC: number;
  totalAC: number;
  rightSprint: number;
  totalSprint: number;
  newWordAC: number;
  newWordSprint: number;
  studiedWord: number;
  seriesAC: number;
  seriesSprint: number;
  dates: string;
  userId: string;
}

export interface IUserResult {
  id: string;
  wordId: string;
  rightAC: number;
  totalAC: number;
  rightSprint: number;
  totalSprint: number;
  currResult: number;
}

export interface IStatsData {
  [key: string]: number;
  sprintNewWords: number;
  sprintPercentage: number;
  sprintLongestSerie: number;
  audioCallNewWords: number;
  audioCallPercentage: number;
  audioCallLongestSerie: number;
  dayStudiedWords: number;
}

export interface IStatsResults {
  [key: string]: number | string;
  wordId: string;
  result: number;
}
