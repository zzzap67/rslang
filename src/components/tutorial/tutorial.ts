import './tutorial.scss';
import BaseElement from '../base-element/base-element';
import TutorialCard from './card';
import { apiStrings } from '../store/constants';
import { state } from '../store/state';
import { ICard } from '../types/interfaces';
import Groups from './groups';
import Pages from './pages';
import HardWordsCheck from './hard-words-check';

class Tutorial {
  constructor() {
    //const body = document.body;
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    const cardsContainer = new BaseElement('div', ['cards-container']).element;
    const pagesContainer = new BaseElement('div', ['groups-pages-container']).element;
    const groupsContainer = new BaseElement('div', ['groups-container']).element;
    mainContainer.innerHTML = '';
    //body.style.backgroundImage = 'url(../../assets/images/bg-blue.png)';
    groupsContainer.append(new Groups().groupsContainerElement);
    pagesContainer.append(new Pages().pagesButtonsElement);
    this.renderTutorial(cardsContainer).then(() => {
      HardWordsCheck.checkHardWords();
    });
    mainContainer.append(pagesContainer, cardsContainer, groupsContainer);
  }

  private async renderTutorial(cardsContainer: HTMLElement): Promise<void> {
    const response = await fetch(
      `${apiStrings.API_ADDRESS}${apiStrings.API_WORDS}?page=${state.page}&group=${state.group}`
    );
    const data = await response.json();
    data.forEach((item: ICard) => {
      cardsContainer.append(new TutorialCard(item).cardElement);
    });
  }
}

export default Tutorial;
