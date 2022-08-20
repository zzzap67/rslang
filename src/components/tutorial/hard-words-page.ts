import BaseElement from '../base-element/base-element';
import { ICard } from '../types/interfaces';
import Groups from './groups';
import HardCard from './hard-card';
import Pages from './pages';

//TODO Unite this class with tutorial!
class HardWordsPage {
  constructor(difficultWords: ICard[]) {
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    const cardsContainer = new BaseElement('div', ['cards-container']).element;
    const pagesContainer = new BaseElement('div', ['groups-pages-container']).element;
    mainContainer.innerHTML = '';
    pagesContainer.append(new Groups().groupsContainerElement, new Pages().pagesButtonsElement);
    this.renderHardCards(cardsContainer, difficultWords);
    mainContainer.append(pagesContainer, cardsContainer);
  }

  private renderHardCards(container: HTMLElement, difficultWords: ICard[]): void {
    difficultWords.forEach((item: ICard) => {
      container.append(new HardCard(item).cardElement);
    });
  }
}

export default HardWordsPage;
