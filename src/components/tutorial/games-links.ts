import './games-links.scss';
import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import Audiocall from '../games/audiocall/audiocall';
import Sprint from '../games/sprint/sprint';
import { state } from '../store/state';

class GamesLinks {
  linksElement: HTMLElement;

  constructor() {
    const linksContainer = new BaseElement('div', ['games-links-container']).element;
    const gamesLabel = new BaseElement('h3', ['games__label']).element;
    gamesLabel.textContent = 'Сыграй в игру: ';
    console.log(state.group);
    if (state.group < 6) {
      const groupButtonSprint = new Button(`Спринт`, ['games__link-btn', 'tutorial-games-link']).buttonElement;
      groupButtonSprint.dataset.level = '0';
      groupButtonSprint.addEventListener('click', this.handleLinksButtons);
      linksContainer.append(gamesLabel, groupButtonSprint);
      const groupButtonAC = new Button(`Аудиовызов`, ['games__link-btn', 'tutorial-games-link']).buttonElement;
      groupButtonAC.dataset.level = '1';
      groupButtonAC.addEventListener('click', this.handleLinksButtons);
      linksContainer.append(groupButtonAC);
    }

    this.linksElement = linksContainer;
  }

  private handleLinksButtons(e: Event): void {
    const target = e.target as HTMLElement;
    if (target.dataset.level === '0') {
      new Sprint(state.group, state.page);
    } else {
      new Audiocall(state.group, state.page);
    }
  }
}

export default GamesLinks;
