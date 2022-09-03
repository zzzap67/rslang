import CheckJwt from '../authorization/chek-jwt';
import { apiStrings } from '../store/constants';
import { state } from '../store/state';

class SendStats {
  static async sendStats(responceBody: string): Promise<void> {
    if (state.userId != '') {
      const userId = state.userId;
      await CheckJwt.checkJwt();
      // const token = localStorage.getItem('currentToken');
      try {
        const response = await fetch(
          `${apiStrings.API_ADDRESS}${apiStrings.API_USERS}/${userId}${apiStrings.API_GAMERESULT}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${state.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: responceBody,
          }
        );
        const status = response.status;
        if (status === 401) {
          console.log('Take your token');
        }
        const data = await response.json();
        console.log(data);
      } catch (e) {
        const err = e as Error;
        console.log(err.name);
      }
    }
  }
}

export default SendStats;
