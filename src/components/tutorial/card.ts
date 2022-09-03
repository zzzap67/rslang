import './card.scss';
import CheckJwt from '../authorization/chek-jwt';
import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import { apiStrings, LEVEL_COLORS } from '../store/constants';
import { state } from '../store/state';
import { ICard } from '../types/interfaces';

class TutorialCard {
  cardElement: HTMLElement;

  constructor(
    card: ICard,
    hardType: number,
    studiedType: number,
    newType: number,
    gameRight: number,
    gameTotal: number
  ) {
    const tutorialCard = new BaseElement('div', ['card']).element;
    tutorialCard.dataset.wordId = card.id;
    this.cardElement = tutorialCard;
    const cardImage = new BaseElement('div', ['card-image']).element;
    const wordInfoWrapper = new BaseElement('div', ['card__word-info-wrapper']).element;
    const cardInfo = new BaseElement('div', ['card__info']).element;
    const cardLabel = new BaseElement('div', ['card__label']).element;
    const wordInfo = new BaseElement('h3', ['card__word-info']).element;
    const meaningWrapper = new BaseElement('p', ['card__meaning-wrapper']).element;
    const exmpleWrapper = new BaseElement('p', ['card__example-wrapper']).element;
    const wordMeaning = new BaseElement('span', ['card__word-meaning']).element;
    const wordMeaningTranslate = new BaseElement('span', ['card__word-meaning-translate']).element;
    const wordExample = new BaseElement('span', ['card__word-example']).element;
    const wordExampleTranslate = new BaseElement('span', ['card__word-example-translate']).element;
    const btnsWrapper = new BaseElement('div', ['card__btns-wrapper']).element;
    const audioButton = new BaseElement('div', ['card__audio-btn']).element;
    const difficultButton = new Button('Сложное', ['difficult-btn']).buttonElement;
    const discardButton = new Button('Изученное', ['difficult-btn']).buttonElement;
    difficultButton.id = 'hard-btn-' + card.id;
    discardButton.id = 'studied-btn-' + card.id;
    cardImage.style.backgroundImage = `url('${apiStrings.API_ADDRESS}/${card.image}')`;
    let progressInfo = '';
    if (gameTotal > 0) {
      progressInfo = ` | ${gameRight} / ${gameTotal}`;
    }
    wordInfo.textContent = `${card.word} - ${card.transcription} - ${card.wordTranslate}${progressInfo}`;
    wordMeaning.innerHTML = `${card.textMeaning} <span> &mdash; </span>`;
    wordMeaningTranslate.textContent = card.textMeaningTranslate;
    wordExample.innerHTML = `${card.textExample} <span> &mdash; </span>`;
    wordExampleTranslate.textContent = card.textExampleTranslate;
    meaningWrapper.append(wordMeaning, wordMeaningTranslate);
    exmpleWrapper.append(wordExample, wordExampleTranslate);
    wordInfoWrapper.append(wordInfo, audioButton);
    cardLabel.style.borderBottomColor = `${LEVEL_COLORS[state.group]}`;
    cardInfo.append(wordInfoWrapper, meaningWrapper, exmpleWrapper, btnsWrapper, cardLabel);
    audioButton.addEventListener('click', () => this.handleAudio(card));
    tutorialCard.style.borderColor = `${LEVEL_COLORS[state.group]}`;
    if (newType) {
      const newSign = new BaseElement('div', ['new-sign']).element;
      newSign.textContent = 'NEW!';
      cardInfo.append(newSign);
    }
    tutorialCard.append(cardImage, cardInfo);
    if (state.userId) {
      if (hardType) {
        difficultButton.classList.add('btn-checked');
        tutorialCard.classList.add('card-hard');
      }
      difficultButton.addEventListener('click', () =>
        this.handleDifficultButton(card.id, tutorialCard, difficultButton)
      );
      btnsWrapper.append(difficultButton);

      if (studiedType) {
        discardButton.classList.add('btn-checked');
        tutorialCard.classList.add('card-studied');
        difficultButton.classList.remove('btn-checked');
        difficultButton.classList.add('btn-hidden');
      }
      discardButton.addEventListener('click', () =>
        this.handleStudiedButton(card.id, tutorialCard, difficultButton, discardButton)
      );
      btnsWrapper.append(discardButton);
    }
  }

  private handleAudio(card: ICard): void {
    const allAudio = document.querySelectorAll('audio');
    allAudio.forEach((audio) => {
      audio.pause();
      audio.remove();
    });
    const { audio, audioMeaning, audioExample } = card;
    const audio1Container = document.createElement('audio');
    const audio2Container = document.createElement('audio');
    const audio3Container = document.createElement('audio');
    audio1Container.src = `${apiStrings.API_ADDRESS}/${audio}`;
    audio2Container.src = `${apiStrings.API_ADDRESS}/${audioMeaning}`;
    audio3Container.src = `${apiStrings.API_ADDRESS}/${audioExample}`;
    document.body.append(audio1Container, audio2Container, audio3Container);
    audio1Container.play();
    audio1Container.addEventListener('ended', () => {
      audio2Container.play();
      audio2Container.addEventListener('ended', () => {
        audio3Container.play();
      });
    });
  }

  async handleDifficultButton(wordId: string, card: HTMLElement, button: HTMLElement): Promise<void> {
    const userId = state.userId;
    // const token = localStorage.getItem('currentToken');
    const responseBody = {
      difficulty: 'hard',
      optional: {},
    };
    if (button.classList.contains('btn-checked')) {
      responseBody.difficulty = 'easy';
    }

    await CheckJwt.checkJwt();
    try {
      const checkWord = await fetch(
        `${apiStrings.API_ADDRESS}${apiStrings.API_USERS}/${userId}${apiStrings.API_WORDS}/${wordId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${state.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      let methodType = 'PUT';
      const status = checkWord.status;
      if (status === 404) {
        methodType = 'POST';
      }

      const response = await fetch(
        `${apiStrings.API_ADDRESS}${apiStrings.API_USERS}/${userId}${apiStrings.API_WORDS}/${wordId}`,
        {
          method: methodType,
          headers: {
            Authorization: `Bearer ${state.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(responseBody),
        }
      );
      await response.json();
      if (responseBody.difficulty === 'hard') {
        button.classList.add('btn-checked');
        card.classList.add('card-hard');
      } else {
        button.classList.remove('btn-checked');
        card.classList.remove('card-hard');
      }
    } catch (e) {
      const err = e as Error;
      console.log(err.name);
    }
  }

  async handleStudiedButton(
    wordId: string,
    card: HTMLElement,
    hardButton: HTMLElement,
    button: HTMLElement
  ): Promise<void> {
    const userId = state.userId;
    // const token = localStorage.getItem('currentToken');
    const responseBody = {
      difficulty: 'studied',
      optional: {},
    };
    if (button.classList.contains('btn-checked')) {
      responseBody.difficulty = 'easy';
    }

    let studiedWords = document.body.querySelectorAll('.card-studied').length;
    const prevStudiedWords = studiedWords;
    await CheckJwt.checkJwt();
    try {
      const checkWord = await fetch(
        `${apiStrings.API_ADDRESS}${apiStrings.API_USERS}/${userId}${apiStrings.API_WORDS}/${wordId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${state.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      let methodType = 'PUT';
      const status = checkWord.status;
      if (status === 404) {
        methodType = 'POST';
      }

      const response = await fetch(
        `${apiStrings.API_ADDRESS}${apiStrings.API_USERS}/${userId}${apiStrings.API_WORDS}/${wordId}`,
        {
          method: methodType,
          headers: {
            Authorization: `Bearer ${state.token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(responseBody),
        }
      );
      await response.json();
      console.log(studiedWords);
      if (responseBody.difficulty === 'studied') {
        button.classList.add('btn-checked');
        hardButton.classList.remove('btn-checked');
        hardButton.classList.add('btn-hidden');
        card.classList.remove('card-hard');
        card.classList.add('card-studied');
        studiedWords++;
      } else {
        button.classList.remove('btn-checked');
        card.classList.remove('card-studied');
        hardButton.classList.remove('btn-hidden');
        studiedWords--;
      }
      console.log(studiedWords);
      if (studiedWords === 20 && prevStudiedWords !== 20) {
        const pageNumber = document.body.querySelector('.pages__btn-selected') as HTMLElement;
        pageNumber.classList.add('pages__btn-selected-studied');
        const gameButton1 = document.body.querySelector('.tutorial-games-link-1') as HTMLButtonElement;
        gameButton1.disabled = true;
        const gameButton2 = document.body.querySelector('.tutorial-games-link-2') as HTMLButtonElement;
        gameButton2.disabled = true;
      } else if (studiedWords !== 20 && prevStudiedWords === 20) {
        const pageNumber = document.body.querySelector('.pages__btn-selected') as HTMLElement;
        pageNumber.classList.remove('pages__btn-selected-studied');
        const gameButton1 = document.body.querySelector('.tutorial-games-link-1') as HTMLButtonElement;
        gameButton1.disabled = false;
        const gameButton2 = document.body.querySelector('.tutorial-games-link-2') as HTMLButtonElement;
        gameButton2.disabled = false;
      }
    } catch (e) {
      const err = e as Error;
      console.log(err.name);
    }
  }
}

export default TutorialCard;
