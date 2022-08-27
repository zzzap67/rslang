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
    this.correctWords = [];
    this.setLevel = this.setLevel.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);

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
    const target = e.target as HTMLElement;
    const groupNumber = Number(target.id.split('-')[2]);
    if (this.roundAnswers[groupNumber].correct) {
      this.correctAnswers++;
      this.correctWords.push()
    } else {

    }
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

    if (this.currentLevel <= this.wordsData[0].length) {
      const i = this.currentLevel;
      this.mainContainer.innerHTML = `<div>Round ${i} / ${this.wordsData[0].length}</div>`;
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

      console.log(this.roundWord.word);

      const answersContainer = new BaseElement('div', ['answer-container']).element;

      for (let i = 0; i < this.roundAnswers.length; i++) {
        const answerButton = new Button(this.roundAnswers[i], ['answer-btn']).buttonElement;
        answerButton.id = 'level-button-' + i;
        answerButton.addEventListener('click', this.setLevel);
        answersContainer.append(groupButton);
      }

      this.mainContainer.append(answersContainer);
    } else {
      this.showResults();
    }
  }

  private showResults() {
    this.mainContainer.innerHTML = `RESULT: ${this.correctAnswers} / ${this.wordsData[0].length}`;
  }
}

export default Audiocall;
