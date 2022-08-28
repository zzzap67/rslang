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

    document.body.style.backgroundImage = 'none';
    const mainContainer = new BaseElement('div', ['main__wrapper']).element;
    mainContainer.innerHTML = `
    <div class="game__start-scr-wrapper">
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
    </div>
    `;

    this.startScrElement = mainContainer;
  }
}

export default GameStartScreen;
