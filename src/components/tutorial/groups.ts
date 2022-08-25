import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import { state } from '../store/state';
import HardWordsCheck from './hard-words-check';
import HardWordsPage from './hard-words-page';
import Tutorial from './tutorial';

class Groups {
  groupsContainerElement: HTMLElement;

  constructor() {
    const groupsContainer = new BaseElement('div', ['groups-container']).element;
    const NUMBER_OF_GROUPS = 6;

    for (let i = 1; i <= NUMBER_OF_GROUPS; i++) {
      let cssArray = [];
      if (i === state.group + 1) {
        cssArray = ['group-btn', 'selected'];
      } else {
        cssArray = ['group-btn'];
      }
      const groupButton = new Button(`${i}`, cssArray).buttonElement;
      groupButton.addEventListener('click', this.handleGroupButtons);
      groupsContainer.append(groupButton);
    }
    if (state.userName) {
      let cssArray = [];
      if (state.group === 7) {
        cssArray = ['group-hard-btn', 'selected'];
      } else {
        cssArray = ['group-hard-btn'];
      }
      const difficultWordsGroup = new Button('Сложные слова', cssArray).buttonElement;
      difficultWordsGroup.addEventListener('click', this.handleHardWords);
      groupsContainer.append(difficultWordsGroup);
    }

    this.groupsContainerElement = groupsContainer;
  }

  async handleHardWords(): Promise<void> {
    if (state.group != 7) {
      const hardWords = await HardWordsCheck.getHardWords();
      if (!hardWords) return;
      state.page = 0;
      state.group = 7;
      if (!hardWords) {
        return;
      }
      new HardWordsPage(hardWords);
    }
  }

  async handleHardWordsStart(): Promise<void> {
    const hardWords = await HardWordsCheck.getHardWords();
    if (!hardWords) return;
    new HardWordsPage(hardWords);
  }

  private handleGroupButtons(e: Event): void {
    const target = e.target as HTMLElement;
    const groupNumber = Number(target.textContent) - 1;
    if (state.group != groupNumber) {
      state.group = groupNumber;
      state.page = 0;
      new Tutorial();
    }
  }
}

export default Groups;
