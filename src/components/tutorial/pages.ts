import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import { state } from '../store/state';
import Tutorial from './tutorial';

class Pages {
  pagesButtonsElement: HTMLElement;
  numberOfPages: number;

  constructor() {
    const pageButtonsContainer = new BaseElement('div', ['pages-container']).element;
    this.numberOfPages = 30;
    if (state.group != 7) {
      const firstButton = new Button('<<', ['page-btn']).buttonElement;
      firstButton.addEventListener('click', this.handlePageButton);
      pageButtonsContainer.append(firstButton);

      const prevButton = new Button('<', ['page-btn']).buttonElement;
      prevButton.addEventListener('click', this.handlePageButton);
      pageButtonsContainer.append(prevButton);

      let pageStart = state.page;
      if (state.page <= 2) {
        pageStart = 0;
      } else if (pageStart >= this.numberOfPages - 3) {
        pageStart = this.numberOfPages - 5;
      } else {
        pageStart = pageStart - 2;
      }

      for (let i = 1; i <= 5; i++) {
        let cssArray = [];
        if (pageStart + i === state.page + 1) {
          cssArray = ['page-btn', 'page-btn-middle', 'selected'];
        } else {
          cssArray = ['page-btn', 'page-btn-middle'];
        }
        const pageButton = new Button(`${pageStart + i}`, cssArray).buttonElement;
        pageButton.addEventListener('click', this.handlePageButton);
        pageButtonsContainer.append(pageButton);
      }

      const nextButton = new Button('>', ['page-btn']).buttonElement;
      nextButton.addEventListener('click', this.handlePageButton);
      pageButtonsContainer.append(nextButton);

      const lastButton = new Button('>>', ['page-btn']).buttonElement;
      lastButton.addEventListener('click', this.handlePageButton);
      pageButtonsContainer.append(lastButton);
    }

    this.pagesButtonsElement = pageButtonsContainer;
  }

  private handlePageButton(e: Event): void {
    const target = e.target as HTMLElement;
    if (target.textContent === '>') {
      state.page++;
    } else if (target.textContent === '<') {
      state.page--;
    } else if (target.textContent === '<<') {
      state.page = 0;
    } else if (target.textContent === '>>') {
      state.page = 29;
    } else {
      state.page = Number(target.textContent) - 1;
    }
    if (state.page < 0) {
      state.page = 0;
    }
    if (state.page > 29) {
      state.page = 29;
    }
    new Tutorial();
  }
}

export default Pages;
