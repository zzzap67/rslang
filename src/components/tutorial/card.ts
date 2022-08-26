import CheckJwt from '../authorization/chek-jwt';
import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import { apiStrings } from '../store/constants';
import { state } from '../store/state';
import { ICard } from '../types/interfaces';

class TutorialCard {
  cardElement: HTMLElement;
  difficultButton: HTMLElement;
  constructor(card: ICard) {
    const tutorialCard = new BaseElement('div', ['card']).element;
    tutorialCard.dataset.wordId = card.id;
    this.cardElement = tutorialCard;
    const cardImage = new BaseElement('div', ['card-image']).element;
    const cardEnglishWord = new BaseElement('p', ['card-word', 'card-english-word']).element;
    const cardTranscription = new BaseElement('p', ['card-word', 'card-transcription']).element;
    const cardRussianWord = new BaseElement('p', ['card-word', 'card-russian-word']).element;
    const audioButton = new Button('Play', ['audio-btn']).buttonElement;
    const difficultButton = new Button('Сложное', ['difficult-btn']).buttonElement;
    this.difficultButton = difficultButton;
    const discardButton = new Button('Изученное', ['difficult-btn']).buttonElement;
    cardImage.style.backgroundImage = `url('${apiStrings.API_ADDRESS}/${card.image}')`;
    cardEnglishWord.textContent = `${card.word}`;
    cardTranscription.textContent = `${card.transcription}`;
    cardRussianWord.textContent = `${card.wordTranslate}`;
    audioButton.addEventListener('click', () => this.handleAudio(card));
    tutorialCard.append(cardImage, cardEnglishWord, cardTranscription, cardRussianWord, audioButton);
    if (state.userName) {
      difficultButton.addEventListener('click', () => this.handleDifficultButton(card.id, tutorialCard));
      tutorialCard.append(difficultButton, discardButton);
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

  async handleDifficultButton(wordId: string, card: HTMLElement): Promise<void> {
    const userId = state.userId;
    const token = state.token;
    const responseBody = {
      difficulty: 'hard',
      optional: {},
    };
    CheckJwt.checkJwt();
    const response = await fetch(
      `${apiStrings.API_ADDRESS}${apiStrings.API_USERS}/${userId}${apiStrings.API_WORDS}/${wordId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseBody),
      }
    );
    await response.json();
    card.classList.add('hard-card-in-tutorial');
  }
}

export default TutorialCard;
