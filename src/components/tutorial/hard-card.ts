import { ICard } from '../types/interfaces';
import TutorialCard from './card';

class HardCard extends TutorialCard {
  constructor(card: ICard) {
    super(card);
    this.difficultButton.textContent = 'Не сложное';
  }
}

export default HardCard;
