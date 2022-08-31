import './pages.scss';
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
    if (state.group != 6) {
      const firstButton = new Button('<<', ['page-btn', 'first-btn']).buttonElement;
      firstButton.addEventListener('click', this.handlePageButton);
      pageButtonsContainer.append(firstButton);

      const prevButton = new Button('<', ['page-btn', 'page__arrow-left']).buttonElement;
      prevButton.addEventListener('click', this.handlePageButton);
      pageButtonsContainer.append(prevButton);

      const nextButton = new Button('>', ['page-btn', 'page__arrow-right']).buttonElement;

      const lastButton = new Button('>>', ['page-btn', 'last-btn']).buttonElement;

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
        if (pageStart + i === state.page + 1 && pageStart + i === 1) {
          cssArray = ['page-btn', 'page-btn-middle', 'selected'];
          firstButton.classList.add('page__btn-disabled');
          prevButton.classList.add('page__btn-disabled');
        } else if (pageStart + i === state.page + 1 && pageStart + i === 30) {
          cssArray = ['page-btn', 'page-btn-middle', 'selected'];
          lastButton.classList.add('page__btn-disabled');
          nextButton.classList.add('page__btn-disabled');
        } else if (pageStart + i === state.page + 1) {
          cssArray = ['page-btn', 'page-btn-middle', 'selected'];
        } else {
          cssArray = ['page-btn', 'page-btn-middle'];
        }
        const pageButton = new Button(`${pageStart + i}`, cssArray).buttonElement;
        pageButton.addEventListener('click', this.handlePageButton);
        pageButtonsContainer.append(pageButton);
      }

      nextButton.addEventListener('click', this.handlePageButton);
      pageButtonsContainer.append(nextButton);

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
