import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import { apiStrings } from '../constants/constants';
import { state } from '../store/state';
import HardWordsPage from './hard-words-page';
import Tutorial from './tutorial';

class Pages {
  pagesButtonsElement: HTMLElement;
  constructor() {
    const NUMBER_OF_PAGES = 6;
    const pageButtonsContainer = new BaseElement('div', ['pages-container']).element;
    for (let i = 1; i <= NUMBER_OF_PAGES; i++) {
      const pageButton = new Button(`${i}`, ['page-btn']).buttonElement;
      pageButton.addEventListener('click', this.handlePageButton);
      pageButtonsContainer.append(pageButton);
    }
    if (state.userName) {
      const difficultWordsButton = new Button('Сложные слова', ['pages-difficult-btn']).buttonElement;
      difficultWordsButton.addEventListener('click', this.handleDifficultWords);
      pageButtonsContainer.append(difficultWordsButton);
    }

    this.pagesButtonsElement = pageButtonsContainer;
  }

  private handlePageButton(e: Event): void {
    const target = e.target as HTMLElement;
    const pageNumber = Number(target.textContent) - 1;
    state.page = pageNumber;
    new Tutorial();
  }

  private async handleDifficultWords(): Promise<void> {
    const userId = state.userId;
    const token = state.token;
    const DIFFICULTY_HARD_API = '?filter={"userWord.difficulty":"hard"}';
    const response = await fetch(
      //TODO move aggrWords to constants
      `${apiStrings.API_ADDRESS}${apiStrings.API_USERS}/${userId}/aggregatedWords${DIFFICULTY_HARD_API}`,
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
    const difficultWords = data[0].paginatedResults;
    new HardWordsPage(difficultWords);
  }
}

export default Pages;
