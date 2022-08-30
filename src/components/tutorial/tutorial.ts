import './tutorial.scss';
import BaseElement from '../base-element/base-element';
import TutorialCard from './card';
import { apiStrings } from '../store/constants';
import { state } from '../store/state';
import { ICard, IUserWord } from '../types/interfaces';
import Groups from './groups';
import Pages from './pages';
import GamesLinks from './games-links';
import CheckJwt from '../authorization/chek-jwt';

class Tutorial {
  userWords: Array<IUserWord>;

  constructor() {
    //const body = document.body;
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    const cardsContainer = new BaseElement('div', ['cards-container']).element;
    const pagesContainer = new BaseElement('div', ['groups-pages-container']).element;
    //const groupsContainer = new BaseElement('div', ['groups-container']).element;
    this.userWords = [];
    mainContainer.innerHTML = '';
    console.log(state.group, state.page);
    pagesContainer.append(
      new Groups().groupsContainerElement,
      new Pages().pagesButtonsElement,
      new GamesLinks().linksElement
    );
    mainContainer.append(pagesContainer, cardsContainer);

    this.getUserWords().then(() => {
      console.log(this.userWords);
      this.renderTutorial(cardsContainer, state.group).then(() => {
        // HardWordsCheck.checkHardWords();
      });
    });
  }

  private async getUserWords(): Promise<void> {
    if (state.userId != '') {
      const userId = state.userId;
      await CheckJwt.checkJwt();
      // const token = localStorage.getItem('currentToken');
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
        data.forEach((item: IUserWord) => {
          this.userWords.push(item);
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
        // Сложное
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
        // Изученное
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
        data.forEach((item: ICard) => {
          cardsContainer.append(
            new TutorialCard(item, this.getHardType(item.id), this.getStudiedType(item.id)).cardElement
          );
        });
      } catch (err) {
        console.log('this is an error' + err);
      }
    } else {
      const userId = state.userId;
      const DIFFICULTY_HARD_API = '?filter={"userWord.difficulty":"hard"}&wordsPerPage=3600';
      await CheckJwt.checkJwt();
      //const token = localStorage.getItem('currentToken');
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
          cardsContainer.append(
            new TutorialCard(item, this.getHardType(item.id), this.getStudiedType(item.id)).cardElement
          );
        });
        return hardWords;
      } catch (e) {
        const err = e as Error;
        console.log(err.name);
      }
    }
  }
}

export default Tutorial;
