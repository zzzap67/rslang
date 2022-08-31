import BaseElement from '../base-element/base-element';
import Audiocall from './audiocall/audiocall';

import './gameStartScreen.scss';
import Sprint from './sprint/sprint';

class GameStartScreen {
  private sprintInfo = `Спринт - это тренировка на скорость.
                      Попробуй угадать как можно больше слов за 60 секунд.`;
  private audioCallInfo = `Тренировка Аудиовызов улучшает твое восприятие речи на слух`;
  public startScrElement: HTMLElement;
  private gameName: string;

  constructor(gameName: string) {
    this.gameName = gameName;
    let name = '';
    let gameInfo = '';
    if (gameName === 'sprint') {
      name = 'Спринт';
      gameInfo = this.sprintInfo;
    } else if (gameName === 'audioCall') {
      name = 'Аудиовызов';
      gameInfo = this.audioCallInfo;
    }

    const startrScreen = new BaseElement('div', ['game__start-scr-wrapper']).element;
    startrScreen.innerHTML = `
    <div class="game__image"></div>
      <div class="game__field-wrapper">
        <div class="game__info-wrapper">
            <h2 class="game__name">${name}</h2>
            <p class="game__info">${gameInfo}</p>
        </div>
        <div class="game__level-wrapper">
            <p class="game__level-choice">Выбери уровень:</p>
            <div class="game__btns-wrapper">
                <button class="game__btn-level" data-level="0">A1</button>
                <button class="game__btn-level" data-level="1">A2</button>
                <button class="game__btn-level" data-level="2">B1</button>
                <button class="game__btn-level" data-level="3">B2</button>
                <button class="game__btn-level" data-level="4">C1</button>
                <button class="game__btn-level" data-level="5">C2</button>
            </div>
        </div>
      </div>
    `;
    const levelButtons = startrScreen.querySelectorAll('.game__btn-level');
    levelButtons.forEach((item) => {
      const button = item as HTMLElement;
      const level = Number(button.dataset.level);
      button.addEventListener('click', () => this.handleButtons(level));
    });

    this.startScrElement = startrScreen;
  }

  private handleButtons(level: number) {
    if (this.gameName === 'sprint') {
      new Sprint(level, 1);
    } else {
      new Audiocall(level, 1);
    }
  }
}

export default GameStartScreen;
