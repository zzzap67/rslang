import './groups.scss';
import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import { state } from '../store/state';
import Tutorial from './tutorial';
import { LEVEL_COLORS } from '../store/constants';

class Groups {
  groupsContainerElement: HTMLElement;

  constructor() {
    const groupsContainer = new BaseElement('div', ['groups-container']).element;
    const groupBtnsContainer = new BaseElement('div', ['group__btns-container']).element;
    const groupLabel = new BaseElement('h3', ['group__p-level']).element;
    groupLabel.textContent = 'Выбери уровень: ';
    const NUMBER_OF_GROUPS = 6;

    for (let i = 1; i <= NUMBER_OF_GROUPS; i++) {
      let cssArray = [];
      if (i === state.group + 1) {
        cssArray = ['group-btn', 'group__selected'];
      } else {
        cssArray = ['group-btn'];
      }
      const groupButton = new Button(`${i}`, cssArray).buttonElement;
      groupButton.id = 'group-button-' + i;
      groupButton.style.borderColor = `${LEVEL_COLORS[i - 1]}`;
      groupButton.addEventListener('click', this.handleGroupButtons);
      groupBtnsContainer.append(groupButton);
    }
    groupsContainer.append(groupLabel, groupBtnsContainer);
    if (state.userName) {
      let cssArray = [];
      if (state.group === 6) {
        cssArray = ['group-hard-btn', 'group__selected'];
      } else {
        cssArray = ['group-hard-btn'];
      }
      const difficultWordsGroup = new Button('Сложные слова', cssArray).buttonElement;
      difficultWordsGroup.id = 'group-button-7';
      difficultWordsGroup.addEventListener('click', this.handleGroupButtons);
      groupBtnsContainer.append(difficultWordsGroup);
    }

    this.groupsContainerElement = groupsContainer;
  }

  private handleGroupButtons(e: Event): void {
    const target = e.target as HTMLElement;
    const groupNumber = Number(target.id.split('-')[2]) - 1;
    if (state.group != groupNumber) {
      state.group = groupNumber;
      state.page = 0;
      new Tutorial();
    }
  }
}

export default Groups;
