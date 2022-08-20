import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import { ICard } from '../types/interfaces';

class TutorialCard {
  cardElement: HTMLElement;
  constructor(card: ICard) {
    const tutorialCard = new BaseElement('div', ['card']).element;
    const cardImage = new BaseElement('div', ['card-image']).element;
    const cardEnglishWord = new BaseElement('p', ['card-word', 'card-english-word']).element;
    const cardTranscription = new BaseElement('p', ['card-word', 'card-transcription']).element;
    const cardRussianWord = new BaseElement('p', ['card-word', 'card-russian-word']).element;
    const audioButton = new Button('Play', ['audio-btn']).buttonElement;
    const difficultButton = new Button('Сложное', ['difficult-btn']).buttonElement;
    const discardButton = new Button('Изученное', ['difficult-btn']).buttonElement;
    cardImage.style.backgroundImage = `url('${card.image}')`;
    cardEnglishWord.textContent = `${card.word}`;
    cardTranscription.textContent = `${card.transcription}`;
    cardRussianWord.textContent = `${card.wordTranslate}`;
    audioButton.addEventListener('click', () => this.handleAudio(card.audio));
    tutorialCard.append(
      cardImage,
      cardEnglishWord,
      cardTranscription,
      cardRussianWord,
      audioButton,
      difficultButton,
      discardButton
    );
    this.cardElement = tutorialCard;
  }

  private handleAudio(url: string) {
    const audio = new Audio(url);
    audio.play();
  }
}

export default TutorialCard;
