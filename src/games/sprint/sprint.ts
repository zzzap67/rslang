import './sprint.scss';
import Timer from './timer';
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
  pageId: number;
  groupId: number;
  startTime: number;
  correctAnswers = 0;
  correctAnswersArr: ISprintAnswer[] = [];
  wrongAnswersArr: string[] = [];
  correctAnswersSeries: number[] = [];
  score = 0;
  correctPercentage = 0;
  wrongPersentage = 0;
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
  }

  private startGame() {
    setTimeout(() => {
      this.stopGame.call(this);
    }, 10000);
    this.correctAnswers = 0;
    this.correctAnswersArr = [];
    this.wrongAnswersArr = [];
    this.correctAnswersSeries = [];
    this.correctPercentage = 0;
    this.wrongPersentage = 0;
    this.score = 0;
    const startAudio = new Audio('./sounds/sprint-start.mp3');
    startAudio.play();
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
    this.rightButton.removeEventListener('click', (e: Event) => this.handleButton(e));
    this.wrongButton.removeEventListener('click', (e: Event) => this.handleButton(e));
    this.correctAnswersSeries.push(this.correctAnswers);
    this.mainContainer.innerHTML = '';
    const maxSerie = Math.max(...this.correctAnswersSeries);
    const allAnswers = this.correctPercentage + this.wrongPersentage;
    const PERCENTS = 100;
    const percentage = (PERCENTS / allAnswers) * this.correctPercentage;
    this.mainContainer.append(new SprintResults(this.score, maxSerie, percentage).resultsElement);
    console.log(this.score);
    console.log(this.correctAnswersArr);
    console.log(Math.max(...this.correctAnswersSeries));
    console.log(this.wrongAnswersArr);
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
    const englishWord = gameField.querySelector('.sprint_en-word')?.textContent as string;
    gameField.style.border = '5px solid #df605b';
    const audio = new Audio('./sounds/sprint-wrong.mp3');
    audio.play();
    this.correctAnswersSeries.push(this.correctAnswers);
    this.wrongAnswersArr.push(englishWord);
    this.correctAnswers = 0;
    this.wrongPersentage++;

    setTimeout(() => {
      gameField.style.border = 'none';
    }, 300);
  }

  private onBtnTrueClick() {
    const gameField = document.querySelector('.sprint__game-field') as HTMLElement;
    const englishWord = gameField.querySelector('.sprint_en-word')?.textContent as string;
    const russianWord = gameField.querySelector('.sprint__ru-word')?.textContent as string;
    gameField.style.border = '5px solid #86c662';
    const audio = new Audio('./sounds/sprint-correct.mp3');
    audio.play();
    this.correctAnswers++;
    this.addPoints();
    const correctAnswer: ISprintAnswer = {
      englishWord: englishWord,
      russianWord: russianWord,
    };
    this.correctAnswersArr.push(correctAnswer);
    this.correctPercentage++;

    setTimeout(() => {
      gameField.style.border = 'none';
    }, 300);
  }

  private addPoints() {
    let points = 10;
    if (this.correctAnswers > 3) points = 20;
    if (this.correctAnswers > 6) points = 30;
    if (this.correctAnswers > 9) points = 40;
    this.score += points;
  }
}

export default Sprint;
