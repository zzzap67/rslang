import { IState } from '../types/interfaces';

export const state: IState = {
  token: '',
  refreshToken: '',
  tokenExpireTime: 0,
  group: 0,
  page: 0,
  userName: '',
  userId: '',
  sprintAudio: true,
  currentPage: 'main',
  todayDate: '',
  statsData: {
    sprintNewWords: 0,
    sprintPercentage: 0,
    sprintLongestSerie: 0,
    audioCallNewWords: 0,
    audioCallPercentage: 0,
    audioCallLongestSerie: 0,
    dayStudiedWords: 0,
  },
};
