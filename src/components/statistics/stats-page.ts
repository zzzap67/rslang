import BaseElement from '../base-element/base-element';
import { state } from '../store/state';

class StatsPage {
  newWords: HTMLElement;
  percentage: HTMLElement;
  longSerie: HTMLElement;

  constructor(statsContainer: HTMLElement) {
    statsContainer.innerHTML = '';
    const results = new BaseElement('div', ['stats__results']).element;
    results.innerHTML = `
      <p>Количество новых слов за день <span class="stats__new-words"></span></p>
      <p>Процент правильных ответов <span class="stats__percentage"></span></p>
      <p class="stats__change-text">Cамая длинная серия правильных ответов <span class="stats__long-serie"></span></p>
    `;
    const newWords = results.querySelector('.stats__new-words') as HTMLElement;
    this.newWords = newWords;
    const percentage = results.querySelector('.stats__percentage') as HTMLElement;
    this.percentage = percentage;
    const longSerie = results.querySelector('.stats__long-serie') as HTMLElement;
    this.longSerie = longSerie;
    statsContainer.append(results);
  }

  static clearDayStats() {
    console.log('Clear Stats');
    console.log(state.todayDate);
    for (const key in state.statsData) {
      state.statsData[key] = 0;
    }
  }
}

export default StatsPage;
