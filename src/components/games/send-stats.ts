import CheckJwt from '../authorization/chek-jwt';
import { apiStrings } from '../store/constants';
import { state } from '../store/state';
// import { IUserResult, IUserWord } from '../types/interfaces';

class SendStats {
  static async sendStats(responceBody: string): Promise<void> {
    if (state.userId !== '') {
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
        await response.json();
      } catch (e) {
        const err = e as Error;
        console.log(err.name);
      }
    }
    // SendStats.updateWordsStatus(responceBody);
  }

  // static async updateWordsStatus(responceBody: string) {
  //   const wordsResults = JSON.parse(responceBody);
  //   const statWords = wordsResults.results;
  //   const userId = state.userId;
  //   if (!userId) return;
  //   await CheckJwt.checkJwt();
  //   const userWords = await fetch(`${apiStrings.API_ADDRESS}${apiStrings.API_USERS}/${userId}${apiStrings.API_WORDS}`, {
  //     method: 'GET',
  //     headers: {
  //       Authorization: `Bearer ${state.token}`,
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //   });
  //   const data = await userWords.json();
  //   const words = data.words;
  //   const results = data.gameResults;
  //   for (const statWord of statWords) {
  //     const wordInResults = results.find((result: IUserResult) => result.wordId === statWord.wordId);
  //     const wordInWords = words.find((word: IUserWord) => word.wordId === statWord.wordId);
  //     if (wordInWords && wordInWords.difficulty === 'hard' && wordInResults.currResult > 4) {
  //       await SendStats.updateDifficulty(statWord.wordId, wordInResults, 'hard', 'PUT');
  //     } else if (wordInResults.currResult > 2 && !wordInWords) {
  //       await SendStats.updateDifficulty(statWord.wordId, wordInResults, 'studied', 'POST');
  //       state.statsData.dayStudiedWords += 1;
  //     } else if (wordInResults.currResult > 2 && wordInWords) {
  //       await SendStats.updateDifficulty(statWord.wordId, wordInResults, 'studied', 'PUT');
  //       state.statsData.dayStudiedWords += 1;
  //     } else if (wordInResults.totalAC === 1 || wordInResults.totalSprint === 1) {
  //       await SendStats.updateDifficulty(statWord.wordId, wordInResults, 'new', 'POST');
  //       if (wordInResults.totalAC === 1) {
  //         state.statsData.audioCallNewWords += 1;
  //       } else if (wordInResults.totalSprint === 1) {
  //         state.statsData.sprintNewWords += 1;
  //       }
  //     } else if (wordInResults.currResult < 1 && wordInWords) {
  //       await SendStats.updateDifficulty(statWord.wordId, wordInResults, 'easy', 'PUT');
  //     }
  //   }
  // }

  // static async updateDifficulty(wordId: string, wordInResults: IUserResult, difficulty: string, method: string) {
  //   await CheckJwt.checkJwt();
  //   const responseBody = {
  //     difficulty: difficulty,
  //     optional: wordInResults,
  //   };
  //   try {
  //     const response = await fetch(
  //       `${apiStrings.API_ADDRESS}${apiStrings.API_USERS}/${state.userId}${apiStrings.API_WORDS}/${wordId}`,
  //       {
  //         method: method,
  //         headers: {
  //           Authorization: `Bearer ${state.token}`,
  //           Accept: 'application/json',
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify(responseBody),
  //       }
  //     );
  //     await response.json();
  //   } catch (e) {
  //     const err = e as Error;
  //     console.log(err.name);
  //   }
  // }
}

export default SendStats;
