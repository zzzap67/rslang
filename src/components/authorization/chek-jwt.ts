import { apiStrings, TOKEN_EXPIRATION_TIME } from '../store/constants';
import { state } from '../store/state';

class CheckJwt {
  static async checkJwt(): Promise<void> {
    if (!state.userId) return;
    const tokenExpireTime = Number(state.tokenExpireTime);
    const userId = state.userId;
    const refreshToken = state.refreshToken;
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
        state.refreshToken = data.refreshToken;
        state.token = data.token;
        const tokenExpireTime = Date.now() + TOKEN_EXPIRATION_TIME;
        state.tokenExpireTime = tokenExpireTime;
        localStorage.setItem('state', JSON.stringify(state));
      } catch (err) {
        console.log(err);
      }
    }
  }
}

export default CheckJwt;
