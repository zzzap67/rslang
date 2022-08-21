import { apiStrings } from '../store/constants';
import { hardWordsStore } from '../store/hard-words-store';
import { state } from '../store/state';
import { ICard } from '../types/interfaces';

class HardWordsCheck {
  static async checkHardWords(): Promise<void> {
    const cards = [...document.body.querySelectorAll('.card')] as HTMLElement[];
    const hardWords = await HardWordsCheck.getHardWords();
    console.log(hardWords);
    cards.forEach((card: HTMLElement) => {
      hardWords.forEach((hardWord) => {
        if (hardWord._id === card.dataset.wordId) {
          card.classList.add('hard-card-in-tutorial');
        }
      });
    });
  }

  static async getHardWords(): Promise<ICard[]> {
    const userId = state.userId;
    const token = state.token;
    const DIFFICULTY_HARD_API = '?filter={"userWord.difficulty":"hard"}';
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
    const data = await response.json();
    const hardWords = data[0].paginatedResults;
    hardWords.forEach((word: ICard) => {
      hardWordsStore.add(word);
    });
    return hardWords;
  }
}

export default HardWordsCheck;
