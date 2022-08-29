import './sprint.scss';
import Timer from './timer';
// import GameStartScreen from '../gameStartScreen';
import { ICard, ISprintAnswer } from '../../components/types/interfaces';
import { apiStrings } from '../../components/store/constants';
import { temporarySprint } from '../../components/store/hard-code-sprint';
import SprintResults from './sprintResults';
// import GetSprintAnswers from './get-answers';

class Sprint {
  rightAnswers: ISprintAnswer[];
  wrongAnswers: ISprintAnswer[];
  rightButton: HTMLElement;
  wrongButton: HTMLElement;
  mainContainer: HTMLElement;
  NUMBER_OF_SETS = 4;
  NUMBER_OF_PAGES = 30;
  ONE_MINUTE = 600000;
  pageId: number;
  groupId: number;
  startTime: number;
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
    this.rightAnswers = temporarySprint.slice();
    this.wrongAnswers = temporarySprint.slice().reverse();
    const mainContainer = document.querySelector('.main') as HTMLElement;
    this.mainContainer = mainContainer;
    // UNCOMMENT THE NEXT CODE LINE TO LOOK AT SPRINT GAME WINDOW
    //(also set "DISPLAY: NONE" for '.sprint__results-field' and "DISPLAY: BLOCK" for '.sprint__ game-field' in sprint.scss)

    mainContainer.innerHTML = '';
    mainContainer.innerHTML = this.sprintHtml;
    this.addTimer();
    this.setTimer();
    const rightButton = mainContainer.querySelector('.sprint__btn-true') as HTMLElement;
    const wrongButton = mainContainer.querySelector('.sprint__btn-false') as HTMLElement;
    this.rightButton = rightButton;
    this.wrongButton = wrongButton;
    this.rightButton.addEventListener('click', (e: Event) => this.handleButton(e));
    this.wrongButton.addEventListener('click', (e: Event) => this.handleButton(e));
    this.startTime = Date.now();
    this.startGame();

    // mainContainer.append(new GameStartScreen('sprint').startScrElement); // --> Game Start Screen
  }

  private startGame() {
    setTimeout(() => {
      this.stopGame.call(this);
    }, 3000);
    this.goRound();
  }

  private goRound() {
    const wordIndex = Math.floor(Math.random() * this.rightAnswers.length);
    const roundRightWord = this.rightAnswers.splice(wordIndex, 1)[0];
    const sprintEnWord = document.body.querySelector('.sprint_en-word') as HTMLElement;
    const sprintRuWord = document.body.querySelector('.sprint__ru-word') as HTMLElement;
    sprintEnWord.textContent = roundRightWord.englishWord;
    let roundWrongWord = this.getWrongWord();
    while (roundWrongWord.russianWord === roundRightWord.russianWord) {
      roundWrongWord = this.getWrongWord();
    }
    if (this.defineRightWrongWord()) {
      sprintRuWord.textContent = roundRightWord.russianWord;
      this.rightButton.dataset.sprint = 'right';
      this.wrongButton.dataset.sprint = 'wrong';
    } else {
      sprintRuWord.textContent = roundWrongWord.russianWord;
      this.rightButton.dataset.sprint = 'wrong';
      this.wrongButton.dataset.sprint = 'right';
    }
  }

  private stopGame() {
    console.log(this.rightButton);
    this.rightButton.removeEventListener('click', (e: Event) => this.handleButton(e));
    this.wrongButton.removeEventListener('click', (e: Event) => this.handleButton(e));
    console.log('stop');
    this.mainContainer.innerHTML = '';
    this.mainContainer.append(new SprintResults().resultsElement); //--> Sprint Reusults screen
  }

  private defineRightWrongWord() {
    const randomNumber = Math.random();
    if (randomNumber < 0.5) {
      return true;
    }
    return false;
  }

  getWrongWord() {
    const wrongWordIndex = Math.floor(Math.random() * this.wrongAnswers.length);
    const roundWrongWord = this.wrongAnswers[wrongWordIndex];
    return roundWrongWord;
  }

  private handleButton(e: Event) {
    const target = e.target as HTMLElement;
    if (target.dataset.sprint === 'right') {
      this.onBtnTrueClick();
    } else {
      this.onBtnFalseClick();
    }
    this.goRound();
  }

  private createPagesSet() {
    const pagesSets = new Set();
    while (pagesSets.size < this.NUMBER_OF_SETS) {
      pagesSets.add(Math.floor(Math.random() * this.NUMBER_OF_PAGES));
    }
    return [...pagesSets];
  }

  private async getAnswers() {
    // const answersSet: ISprintAnswer[] = [];
    const pagesSet = this.createPagesSet();
    pagesSet.forEach(async (page) => {
      try {
        const response = await fetch(
          `${apiStrings.API_ADDRESS}${apiStrings.API_WORDS}?page=${page}&group=${this.groupId}`
        );
        const data = await response.json();
        const dataWords: ISprintAnswer[] = data.map((item: ICard) => {
          return {
            englishWord: item.word,
            russianWord: item.wordTranslate,
          };
        });

        dataWords.forEach((word) => {
          this.rightAnswers.push(word);
        });
      } catch (err) {
        console.log('this is an error' + err);
      }
    });
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

  private onBtnFalseClick() {
    const gameField = document.querySelector('.sprint__game-field') as HTMLElement;
    gameField.style.border = '5px solid #df605b';
    const audio = new Audio('./sounds/wrong.mp3');
    audio.play();

    setTimeout(() => {
      gameField.style.border = 'none';
    }, 300);
  }

  private onBtnTrueClick() {
    const gameField = document.querySelector('.sprint__game-field') as HTMLElement;
    gameField.style.border = '5px solid #86c662';
    const audio = new Audio('./sounds/correct.mp3');
    audio.play();

    setTimeout(() => {
      gameField.style.border = 'none';
    }, 300);
  }
}

export default Sprint;
