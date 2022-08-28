import BaseElement from '../components/base-element/base-element';
import './gameStartScreen.scss';

class GameStartScreen {
  private sprintInfo = `Спринт - это тренировка на скорость.
                      Попробуй угадать как можно больше слов за 60 секунд.`;
  private audioCallInfo = `Тренировка Аудиовызов улучшает твое восприятие речи на слух`;
  public startScrElement: HTMLElement;

  constructor(gameName: string) {
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
                <button class="game__btn-level">A1</button>
                <button class="game__btn-level">A2</button>
                <button class="game__btn-level">B1</button>
                <button class="game__btn-level">B2</button>
                <button class="game__btn-level">C1</button>
                <button class="game__btn-level">C2</button>
            </div>
        </div>
      </div>
    `;

    this.startScrElement = startrScreen;
  }
}

export default GameStartScreen;
