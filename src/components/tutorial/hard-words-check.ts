import CheckJwt from '../authorization/chek-jwt';
import { apiStrings } from '../store/constants';
import { hardWordsStore } from '../store/hard-words-store';
import { state } from '../store/state';
import { ICard } from '../types/interfaces';

class HardWordsCheck {
  static async checkHardWords(): Promise<void> {
    const cards = [...document.body.querySelectorAll('.card')] as HTMLElement[];
    const hardWords = await HardWordsCheck.getHardWords();
    if (!hardWords) return;
    cards.forEach((card: HTMLElement) => {
      hardWords.forEach((hardWord: ICard) => {
        if (hardWord._id === card.dataset.wordId) {
          card.classList.add('hard-card-in-tutorial');
        }
      });
    });
  }

  static async getHardWords(): Promise<void | ICard[]> {
    const userId = state.userId;
    const DIFFICULTY_HARD_API = '?filter={"userWord.difficulty":"hard"}';
    CheckJwt.checkJwt();
    const token = state.token;
    try {
      const response = await fetch(
        `${apiStrings.API_ADDRESS}${apiStrings.API_USERS}/${userId}${apiStrings.API_AGGREGATED_WORDS}${DIFFICULTY_HARD_API}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      const status = response.status;
      if (status === 401) {
        console.log('Take your token');
      }
      const data = await response.json();
      const hardWords = data[0].paginatedResults;
      hardWords.forEach((word: ICard) => {
        hardWordsStore.add(word);
      });
      return hardWords;
    } catch (e) {
      const err = e as Error;
      console.log(err.name);
    }
  }
}

export default HardWordsCheck;
