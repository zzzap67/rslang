import CheckJwt from '../authorization/chek-jwt';
import { apiStrings } from '../store/constants';
import { state } from '../store/state';
import { ICard } from '../types/interfaces';
import TutorialCard from './card';
//import Pages from './pages';

class HardCard extends TutorialCard {
  card: ICard;
  constructor(card: ICard) {
    super(card);
    this.card = card;
    this.difficultButton.textContent = 'Не сложное';
  }

  async handleDifficultButton() {
    const wordId = this.card._id;
    console.log(wordId);
    const userId = state.userId;
    const responseBody = {
      difficulty: 'easy',
      optional: {},
    };
    CheckJwt.checkJwt();
    const token = state.token;
    const response = await fetch(
      `${apiStrings.API_ADDRESS}${apiStrings.API_USERS}/${userId}${apiStrings.API_WORDS}/${wordId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseBody),
      }
    );
    await response.json();
    Pages.handleHardWords();
  }
}

export default HardCard;
