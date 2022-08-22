import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import { state } from '../store/state';
import Tutorial from './tutorial';

class Groups {
  groupsContainerElement: HTMLElement;
  constructor() {
    const groupsContainer = new BaseElement('div', ['groups-container']).element;
    const prevButton = new Button('Prev', ['group-btn']).buttonElement;
    const nextButton = new Button('Next', ['group-btn']).buttonElement;
    prevButton.addEventListener('click', this.handleGroupButtons);
    nextButton.addEventListener('click', this.handleGroupButtons);
    groupsContainer.append(prevButton, nextButton);
    this.groupsContainerElement = groupsContainer;
  }

  private handleGroupButtons(e: Event): void {
    const target = e.target as HTMLElement;
    if (target.textContent === 'Next') {
      state.group++;
    } else {
      state.group--;
    }

    new Tutorial();
  }
}

export default Groups;
