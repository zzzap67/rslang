import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import { state } from '../store/state';
import HardWordsCheck from './hard-words-check';
import HardWordsPage from './hard-words-page';
import Tutorial from './tutorial';

class Pages {
  pagesButtonsElement: HTMLElement;
  private pageBtnContent = `
    <div class="btn__part-left">
      <h2 class="btn__h2-left"></h2>
      <p class="btn__p-left"></p>
    </div>
    <div  class="btn__part-right">
      <h2 class="btn__h2-right"></h2>
    </div>
  `;

  private pageBtnHtml = function (): void {
    const NUMBER_OF_PAGES = 6;
    const h2Left = Array.from(document.querySelectorAll('.btn__h2-left'));
    const h2Right = Array.from(document.querySelectorAll('.btn__h2-right'));
    const p = Array.from(document.querySelectorAll('.btn__p-left'));

    for (let i = 0; i < NUMBER_OF_PAGES; i++) {
      if (i === 1) {
        h2Left[i].textContent = 'Легкий';
        h2Right[i].textContent = `A1`;
        p[i].textContent = '1-600';
      }
      if (i === 2) {
        h2Left[i].textContent = 'Легкий';
        h2Right[i].textContent = `A2`;
        p[i].textContent = '601-1200';
      }
      if (i === 3) {
        h2Left[i].textContent = 'Средний';
        h2Right[i].textContent = `B1`;
        p[i].textContent = '1201-1800';
      }
      if (i === 4) {
        h2Left[i].textContent = 'Средний';
        h2Right[i].textContent = `B2`;
        p[i].textContent = '1801-2400';
      }
      if (i === 5) {
        h2Left[i].textContent = 'Сложный';
        h2Right[i].textContent = `C1`;
        p[i].textContent = '2401-3000';
      }
      if (i === 6) {
        h2Left[i].textContent = 'Сложный';
        h2Right[i].textContent = `C2`;
        p[i].textContent = '3001-3600';
      }
    }
  };

  constructor() {
    const NUMBER_OF_PAGES = 6;
    const pageButtonsContainer = new BaseElement('div', ['pages-container']).element;
    for (let i = 1; i <= NUMBER_OF_PAGES; i++) {
      const pageButton = new Button(`${i}`, ['page-btn']).buttonElement;
      pageButton.innerHTML = this.pageBtnContent;
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
