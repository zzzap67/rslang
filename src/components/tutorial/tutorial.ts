import './tutorial.scss';
import BaseElement from '../base-element/base-element';
import TutorialCard from './card';
import { apiStrings, LEVEL_COLORS } from '../store/constants';
import { state } from '../store/state';
import { ICard, IUserWord, IUserResult } from '../types/interfaces';
import Groups from './groups';
import Pages from './pages';
import GamesLinks from './games-links';
import CheckJwt from '../authorization/chek-jwt';

class Tutorial {
  userWords: Array<IUserWord>;
  userResults: Array<IUserResult>;

  constructor() {
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    const tutorialWrapper = new BaseElement('div', ['tutorial__wrapper']).element;
    const cardsContainer = new BaseElement('div', ['cards-container']).element;
    const pagesContainer = new BaseElement('div', ['groups-pages-container']).element;
    const groupsContainer = new BaseElement('div', ['groups-links-container']).element;
    this.userWords = [];
    this.userResults = [];
    mainContainer.style.minHeight = '100vh';
    mainContainer.style.backgroundSize = '100%';
    mainContainer.innerHTML = '';
    groupsContainer.append(new Groups().groupsContainerElement, new GamesLinks().linksElement);
    pagesContainer.append(groupsContainer, new Pages().pagesButtonsElement);
    tutorialWrapper.append(pagesContainer, cardsContainer);
    mainContainer.append(tutorialWrapper);
    document.body.style.backgroundImage = 'url("./img/bg-beige.png")';
    document.body.style.backgroundSize = '100%';

    this.getUserWords().then(() => {
      this.renderTutorial(cardsContainer, state.group);
    });
  }

  private async getUserWords(): Promise<void> {
    if (state.userId != '') {
      const userId = state.userId;
      await CheckJwt.checkJwt();
      try {
        const response = await fetch(
          `${apiStrings.API_ADDRESS}${apiStrings.API_USERS}/${userId}${apiStrings.API_WORDS}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${state.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );
        const status = response.status;
        if (status === 401) {
          console.log('Take your token');
        }
        const data = await response.json();
        data.words.forEach((item: IUserWord) => {
          this.userWords.push(item);
        });
        data.gameResults.forEach((item: IUserResult) => {
          this.userResults.push(item);
        });
      } catch (e) {
        const err = e as Error;
        console.log(err.name);
      }
    }
  }

  private getHardType(id: string): number {
    let itemType = -1;
    if (state.userId != '') {
      if (
        this.userWords.filter((uWItem: IUserWord) => uWItem.difficulty === 'hard' && uWItem.wordId === id).length > 0
      ) {
        // ??????????????
        itemType = 1;
      } else {
        itemType = 0;
      }
    }

    return itemType;
  }

  private getStudiedType(id: string): number {
    let itemType = -1;
    if (state.userId != '') {
      if (
        this.userWords.filter((uWItem: IUserWord) => uWItem.difficulty === 'studied' && uWItem.wordId === id).length > 0
      ) {
        // ??????????????????
        itemType = 1;
      } else {
        itemType = 0;
      }
    }

    return itemType;
  }

  private getNewType(id: string): number {
    let itemType = -1;
    if (state.userId) {
      if (
        this.userWords.filter((uWItem: IUserWord) => uWItem.difficulty === 'new' && uWItem.wordId === id).length > 0
      ) {
        // ??????????
        itemType = 1;
      } else {
        itemType = 0;
      }
    }

    return itemType;
  }

  private async renderTutorial(cardsContainer: HTMLElement, groupNumber: number): Promise<void> {
    if (groupNumber < 6) {
      try {
        const response = await fetch(
          `${apiStrings.API_ADDRESS}${apiStrings.API_WORDS}?page=${state.page}&group=${state.group}`
        );
        const data = await response.json();
        let studiedCount = 0;
        data.forEach((item: ICard) => {
          const studiedType = this.getStudiedType(item.id);
          studiedCount += studiedType;
          let gameTotal = 0;
          let gameRight = 0;
          this.userResults
            .filter((itemResult) => itemResult.wordId === item.id)
            .forEach((elem) => {
              gameRight += elem.rightAC + elem.rightSprint;
              gameTotal += elem.totalAC + elem.totalSprint;
            });
          cardsContainer.append(
            new TutorialCard(
              item,
              this.getHardType(item.id),
              studiedType,
              this.getNewType(item.id),
              gameRight,
              gameTotal
            ).cardElement
          );
        });

        if (studiedCount === 20) {
          const pageNumber = document.body.querySelector('.pages__btn-selected') as HTMLElement;
          pageNumber.classList.add('pages__btn-selected-studied');
          const gameButton1 = document.body.querySelector('.tutorial-games-link-1') as HTMLButtonElement;
          gameButton1.disabled = true;
          const gameButton2 = document.body.querySelector('.tutorial-games-link-2') as HTMLButtonElement;
          gameButton2.disabled = true;
        }
      } catch (err) {
        console.log('this is an error' + err);
      }
    } else {
      const userId = state.userId;
      const DIFFICULTY_HARD_API = '?filter={"userWord.difficulty":"hard"}&wordsPerPage=3600';
      await CheckJwt.checkJwt();
      try {
        const response = await fetch(
          `${apiStrings.API_ADDRESS}${apiStrings.API_USERS}/${userId}${apiStrings.API_AGGREGATED_WORDS}${DIFFICULTY_HARD_API}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${state.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );
        const status = response.status;
        if (status === 401) {
          console.log('Take your token');
        }
        const data = await response.json();
        const hardWords = data[0].paginatedResults;
        hardWords.forEach((item: ICard) => {
          item.id = String(item['_id']);
          let gameTotal = 0;
          let gameRight = 0;
          this.userResults
            .filter((itemResult) => itemResult.wordId === item.id)
            .forEach((elem) => {
              gameRight += elem.rightAC + elem.rightSprint;
              gameTotal += elem.totalAC + elem.totalSprint;
            });
          cardsContainer.append(
            new TutorialCard(
              item,
              this.getHardType(item.id),
              this.getStudiedType(item.id),
              this.getNewType(item.id),
              gameRight,
              gameTotal
            ).cardElement
          );
        });
        return hardWords;
      } catch (e) {
        const err = e as Error;
        console.log(err.name);
      }
    }
  }

  public setLabel(id: number) {
    const cardLabel = document.querySelector('card__label') as HTMLElement;
    cardLabel.style.borderColor = LEVEL_COLORS[id];
  }
}

export default Tutorial;
