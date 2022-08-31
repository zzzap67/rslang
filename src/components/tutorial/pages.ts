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
          cssArray = ['page-btn', 'page-btn-middle', 'pages__btn-selected'];
          firstButton.classList.add('page__btn-disabled');
          prevButton.classList.add('page__btn-disabled');
        } else if (pageStart + i === state.page + 1 && pageStart + i === 30) {
          cssArray = ['page-btn', 'page-btn-middle', 'pages__btn-selected'];
          lastButton.classList.add('page__btn-disabled');
          nextButton.classList.add('page__btn-disabled');
        } else if (pageStart + i === state.page + 1) {
          cssArray = ['page-btn', 'page-btn-middle', 'pages__btn-selected'];
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
    let newPage = state.page;

    if (target.textContent === '>') {
      newPage++;
    } else if (target.textContent === '<') {
      newPage--;
    } else if (target.textContent === '<<') {
      newPage = 0;
    } else if (target.textContent === '>>') {
      newPage = 29;
    } else {
      newPage = Number(target.textContent) - 1;
    }
    if (newPage < 0) {
      newPage = 0;
    }
    if (newPage > 29) {
      newPage = 29;
    }
    if (newPage !== state.page) {
      state.page = newPage;
      new Tutorial();
    }
  }
}

export default Pages;
