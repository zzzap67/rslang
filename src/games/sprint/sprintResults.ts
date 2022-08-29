import BaseElement from '../../components/base-element/base-element';
import GameStartScreen from '../gameStartScreen';

class SprintResults {
  public resultsElement: HTMLElement;

  private resultsHtml = `
    <div class="sprint__results-field">
      <h3 class="results__h3">Твой результат <span class="score-field">465</span> очков</h3>
      <h4 class="results__h2">Длина серии <span class="serie-field">5</span></h4>
      <div class="results__circle-outer">
          <div class="results__circle-inner"></div>
          <h2 class="results__percents">67%</h2>
      </div>
      <h3 class="results__link">Сыграть еще раз</h3>
    </div>
  `;

  constructor(score: number, maxSerie: number, percentage: number) {
    const results = new BaseElement('div', ['sprint__main-wrapper']).element;
    results.innerHTML = this.resultsHtml;
    const scoreField = results.querySelector('.score-field') as HTMLElement;
    const serieField = results.querySelector('.serie-field') as HTMLElement;
    const percentField = results.querySelector('.results__percents') as HTMLElement;
    const percentCircle = results.querySelector('.results__circle-inner') as HTMLElement;
    scoreField.innerHTML = score.toString();
    serieField.innerHTML = maxSerie.toString();
    percentField.innerHTML = Math.round(percentage).toString();
    percentCircle.style.height = `${percentage}%`;
    this.resultsElement = results;
    const oneMoreTimeButton = results.querySelector('.results__link');
    oneMoreTimeButton?.addEventListener('click', this.newGame, { once: true });
  }

  private newGame() {
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    mainContainer.innerHTML = '';
    mainContainer?.append(new GameStartScreen('sprint').startScrElement);
  }
}

export default SprintResults;
