export const apiStrings = {
  API_ADDRESS: 'https://react-rslang-be-team141.herokuapp.com',
  API_USERS: '/users',
  API_SIGN_IN: '/signin',
  API_WORDS: '/words',
  API_GAMERESULT: '/gameResult',
  API_AGGREGATED_WORDS: '/aggregatedWords',
  API_TOKENS: '/tokens',
};

export const TOKEN_EXPIRATION_TIME = 4 * 60 * 60 * 1000; // 4 hours

export const HEADER_NAV_ITEMS = [
  {
    name: 'ГЛАВНАЯ',
    role: 'main',
  },
  {
    name: 'УЧЕБНИК',
    role: 'tutorial',
  },
  {
    name: 'ИГРЫ',
    role: 'games',
  },
  {
    name: 'СТАТИСТИКА',
    role: 'statistics',
  },
];

export const EMAIL_REGEXP = '[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$';

export const LEVEL_COLORS = [
  'rgb(165, 214, 167)',
  'rgb(129, 212, 250)',
  'rgb(159, 168, 218)',
  'rgb(188, 170, 164)',
  'rgb(255, 204, 128)',
  'rgb(239, 154, 154)',
  '#df605b',
];
