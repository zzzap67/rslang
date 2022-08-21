import { ICard } from '../types/interfaces';
import HardCard from './hard-card';
import WordsPage from './words-page';

class HardWordsPage extends WordsPage {
  constructor(difficultWords: ICard[]) {
    super();
    this.renderHardWords(this.cardsContainer, difficultWords);
  }

  private renderHardWords(cardsContainer: HTMLElement, difficultWords: ICard[]): void {
    difficultWords.forEach((item: ICard) => {
      cardsContainer.append(new HardCard(item).cardElement);
    });
  }
}

export default HardWordsPage;
