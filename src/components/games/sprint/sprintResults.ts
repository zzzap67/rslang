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
    const outerResultContainer = this.resultsElement.querySelector('.results__circle-outer') as HTMLElement;
    outerResultContainer.innerHTML = '';
    const allWordsSumm = correctAnswers.length + wrongAnswers.length;

    const resultContainer = new BaseElement('div', ['call__result-container']).element;

    const scoreContainer = new BaseElement('h2', ['call__score']).element; //'div', ['call__groups-container']
    const rightContainer = new BaseElement('div', ['call__right-container']).element;
    // const buttonsContainer = new BaseElement('div', ['call__groups-container']).element;

    scoreContainer.textContent = `Результат: ${correctAnswers.length} / ${allWordsSumm}`;
    const rWordTitle = new BaseElement('div', ['call__word', 'call__word-answers']).element;
    rWordTitle.textContent = `Правильные ответы`;
    rightContainer.append(rWordTitle);
    correctAnswers.forEach((item) => {
      const rWord = new BaseElement('div', ['call__word']).element;
      rWord.textContent = `${item.russianWord} - ${item.englishWord}`;
      // rWord.dataset.level = item.toString();
      // rWord.addEventListener('click', this.wordSound);
      rightContainer.append(rWord);
    });

    const rWordTitleWrong = new BaseElement('div', ['call__word', 'call__word-answers']).element;
    rWordTitleWrong.textContent = `Неправильные ответы`;
    rightContainer.append(rWordTitleWrong);
    wrongAnswers.forEach((item) => {
      const rWord = new BaseElement('div', ['call__word', 'call__word-wrong']).element;
      rWord.textContent = `${item.russianWord} - ${item.englishWord}`;
      // rWord.dataset.level = index.toString();
      // rWord.addEventListener('click', this.wordSound);
      rightContainer.append(rWord);
    });

    // const buttonRestart = new Button('Начать заново', ['call__level-btn']).buttonElement;
    // buttonRestart.id = 'restart-button-1';
    // buttonRestart.addEventListener('click', this.restart);
    // buttonsContainer.append(buttonRestart);

    // const buttonReselect = new Button('Выбрать уровень', ['call__level-btn']).buttonElement;
    // buttonReselect.id = 'restart-button-2';
    // buttonReselect.addEventListener('click', this.restart);
    // buttonsContainer.append(buttonReselect);

    resultContainer.append(scoreContainer, rightContainer);

    outerResultContainer.remove();
    this.resultsElement.append(resultContainer);
  }
}

export default SprintResults;
