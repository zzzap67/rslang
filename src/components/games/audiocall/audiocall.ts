import './audiocall.scss';
import BaseElement from '../../base-element/base-element';
import Button from '../../buttons/button';
import { apiStrings } from '../../store/constants';
// import { state } from '../../store/state';
import { ICards, IAudioCallCard, IAudioCallAnswers } from '../../types/interfaces';
// import LevelSelector from './level-selector';
// import CheckJwt from '../../authorization/chek-jwt';

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
    this.restart = this.restart.bind(this);
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
    this.mainContainer.innerHTML = '';
    this.mainContainer.innerHTML = '<div>SELECT LEVEL</div>';

    const groupsContainer = new BaseElement('div', ['groups-container']).element;
    const NUMBER_OF_GROUPS = 6;

    for (let i = 1; i <= NUMBER_OF_GROUPS; i++) {
      const groupButton = new Button(`${i}`, ['level-btn']).buttonElement;
      groupButton.id = 'level-button-' + i;
      groupButton.addEventListener('click', this.setLevel);
      groupsContainer.append(groupButton);
    }

    this.mainContainer.append(groupsContainer);
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
    const groupNumber = Number(target.id.split('-')[2]) - 1;
    this.groupID = groupNumber;
    this.prepareGame();
  }

  private checkAnswer(e: Event): void {
    for (let j = 0; j < 5; j++) {
      const btn = this.mainContainer.querySelector('#level-button-' + j) as HTMLElement;
      btn.removeEventListener('click', this.checkAnswer);
    }
    const cardImage = this.mainContainer.querySelector('.card-image') as HTMLHtmlElement;
    cardImage.style.backgroundImage = `url('${apiStrings.API_ADDRESS}/${this.roundWord.image}')`;

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
    this.mainContainer.innerHTML = '';
    console.log('level start', this.currentLevel, this.wordsData[0].length);
    if (this.currentLevel <= this.wordsData[0].length) {
      const i = this.currentLevel - 1;
      this.mainContainer.innerHTML = `<div>Round ${i + 1} / ${this.wordsData[0].length}</div>`;
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

      const wordContainer = new BaseElement('div', ['word-container']).element;

      const cardImage = new BaseElement('div', ['card-image']).element;
      const cardEnglishWord = new BaseElement('p', ['card-word', 'card-english-word']).element;
      const audioButton = new Button('\uD834\uDD60', ['audio-btn']).buttonElement;

      cardImage.style.backgroundImage = `url(./img/question.png)`;
      cardEnglishWord.textContent = `${this.roundWord.word}`;
      audioButton.addEventListener('click', this.replySound);
      wordContainer.append(cardImage, cardEnglishWord, audioButton);

      const answersContainer = new BaseElement('div', ['answer-container']).element;

      for (let i = 0; i < this.roundAnswers.length; i++) {
        const answerButton = new Button(this.roundAnswers[i].wordTranslate, ['answer-btn']).buttonElement;
        answerButton.id = 'level-button-' + i;
        if (this.roundAnswers[i].correct) {
          this.currentAnswer = i;
        }
        answerButton.addEventListener('click', this.checkAnswer);
        answersContainer.append(answerButton);
      }

      const nextContainer = new BaseElement('div', ['next-container']).element;
      const nextButton = new Button('NEXT', ['answer-btn', 'answer-btn-hidden']).buttonElement;
      nextButton.id = 'next-button';
      nextButton.addEventListener('click', this.nextLevel);
      nextContainer.append(nextButton);

      this.mainContainer.append(wordContainer, answersContainer, nextContainer);
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

  private showResults() {
    this.mainContainer.innerHTML = '';

    const resultContainer = new BaseElement('div', ['result-container']).element;

    const scoreContainer = new BaseElement('div', ['groups-container']).element;
    const rightContainer = new BaseElement('div', ['right-container']).element;
    const buttonsContainer = new BaseElement('div', ['groups-container']).element;

    scoreContainer.innerHTML = `RESULT: ${this.correctAnswers} / ${this.wordsData[0].length}</div>`;
    const rWordTitle = new BaseElement('div', ['word']).element;
    rWordTitle.textContent = `Правильные ответы`;
    rightContainer.append(rWordTitle);
    this.correctWords.forEach((item) => {
      const rWord = new BaseElement('div', ['word']).element;
      rWord.textContent = `${this.wordsData[0][item].word} - ${this.wordsData[0][item].wordTranslate}`;
      rightContainer.append(rWord);
    });

    const buttonRestart = new Button('Начать заново', ['level-btn']).buttonElement;
    buttonRestart.id = 'restart-button-1';
    buttonRestart.addEventListener('click', this.restart);
    buttonsContainer.append(buttonRestart);

    const buttonReselect = new Button('Выбрать уровень', ['level-btn']).buttonElement;
    buttonReselect.id = 'restart-button-2';
    buttonReselect.addEventListener('click', this.restart);
    buttonsContainer.append(buttonReselect);

    resultContainer.append(scoreContainer, rightContainer, buttonsContainer);

    this.mainContainer.append(resultContainer);

    console.log(this.correctAnswers);
    console.log(this.correctWords);
  }
}

export default Audiocall;
