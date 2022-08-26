import { apiStrings, TOKEN_EXPIRATION_TIME } from '../store/constants';
import { state } from '../store/state';

class CheckJwt {
  static async checkJwt(): Promise<void> {
    const tokenExpireTime = Number(localStorage.getItem('tokenExpireTime'));
    const userId = state.userId;
    const refreshToken = localStorage.getItem('refreshToken');
    if (Date.now() >= tokenExpireTime) {
      try {
        const response = await fetch(
          `${apiStrings.API_ADDRESS}${apiStrings.API_USERS}/${userId}${apiStrings.API_TOKENS}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        const data = await response.json();
        const tokenExpireTime = Date.now() + TOKEN_EXPIRATION_TIME;
        localStorage.setItem('tokenExpireTime', tokenExpireTime.toString());
        localStorage.setItem('currentToken', data.token);
        localStorage.setItem('refreshToken', data.refreshToken);
      } catch (err) {
        console.log(err);
      }
    }
  }
}

export default CheckJwt;
