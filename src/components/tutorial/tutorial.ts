import BaseElement from '../base-element/base-element';
import TutorialCard from './card';
import { apiStrings } from '../constants/constants';
import { state } from '../store/state';
import { ICard } from '../types/interfaces';
import Groups from './groups';
import Pages from './pages';

class Tutorial {
  constructor() {
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    const cardsContainer = new BaseElement('div', ['cards-container']).element;
    const pagesContainer = new BaseElement('div', ['groups-pages-container']).element;
    mainContainer.innerHTML = '';
    pagesContainer.append(new Groups().groupsContainerElement, new Pages().pagesButtonsElement);
    this.renderTutorial(cardsContainer);
    mainContainer.append(pagesContainer, cardsContainer);
  }

  public async renderTutorial(container: HTMLElement): Promise<void> {
    const response = await fetch(
      `${apiStrings.API_ADDRESS}${apiStrings.API_WORDS}?page=${state.page}&group=${state.group}`
    );
    const data = await response.json();
    data.forEach((item: ICard) => {
      container.append(new TutorialCard(item).cardElement);
    });
  }
}

export default Tutorial;
