import './sprint.scss';
import Timer from './timer';
import GameStartScreen from '../gameStartScreen';
import { ICard } from '../../components/types/interfaces';
import { apiStrings } from '../../components/store/constants';
// import SprintResults from './sprintResults';

class Sprint {
  rightAnswers: ICard[];
  wrongAnswers: ICard[];
  NUMBER_OF_SETS = 4;
  NUMBER_OF_PAGES = 30;
  pageId: number;
  groupId: number;
  private sprintHtml = `
  <div class="sprint__main-wrapper">
    <div class="sprint__game-field">
      <div class="sprint__game-info">
        <div class="sprint__sound-switcher">
          <div class="sprint__sound-switcher-disabled"></div>
        </div>
        <div id="timer" class="sprint__timer"></div>
        <h2 class="sprint__points">0</h2>
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

  constructor(groupId: number, pageId: number) {
    this.pageId = pageId;
    this.groupId = groupId;
    this.rightAnswers = this.getAnswers();
    this.wrongAnswers = this.getAnswers();
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    // UNCOMMENT THE NEXT CODE LINE TO LOOK AT SPRINT GAME WINDOW
    //(also set "DISPLAY: NONE" for '.sprint__results-field' and "DISPLAY: BLOCK" for '.sprint__ game-field' in sprint.scss)

    mainContainer.innerHTML = '';
    mainContainer.innerHTML = this.sprintHtml;
    this.addTimer();
    this.setTimer();
    console.log(this.rightAnswers);
    // mainContainer.append(new SprintResults().resultsElement); //--> Sprint Reusults screen
    mainContainer.append(new GameStartScreen('sprint').startScrElement); // --> Game Start Screen
  }

  private createPagesSet() {
    const pagesSets = new Set();
    while (pagesSets.size < this.NUMBER_OF_SETS) {
      pagesSets.add(Math.floor(Math.random() * this.NUMBER_OF_PAGES));
    }
    return [...pagesSets];
  }

  private getAnswers() {
    const rightAnswersSet: ICard[] = [];
    const pagesSet = this.createPagesSet();
    pagesSet.forEach(async (page) => {
      try {
        const response = await fetch(
          `${apiStrings.API_ADDRESS}${apiStrings.API_WORDS}?page=${page}&group=${this.groupId}`
        );
        const data = await response.json();
        const dataWords = data.map((item: ICard) => {
          return {
            englishWord: item.word,
            russianWord: item.wordTranslate,
          };
        });
        rightAnswersSet.push(...dataWords);
      } catch (err) {
        console.log('this is an error' + err);
      }
    });
    return rightAnswersSet;
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
      if (i++ === time) {
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
