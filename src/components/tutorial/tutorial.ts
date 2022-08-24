import BaseElement from '../base-element/base-element';
import TutorialCard from './card';
import { apiStrings } from '../store/constants';
import { state } from '../store/state';
import { ICard } from '../types/interfaces';
import Groups from './groups';
import Pages from './pages';
import HardWordsCheck from './hard-words-check';
import './tutorial.css';

class Tutorial {
  constructor() {
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    const cardsContainer = new BaseElement('div', ['cards-container']).element;
    const pagesContainer = new BaseElement('div', ['groups-pages-container']).element;
    mainContainer.innerHTML = '';
    console.log(state.group, state.page);
    pagesContainer.append(new Groups().groupsContainerElement, new Pages().pagesButtonsElement);
    mainContainer.append(pagesContainer, cardsContainer);

    if (state.group <= 6) {
      this.renderTutorial(cardsContainer).then(() => {
        HardWordsCheck.checkHardWords();
      });
    } else {
      new Groups().handleHardWordsStart();
    }
  }

  private async renderTutorial(cardsContainer: HTMLElement): Promise<void> {
    try {
      const response = await fetch(
        `${apiStrings.API_ADDRESS}${apiStrings.API_WORDS}?page=${state.page}&group=${state.group}`
      );
      const data = await response.json();
      data.forEach((item: ICard) => {
        cardsContainer.append(new TutorialCard(item).cardElement);
      });
    } catch (err) {
      console.log('this is an error' + err);
    }
  }
}

export default Tutorial;
