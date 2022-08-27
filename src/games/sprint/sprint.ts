import './sprint.scss';
import Timer from './timer';
//import SprintResults from './sprintResults';
import GameStartScreen from '../gameStartScreen';

class Sprint {
  private sprintHtml = `
  <div class="sprint__main-wrapper">
    <div class="sprint__game-field">
      <div class="sprint__game-info">
        <div class="sprint__sound-switcher">
          <div class="sprint__sound-switcher-disabled"></div>
        </div>
        <div id="timer" class="sprint__timer"></div>
        <h2 class="sprint__points">58</h2>
      </div>
      <div class="sprint__game-window">
        <div class="sprint__words-wrapper">
          <h2 class="sprint_en-word">Agree</h2>
          <h3 class="sprint__ru-word">Соглашаться</h3>
        </div>
        <div class="sprint__btns-wrapper">
          <button class="sprint__btn-false">Не верно</button>
          <button class="sprint__btn-true">Верно</button>
        </div>
      </div>
    </div>
  </div>
  `;

  constructor() {
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    // UNCOMMENT THE NEXT CODE LINE TO LOOK AT SPRINT GAME WINDOW
    //(also set "DISPLAY: NONE" for '.sprint__results-field' and "DISPLAY: BLOCK" for '.sprint__ game-field' in sprint.scss)

    //mainContainer.innerHTML = this.sprintHtml; //--> Sprint Game Screen
    mainContainer.innerHTML = '';
    //mainContainer.append(new SprintResults().resultsElement); //--> Sprint Reusults screen
    mainContainer.append(new GameStartScreen('sprint').startScrElement); // --> Game Start Screen
  }

  public addTimer() {
    const timerContainer = document.querySelector('.sprint__timer') as HTMLElement;
    timerContainer.append(new Timer().timerElement);
  }

  public setTimer() {
    const time = 60;
    let i = 0;
    const finalOffset = 289;
    const step = finalOffset / time;
    const timeCaption = document.querySelector('h2') as HTMLElement;
    const circle = (document.querySelector('.circle_animation') as HTMLElement).style;

    let strokeDashoffset = 0;
    timeCaption.innerText = time.toString();

    const interval = setInterval(() => {
      timeCaption.innerText = `${time - i}`;
      if (i++ == time) {
        clearInterval(interval);
      } else {
        strokeDashoffset = step * i;
        circle.strokeDashoffset = `${strokeDashoffset}`;
      }
    }, 1000);
  }

  public onBtnFalseClick() {
    const gameField = document.querySelector('.sprint__game-field') as HTMLElement;
    gameField.style.border = '5px solid #df605b';

    setTimeout(() => {
      gameField.style.border = 'none';
    }, 300);
  }

  public onBtnTrueClick() {
    const gameField = document.querySelector('.sprint__game-field') as HTMLElement;
    gameField.style.border = '5px solid #86c662';

    setTimeout(() => {
      gameField.style.border = 'none';
    }, 300);
  }
}

export default Sprint;
