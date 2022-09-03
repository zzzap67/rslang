import './audiocall.scss';
import BaseElement from '../../base-element/base-element';
import Button from '../../buttons/button';
import { apiStrings } from '../../store/constants';
import { state } from '../../store/state';
import { ICards, IAudioCallCard, IAudioCallAnswers } from '../../types/interfaces';
// import LevelSelector from './level-selector';
import CheckJwt from '../../authorization/chek-jwt';

class Audiocall {
  groupID: number;
  pageID: number;
  pagesNums: number[];
  wordsData: ICards[];
  roundAnswers: IAudioCallAnswers[];
  roundWord: IAudioCallCard;
  mainContainer: HTMLElement;
  currentLevel: number;
  correctAnswers: number;
  correctWords: number[];
  currentAnswer: number;
  audio: HTMLAudioElement;

  constructor(groupID: number, pageID: number) {
    //const body = document.body;
    this.mainContainer = document.body.querySelector('.main') as HTMLElement;
    this.mainContainer.innerHTML = 'AUDIOCALL GAME';
    this.wordsData = [];
    this.roundAnswers = [];
    this.roundWord = { id: '', word: '', image: '', audio: '', wordTranslate: '' };
    this.pageID = pageID;
    this.pagesNums = [];
    this.currentLevel = 0;
    this.correctAnswers = 0;
    this.currentAnswer = -1;
    this.correctWords = [];
    this.setLevel = this.setLevel.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.nextLevel = this.nextLevel.bind(this);
    this.playSound = this.playSound.bind(this);
    this.replySound = this.replySound.bind(this);
    this.wordSound = this.wordSound.bind(this);
    this.restart = this.restart.bind(this);
    this.keyPress = this.keyPress.bind(this);
    this.enterPress = this.enterPress.bind(this);
    this.audio = new Audio();

    // 1. Level selector
    this.groupID = groupID;
    if (this.groupID < 0) {
      // to-do level selector
      // this.groupID = 0;
      this.levelSelect();
    } else {
      this.prepareGame();
    }
  }

  private restart(e: Event): void {
    const target = e.target as HTMLElement;
    const groupNumber = Number(target.id.split('-')[2]);
    this.wordsData = [];
    this.roundAnswers = [];
    this.roundWord = { id: '', word: '', image: '', audio: '', wordTranslate: '' };
    this.pagesNums = [];
    this.currentLevel = 0;
    this.correctAnswers = 0;
    this.currentAnswer = -1;
    this.correctWords = [];
    if (groupNumber === 2) {
      this.levelSelect();
    } else {
      this.prepareGame();
    }
  }
  private levelSelect(): void {
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    mainContainer.innerHTML = '';

    const startrScreen = new BaseElement('div', ['game__start-scr-wrapper']).element;
    startrScreen.innerHTML = `
    <div class="game__image__call"></div>
      <div class="game__field-wrapper">
        <div class="game__info-wrapper">
            <h2 class="game__name">Аудиовызов</h2>
            <p class="game__info">Тренировка Аудиовызов улучшает твое восприятие речи на слух</p>
        </div>
        <div class="game__level-wrapper">
            <p class="game__level-choice">Выбери уровень:</p>
            <div class="game__btns-wrapper">
                <button class="game__btn-level" data-level="1">A1</button>
                <button class="game__btn-level" data-level="2">A2</button>
                <button class="game__btn-level" data-level="3">B1</button>
                <button class="game__btn-level" data-level="4">B2</button>
                <button class="game__btn-level" data-level="5">C1</button>
                <button class="game__btn-level" data-level="6">C2</button>
            </div>
        </div>
      </div>
    `;
    const levelButtons = startrScreen.querySelectorAll('.game__btn-level');
    levelButtons.forEach((item) => {
      const button = item as HTMLElement;
      button.addEventListener('click', this.setLevel);
    });

    this.mainContainer.append(startrScreen);
  }

  private prepareGame(): void {
    this.mainContainer.innerHTML = '';
    this.pagesNums = [];
    const pagesArray = [...Array(30).keys()];
    let num = 0;
    let roll: number[] = [];

    if (this.pageID >= 0) {
      this.pagesNums.push(this.pageID);
      pagesArray.splice(this.pageID, 1);
    } else {
      num = Math.floor(Math.random() * pagesArray.length);
      roll = pagesArray.splice(num, 1);
      this.pagesNums.push(roll[0]);
    }

    for (let i = 1; i <= 4; i++) {
      num = Math.floor(Math.random() * pagesArray.length);
      roll = pagesArray.splice(num, 1);
      this.pagesNums.push(roll[0]);
    }

    console.log(this.groupID, this.pageID, 'start');
    // 2. Get Words
    this.getWordsData().then(() => {
      // 3. Play Game
      this.currentLevel = 1;
      this.correctAnswers = 0;
      this.correctWords = [];
      this.startLevel();
    });
  }

  private setLevel(e: Event): void {
    const target = e.target as HTMLElement;
    const groupNumber = Number(target.dataset.level) - 1;
    this.groupID = groupNumber;
    this.prepareGame();
  }

  private checkAnswer(e: Event): void {
    window.removeEventListener('keydown', this.keyPress);
    for (let j = 0; j < 5; j++) {
      const btn = this.mainContainer.querySelector('#level-button-' + j) as HTMLElement;
      btn.removeEventListener('click', this.checkAnswer);
    }
    const cardImage = this.mainContainer.querySelector('.call__card-image') as HTMLElement;
    cardImage.style.backgroundImage = `url('${apiStrings.API_ADDRESS}/${this.roundWord.image}')`;

    const cardEnglishWord = this.mainContainer.querySelector('.call__card-english-word') as HTMLElement;
    cardEnglishWord.textContent = `${this.roundWord.word}`;

    const target = e.target as HTMLElement;
    const groupNumber = Number(target.id.split('-')[2]);
    let soundUrl = '';
    if (this.roundAnswers[groupNumber].correct) {
      this.correctAnswers++;
      this.correctWords.push(this.currentLevel - 1);
      target.classList.add('answer-btn-correct');
      soundUrl = './sounds/correct.mp3';
      // paint buttons
    } else {
      // paint buttons
      target.classList.add('answer-btn-wrong');
      const rightButton = this.mainContainer.querySelector('#level-button-' + this.currentAnswer) as HTMLElement;
      rightButton.classList.add('answer-btn-correct');
      soundUrl = './sounds/wrong.mp3';
    }
    this.playSound(soundUrl);

    // next button show
    const nextButton = this.mainContainer.querySelector('#next-button') as HTMLElement;
    nextButton.classList.remove('answer-btn-hidden');
  }

  private async getWordsData(): Promise<void> {
    try {
      for (let i = 0; i < this.pagesNums.length; i++) {
        // get words

        const response = await fetch(
          `${apiStrings.API_ADDRESS}${apiStrings.API_WORDS}?page=${this.pagesNums[i]}&group=${this.groupID}`
        );
        const data = await response.json();
        this.wordsData.push(data);
      }
    } catch (err) {
      console.log('this is an error' + err);
    }
  }

  private startLevel(): void {
    document.body.style.backgroundImage = 'url(' + require('../../../assets/images/5910390.jpg') + ')';
    document.body.style.backgroundPosition = 'center';

    this.mainContainer.innerHTML = '';
    console.log('level start', this.currentLevel, this.wordsData[0].length);
    const callGameWrapper = new BaseElement('div', ['call__game-wrapper']).element;

    if (this.currentLevel <= this.wordsData[0].length) {
      const i = this.currentLevel - 1;
      const roundNumber = new BaseElement('h2', ['call__round']).element;
      roundNumber.textContent = `Round ${i + 1} / ${this.wordsData[0].length}`;
      this.roundAnswers = [];
      this.roundWord = { id: '', word: '', image: '', audio: '', wordTranslate: '' };
      this.roundWord.id = this.wordsData[0][i].id;
      this.roundWord.word = this.wordsData[0][i].word;
      this.roundWord.image = this.wordsData[0][i].image;
      this.roundWord.audio = this.wordsData[0][i].audio;
      this.roundWord.wordTranslate = this.wordsData[0][i].wordTranslate;
      for (let j = 0; j < this.wordsData.length; j++) {
        if (j === 0) {
          this.roundAnswers.push({ wordTranslate: this.wordsData[j][i].wordTranslate, correct: true });
        } else {
          this.roundAnswers.push({ wordTranslate: this.wordsData[j][i].wordTranslate, correct: false });
        }
      }

      for (let k = this.roundAnswers.length - 1; k > 0; k--) {
        const ind = Math.floor(Math.random() * (k + 1));
        const temp = this.roundAnswers[k];
        this.roundAnswers[k] = this.roundAnswers[ind];
        this.roundAnswers[ind] = temp;
      }

      const wordContainer = new BaseElement('div', ['call__word-container']).element;

      const cardImage = new BaseElement('div', ['call__card-image']).element;
      const cardEnglishWord = new BaseElement('p', ['call__card-word', 'call__card-english-word']).element;
      const audioButton = new Button('', ['call__audio-btn']).buttonElement;

      cardEnglishWord.textContent = ``;
      audioButton.addEventListener('click', this.replySound);
      wordContainer.append(cardImage, cardEnglishWord, audioButton);

      const answersContainer = new BaseElement('div', ['call__answer-container']).element;

      for (let i = 0; i < this.roundAnswers.length; i++) {
        const answerButton = new Button(this.roundAnswers[i].wordTranslate, ['call__answer-btn']).buttonElement;
        answerButton.id = 'level-button-' + i;
        if (this.roundAnswers[i].correct) {
          this.currentAnswer = i;
        }
        answerButton.addEventListener('click', this.checkAnswer);
        answersContainer.append(answerButton);
      }

      const nextContainer = new BaseElement('div', ['next-container']).element;
      const nextButton = new Button('NEXT', ['call__answer-btn', 'answer-btn-hidden']).buttonElement;
      nextButton.id = 'next-button';
      nextButton.addEventListener('click', this.nextLevel);
      nextContainer.append(nextButton);

      callGameWrapper.append(roundNumber, wordContainer, answersContainer, nextContainer);
      this.mainContainer.append(callGameWrapper);
      window.addEventListener('keydown', this.keyPress);
      window.addEventListener('keydown', this.enterPress);
      this.playSound('');
    } else {
      this.showResults();
    }
  }

  private nextLevel() {
    if (this.audio) {
      this.audio.pause();
    }
    this.currentLevel += 1;
    this.startLevel();
  }

  private replySound() {
    this.playSound('');
  }

  private wordSound(e: Event): void {
    const target = e.target as HTMLElement;
    const url = `${apiStrings.API_ADDRESS}/${this.wordsData[0][Number(target.dataset.level)].audio}`;
    this.playSound(url);
  }

  private playSound(urlPath: string) {
    if (this.audio) {
      this.audio.pause();
    }
    if (urlPath) {
      this.audio = new Audio(urlPath);
    } else {
      this.audio = new Audio(`${apiStrings.API_ADDRESS}/${this.roundWord.audio}`);
    }
    this.audio.play();
  }

  private async showResults() {
    this.mainContainer.innerHTML = '';

    const resultContainer = new BaseElement('div', ['call__result-container']).element;

    const scoreContainer = new BaseElement('h2', ['call__score']).element; //'div', ['call__groups-container']
    const rightContainer = new BaseElement('div', ['call__right-container']).element;
    const buttonsContainer = new BaseElement('div', ['call__groups-container']).element;

    scoreContainer.textContent = `Результат: ${this.correctAnswers} / ${this.wordsData[0].length}`;
    const rWordTitle = new BaseElement('div', ['call__word', 'call__word-answers']).element;
    rWordTitle.textContent = `Правильные ответы`;
    const sendResults: Array<{ wordId: string; result: number }> = [];

    rightContainer.append(rWordTitle);
    this.correctWords.forEach((item) => {
      const rWord = new BaseElement('div', ['call__word']).element;
      rWord.textContent = `${this.wordsData[0][item].word} - ${this.wordsData[0][item].wordTranslate}`;
      rWord.dataset.level = item.toString();
      rWord.addEventListener('click', this.wordSound);
      rightContainer.append(rWord);
      sendResults.push({ wordId: this.wordsData[0][item].id, result: 1 });
    });

    const rWordTitleWrong = new BaseElement('div', ['call__word', 'call__word-answers']).element;
    rWordTitleWrong.textContent = `Неправильные ответы`;
    rightContainer.append(rWordTitleWrong);
    this.wordsData[0].forEach((item, index) => {
      if (this.correctWords.indexOf(index) < 0) {
        const rWord = new BaseElement('div', ['call__word', 'call__word-wrong']).element;
        rWord.textContent = `${this.wordsData[0][index].word} - ${this.wordsData[0][index].wordTranslate}`;
        rWord.dataset.level = index.toString();
        rWord.addEventListener('click', this.wordSound);
        rightContainer.append(rWord);
        sendResults.push({ wordId: this.wordsData[0][index].id, result: 0 });
      }
    });

    await this.sendStats(JSON.stringify({ gameName: 'AC', results: sendResults }));

    const buttonRestart = new Button('Начать заново', ['call__level-btn']).buttonElement;
    buttonRestart.id = 'restart-button-1';
    buttonRestart.addEventListener('click', this.restart);
    buttonsContainer.append(buttonRestart);

    const buttonReselect = new Button('Выбрать уровень', ['call__level-btn']).buttonElement;
    buttonReselect.id = 'restart-button-2';
    buttonReselect.addEventListener('click', this.restart);
    buttonsContainer.append(buttonReselect);

    resultContainer.append(scoreContainer, rightContainer, buttonsContainer);

    this.mainContainer.append(resultContainer);

    console.log(this.correctAnswers);
    console.log(this.correctWords);
  }

  private async sendStats(responceBody: string): Promise<void> {
    if (state.userId != '') {
      const userId = state.userId;
      await CheckJwt.checkJwt();
      // const token = localStorage.getItem('currentToken');
      try {
        const response = await fetch(
          `${apiStrings.API_ADDRESS}${apiStrings.API_USERS}/${userId}${apiStrings.API_GAMERESULT}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${state.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: responceBody,
          }
        );
        const status = response.status;
        if (status === 401) {
          console.log('Take your token');
        }
        const data = await response.json();
        console.log(data);
      } catch (e) {
        const err = e as Error;
        console.log(err.name);
      }
    }
  }

  private keyPress(e: KeyboardEvent) {
    if ([1, 2, 3, 4, 5].includes(Number(e.key))) {
      console.log('press', e.key);
      let kNumber = parseInt(e.key);
      kNumber -= 1;
      const btn = this.mainContainer.querySelector('#level-button-' + kNumber) as HTMLElement;
      btn.click();
    }
  }
  private enterPress(e: KeyboardEvent) {
    if (e.code === 'Enter' || e.code === 'Space') {
      console.log('enter');
      const nextButton = this.mainContainer.querySelector('#next-button') as HTMLElement;
      if (nextButton) {
        if (!nextButton.classList.contains('answer-btn-hidden')) {
          this.nextLevel();
        }
      }
    }
  }
}

export default Audiocall;
