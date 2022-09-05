import './sprint.scss';
import Timer from './timer';
import { ICard, ISprintAnswer } from '../../types/interfaces';
import { apiStrings } from '../../store/constants';
import SprintResults from './sprintResults';
import { state } from '../../store/state';
import Loader from '../../loader/loader';

class Sprint {
  rightAnswers: ISprintAnswer[] = [];
  wrongAnswers: ISprintAnswer[] = [];
  rightButton: HTMLElement;
  wrongButton: HTMLElement;
  mainContainer: HTMLElement;
  NUMBER_OF_SETS = 2;
  NUMBER_OF_PAGES = 30;
  pageId: number;
  groupId: number;
  correctAnswers = 0;
  correctAnswersArr: ISprintAnswer[] = [];
  wrongAnswersArr: ISprintAnswer[] = [];
  correctAnswersSeries: number[] = [];
  score = 0;
  correctPercentage = 0;
  wrongPersentage = 0;
  startTimeoutId: NodeJS.Timeout;
  timerTimeoutId: NodeJS.Timeout;
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
          <h2 class="sprint_en-word"></h2>
          <h3 class="sprint__ru-word"></h3>
        </div>
        <div class="sprint__btns-wrapper">
          <button class="sprint__btn sprint__btn-false">Не верно</button>
          <button class="sprint__btn sprint__btn-true">Верно</button>
        </div>
        <div class=" sprint__btns-wrapper sprint__arrows-wrapper">
          <span class="sprint__arrow-left">&#11013;</span>
          <span class="sprint__arrow-right">&#10145;</span>
      </div>
      </div>
    </div>
  </div>
  `;

  constructor(groupId: number, pageId: number) {
    this.pageId = pageId;
    this.groupId = groupId;
    const mainContainer = document.querySelector('.main') as HTMLElement;
    this.mainContainer = mainContainer;
    mainContainer.innerHTML = '';
    mainContainer.innerHTML = this.sprintHtml;
    this.addTimer();
    this.setTimer();
    const audioButton = mainContainer.querySelector('.sprint__sound-switcher') as HTMLElement;
    const audioDisabled = audioButton.querySelector('.sprint__sound-switcher-disabled') as HTMLElement;
    if (!state.sprintAudio) {
      audioDisabled.classList.add('sprint__sound-switcher-disabled-active');
    }
    audioButton.addEventListener('click', () => this.handleAudioSwitcher(audioDisabled));
    const rightButton = mainContainer.querySelector('.sprint__btn-true') as HTMLElement;
    const wrongButton = mainContainer.querySelector('.sprint__btn-false') as HTMLElement;
    this.rightButton = rightButton;
    this.wrongButton = wrongButton;
    this.rightButton.addEventListener('click', (e: Event) => this.handleButton(e));
    this.wrongButton.addEventListener('click', (e: Event) => this.handleButton(e));
    document.addEventListener('keydown', this.handleKeys);
    this.startTimeoutId = setTimeout(() => {
      this.endGame.call(this);
    }, 30000);
    this.timerTimeoutId = setTimeout(() => {
      this.runTimerSound.call(this);
    }, 25800);
    const headerWrapper = document.body.querySelector('.header__wrapper') as HTMLElement;
    headerWrapper?.addEventListener('click', (e: Event) => this.interruptGame(e));
    this.gamePrepare(this.createPagesSet(), groupId);
  }

  private async gamePrepare(pagesSet: number[], groupId: number) {
    await this.getAnswers(pagesSet, groupId).then(() => this.startGame());
  }

  private startGame(): void {
    this.correctAnswers = 0;
    this.correctAnswersArr = [];
    this.wrongAnswersArr = [];
    this.correctAnswersSeries = [];
    this.correctPercentage = 0;
    this.wrongPersentage = 0;
    this.score = 0;
    if (state.sprintAudio) {
      const startAudio = new Audio('./sounds/sprint-start.mp3');
      startAudio.play();
    }
    this.goRound();
  }

  private goRound(): void {
    if (!this.rightAnswers.length) {
      this.overcomeWords();
      return;
    }
    const wordIndex = Math.floor(Math.random() * this.rightAnswers.length);
    const roundRightWord = this.rightAnswers.splice(wordIndex, 1)[0];
    const sprintEnWord = document.body.querySelector('.sprint_en-word') as HTMLElement;
    const sprintRuWord = document.body.querySelector('.sprint__ru-word') as HTMLElement;
    sprintEnWord.dataset.rightEnglishWord = roundRightWord.englishWord;
    sprintEnWord.dataset.wordId = roundRightWord.wordId;
    sprintRuWord.dataset.rightRussianWord = roundRightWord.russianWord;
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

  private overcomeWords(): void {
    this.stopGame();
    this.endGame();
  }

  private endGame(): void {
    if (state.sprintAudio) {
      const endAudio = new Audio('./sounds/game-end.mp3');
      endAudio.play();
    }
    this.correctAnswersSeries.push(this.correctAnswers);
    const maxSerie = Math.max(...this.correctAnswersSeries);
    const allAnswers = this.correctPercentage + this.wrongPersentage;
    const PERCENTS = 100;
    const percentage = (PERCENTS / allAnswers) * this.correctPercentage || 0;
    // console.log(state.statsData);
    // state.statsData.sprintPercentage = (state.statsData.sprintPercentage + percentage) / 2;
    // state.statsData.sprintLongestSerie =
    //   maxSerie > state.statsData.sprintLongestSerie ? maxSerie : state.statsData.sprintLongestSerie;
    this.mainContainer.innerHTML = '';
    this.mainContainer.append(
      new SprintResults(this.score, maxSerie, percentage, this.groupId, this.correctAnswersArr, this.wrongAnswersArr)
        .resultsElement
    );
    document.removeEventListener('keydown', this.handleKeys);
  }

  private interruptGame(e: Event) {
    const target = e.target as HTMLElement;
    if (target.classList.contains('header-nav-li') || target.classList.contains('header__login-btn')) {
      document.addEventListener('click', () => this.stopGame(), { once: true });
    }
  }

  public stopGame(): void {
    clearTimeout(this.timerTimeoutId);
    clearTimeout(this.startTimeoutId);
    document.removeEventListener('keydown', this.handleKeys);
  }

  private defineRightWrongWord(): boolean {
    const randomNumber = Math.random();
    if (randomNumber < 0.5) {
      return true;
    }
    return false;
  }

  getWrongWord(): ISprintAnswer {
    const wrongWordIndex = Math.floor(Math.random() * this.wrongAnswers.length);
    const roundWrongWord = this.wrongAnswers[wrongWordIndex];
    return roundWrongWord;
  }

  private handleButton(e: Event): void {
    const target = e.target as HTMLElement;
    if (!target.classList.contains('sprint__btn')) return;
    if (target.dataset.sprint === 'right') {
      this.onBtnTrueClick();
    } else {
      this.onBtnFalseClick();
    }
    this.goRound();
  }

  private createPagesSet(): number[] {
    const pagesSets: Set<number> = new Set();
    if (this.pageId !== -1) {
      pagesSets.add(this.pageId);
      while (pagesSets.size < this.NUMBER_OF_SETS) {
        pagesSets.add(Math.floor(Math.random() * this.NUMBER_OF_PAGES));
      }
    } else {
      while (pagesSets.size < this.NUMBER_OF_SETS) {
        pagesSets.add(Math.floor(Math.random() * this.NUMBER_OF_PAGES));
      }
    }

    return [...pagesSets];
  }

  async getAnswers(pagesSet: number[], groupId: number) {
    const sprintEnWord = document.body.querySelector('.sprint_en-word') as HTMLElement;
    const loader = new Loader().loaderElement;
    sprintEnWord.append(loader);
    for (const page of pagesSet) {
      const response = await fetch(`${apiStrings.API_ADDRESS}${apiStrings.API_WORDS}?page=${page}&group=${groupId}`);
      const data = await response.json();
      const dataWords: ISprintAnswer[] = data.map((item: ICard) => {
        return {
          englishWord: item.word,
          russianWord: item.wordTranslate,
          wordId: item.id,
        };
      });
      for (const word of dataWords) {
        this.rightAnswers.push(word);
        this.wrongAnswers.push(word);
      }
    }
  }

  public addTimer(): void {
    const timerContainer = document.querySelector('.sprint__timer') as HTMLElement;
    timerContainer.append(new Timer().timerElement);
  }

  public setTimer(): void {
    const time = 30;
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

  private onBtnFalseClick(): void {
    const gameField = document.querySelector('.sprint__game-field') as HTMLElement;
    const englishWord = gameField.querySelector('.sprint_en-word') as HTMLElement;
    const russianWord = gameField.querySelector('.sprint__ru-word') as HTMLElement;
    gameField.style.border = '5px solid #df605b';
    if (state.sprintAudio) {
      const audio = new Audio('./sounds/sprint-wrong.mp3');
      audio.play();
    }
    this.correctAnswersSeries.push(this.correctAnswers);
    const wrongAnswer: ISprintAnswer = {
      englishWord: englishWord.dataset.rightEnglishWord as string,
      russianWord: russianWord.dataset.rightRussianWord as string,
      wordId: englishWord.dataset.wordId as string,
    };
    this.wrongAnswersArr.push(wrongAnswer);
    this.correctAnswers = 0;
    this.wrongPersentage++;

    setTimeout(() => {
      gameField.style.border = 'none';
    }, 300);
  }

  private onBtnTrueClick(): void {
    const gameField = document.querySelector('.sprint__game-field') as HTMLElement;
    const englishWord = gameField.querySelector('.sprint_en-word') as HTMLElement;
    const russianWord = gameField.querySelector('.sprint__ru-word') as HTMLElement;
    gameField.style.border = '5px solid #86c662';
    if (state.sprintAudio) {
      const audio = new Audio('./sounds/sprint-correct.mp3');
      audio.play();
    }
    this.correctAnswers++;
    this.addPoints();
    const correctAnswer: ISprintAnswer = {
      englishWord: englishWord.dataset.rightEnglishWord as string,
      russianWord: russianWord.dataset.rightRussianWord as string,
      wordId: englishWord.dataset.wordId as string,
    };
    this.correctAnswersArr.push(correctAnswer);
    this.correctPercentage++;

    setTimeout(() => {
      gameField.style.border = 'none';
    }, 300);
  }

  private addPoints(): void {
    let points = 10;
    if (this.correctAnswers > 3) points = 20;
    if (this.correctAnswers > 6) points = 30;
    if (this.correctAnswers > 9) points = 40;
    this.score += points;
    const scoreField = this.mainContainer.querySelector('.sprint__points') as HTMLElement;
    scoreField.textContent = this.score.toString();
  }

  private runTimerSound(): void {
    if (state.sprintAudio) {
      const timerAudio = new Audio('./sounds/ticking-timer-four-sec.mp3');
      timerAudio.play();
    }
  }

  private handleKeys(e: KeyboardEvent): void {
    const rightButton = document.body.querySelector('.sprint__btn-true') as HTMLElement;
    const wrongButton = document.body.querySelector('.sprint__btn-false') as HTMLElement;
    const mouseEvent = new Event('click');
    if (e.key === 'ArrowRight') {
      rightButton.dispatchEvent(mouseEvent);
    }
    if (e.key === 'ArrowLeft') {
      wrongButton.dispatchEvent(mouseEvent);
    }
  }

  private handleAudioSwitcher(audioDisabled: HTMLElement): void {
    state.sprintAudio = !state.sprintAudio;
    audioDisabled.classList.toggle('sprint__sound-switcher-disabled-active');
  }
}

export default Sprint;
