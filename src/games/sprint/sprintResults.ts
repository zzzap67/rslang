import BaseElement from '../../components/base-element/base-element';

class SprintResults {
  public resultsElement: HTMLElement;

  private resultsHtml = `
    <div class="sprint__results-field">
      <h3 class="results__h3">Твой результат <span>465</span> очков</h3>
      <h4 class="results__h2">Длина серии <span>5</span></h4>
      <div class="results__circle-outer">
          <div class="results__circle-inner"></div>
          <h2 class="results__percents">67%</h2>
      </div>
      <h3 class="results__link">Сыграть еще раз</h3>
    </div>
  `;

  constructor() {
    const results = new BaseElement('div', ['sprint__main-wrapper']).element;
    results.innerHTML = this.resultsHtml;
    this.resultsElement = results;
  }
}

export default SprintResults;
