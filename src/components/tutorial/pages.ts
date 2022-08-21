import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import { state } from '../store/state';
import HardWordsCheck from './hard-words-check';
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
      const difficultWordsButton = new Button('Сложные слова', ['pages-hard-btn']).buttonElement;
      difficultWordsButton.addEventListener('click', this.handleHardWords);
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

  private async handleHardWords(): Promise<void> {
    const hardWords = await HardWordsCheck.getHardWords();
    new HardWordsPage(hardWords);
  }
}

export default Pages;
