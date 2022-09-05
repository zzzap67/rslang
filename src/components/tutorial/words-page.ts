import BaseElement from '../base-element/base-element';
import Groups from './groups';
import Pages from './pages';

abstract class WordsPage {
  cardsContainer: HTMLElement;

  constructor() {
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    const cardsContainer = new BaseElement('div', ['cards-container']).element;
    this.cardsContainer = cardsContainer;
    const pagesContainer = new BaseElement('div', ['groups-pages-container']).element;
    mainContainer.innerHTML = '';
    pagesContainer.append(new Groups().groupsContainerElement, new Pages().pagesButtonsElement);
    mainContainer.append(pagesContainer, cardsContainer);
  }
}

export default WordsPage;
