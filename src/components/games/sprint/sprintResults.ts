import BaseElement from '../../base-element/base-element';
import GameStartScreen from '../../games/gameStartScreen';
import { ISprintAnswer } from '../../types/interfaces';
import Sprint from './sprint';

class SprintResults {
  public resultsElement: HTMLElement;

  private resultsHtml = `
    <div class="sprint__results-field">
      <h2 class="results__h2">Твой результат: <span class="score-field">465</span> очков</h2>
      <h3 class="results__h3">Длина серии: <span class="serie-field">5</span></h3>
      <div>
        <button class="results__link sprint__one-more">Сыграть еще раз</button>
        <button class="results__link sprint__choose-level">Выбрать уровень</button>
        <button class="results__link sprint__stats">Результаты подробно</button>
      </div>

      <div class="results__circle-outer">
          <div class="results__circle-inner"></div>
          <h2 class="results__percents">67%</h2>
      </div>
      
    </div>
  `;

  constructor(
    score: number,
    maxSerie: number,
    percentage: number,
    groupId: number,
    correctAnswers: ISprintAnswer[],
    wrongAnswers: ISprintAnswer[]
  ) {
    const results = new BaseElement('div', ['sprint__main-wrapper']).element;
    results.innerHTML = this.resultsHtml;
    const scoreField = results.querySelector('.score-field') as HTMLElement;
    const serieField = results.querySelector('.serie-field') as HTMLElement;
    const percentField = results.querySelector('.results__percents') as HTMLElement;
    const percentCircle = results.querySelector('.results__circle-inner') as HTMLElement;
    scoreField.innerHTML = score.toString();
    serieField.innerHTML = maxSerie.toString();
    percentField.innerHTML = `${Math.round(percentage).toString()}%`;
    percentCircle.style.height = `${percentage}%`;
    this.resultsElement = results;
    const oneMoreButton = results.querySelector('.sprint__one-more');
    oneMoreButton?.addEventListener('click', () => this.startNewSprint(groupId));
    const chooseLevelButton = results.querySelector('.sprint__choose-level');
    chooseLevelButton?.addEventListener('click', this.chooseLevel);
    const sprintStatsButton = results.querySelector('.sprint__stats');
    sprintStatsButton?.addEventListener('click', () => this.showStats(correctAnswers, wrongAnswers));
  }

  private chooseLevel() {
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    mainContainer.innerHTML = '';
    mainContainer?.append(new GameStartScreen('sprint').startScrElement);
  }

  private startNewSprint(groupId: number) {
    console.log('wheres my sprint');
    new Sprint(groupId, -1);
  }

  private showStats(correctAnswers: ISprintAnswer[], wrongAnswers: ISprintAnswer[]) {
    console.log(correctAnswers);
    console.log(wrongAnswers);
  }
}

export default SprintResults;
