import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import { apiStrings } from '../constants/constants';
import { state } from '../store/state';
import { ICard } from '../types/interfaces';

class TutorialCard {
  cardElement: HTMLElement;
  difficultButton: HTMLElement;
  constructor(card: ICard) {
    const tutorialCard = new BaseElement('div', ['card']).element;
    const cardImage = new BaseElement('div', ['card-image']).element;
    const cardEnglishWord = new BaseElement('p', ['card-word', 'card-english-word']).element;
    const cardTranscription = new BaseElement('p', ['card-word', 'card-transcription']).element;
    const cardRussianWord = new BaseElement('p', ['card-word', 'card-russian-word']).element;
    const audioButton = new Button('Play', ['audio-btn']).buttonElement;
    const difficultButton = new Button('Сложное', ['difficult-btn']).buttonElement;
    const discardButton = new Button('Изученное', ['difficult-btn']).buttonElement;
    // TODO uncomment when you'll get access to the Cloudinary
    // cardImage.style.backgroundImage = `url('${card.image}')`;
    cardEnglishWord.textContent = `${card.word}`;
    cardTranscription.textContent = `${card.transcription}`;
    cardRussianWord.textContent = `${card.wordTranslate}`;
    audioButton.addEventListener('click', () => this.handleAudio(card.audio));
    tutorialCard.append(cardImage, cardEnglishWord, cardTranscription, cardRussianWord, audioButton);
    if (state.userName) {
      difficultButton.addEventListener('click', () => this.handleDifficultButton(card.id));
      tutorialCard.append(difficultButton, discardButton);
    }
    this.cardElement = tutorialCard;
    this.difficultButton = difficultButton;
  }

  private handleAudio(url: string): void {
    const audio = new Audio(url);
    audio.play();
  }

  private async handleDifficultButton(wordId: string): Promise<void> {
    const userId = state.userId;
    const token = state.token;
    const responseBody = {
      difficulty: 'hard',
      optional: {},
    };
    const response = await fetch(
      `${apiStrings.API_ADDRESS}${apiStrings.API_USERS}/${userId}${apiStrings.API_WORDS}/${wordId}`,
      {
        method: 'POST',
        // withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responseBody),
      }
    );
    await response.json();
    console.log(state);
  }
}

export default TutorialCard;
