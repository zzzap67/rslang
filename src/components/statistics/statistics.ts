import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import AudioCallStats from './audiocall-stats';
import SprintStats from './sprint-stats';
import WordStats from './word-stats';

class Statistics {
  constructor() {
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    const statsWrapper = new BaseElement('div', ['stats__wrapper']).element;
    const statsButtonsWrapper = new BaseElement('div', ['stats__buttons-wrapper']).element;
    const statsContainer = new BaseElement('div', ['stats__container']).element;
    const statsButtonsNames = ['Аудиовызов', 'Спринт', 'Изученные слова'];
    statsButtonsNames.forEach((button: string) => {
      const statsButton = new Button(button, ['stats__button']).buttonElement;
      statsButton.addEventListener('click', (e: Event) => this.handleStatsButtons(e, statsContainer));
      statsButtonsWrapper.append(statsButton);
    });
    statsWrapper.textContent = 'Stats';
    mainContainer.innerHTML = '';
    statsWrapper.append(statsButtonsWrapper, statsContainer);
    mainContainer.append(statsWrapper);
  }

  private handleStatsButtons(e: Event, statsContainer: HTMLElement) {
    const target = e.target as HTMLElement;
    if (target.textContent === 'Аудиовызов') {
      new AudioCallStats(statsContainer);
    }
    if (target.textContent === 'Спринт') {
      new SprintStats(statsContainer);
    }
    if (target.textContent === 'Изученные слова') {
      new WordStats(statsContainer);
    }
  }
}

export default Statistics;
