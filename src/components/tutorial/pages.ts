import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import { state } from '../store/state';
import Tutorial from './tutorial';

class Pages {
  pagesButtonsElement: HTMLElement;
  constructor() {
    const NUMBER_OF_PAGES = 6;
    const pageButtonsContainer = new BaseElement('div', ['pages-container']).element;
    for (let i = 0; i <= NUMBER_OF_PAGES; i++) {
      const pageButton = new Button(`${i}`, ['page-btn']).buttonElement;
      pageButton.addEventListener('click', this.handlePageButton);
      pageButtonsContainer.append(pageButton);
    }
    this.pagesButtonsElement = pageButtonsContainer;
  }

  private handlePageButton(e: Event): void {
    const target = e.target as HTMLElement;
    const pageNumber = Number(target.textContent);
    state.page = pageNumber;
    new Tutorial();
  }
}

export default Pages;
