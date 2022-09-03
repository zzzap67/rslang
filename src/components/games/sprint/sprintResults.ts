import BaseElement from '../../base-element/base-element';
import ClosePopupButton from '../../buttons/close-popup-button';
import GameStartScreen from '../../games/gameStartScreen';
import Overlay from '../../overlay/overlay';
import { state } from '../../store/state';
import { ISprintAnswer } from '../../types/interfaces';
import SendStats from '../send-stats';
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
    const { overlay, container } = this.getStats(correctAnswers, wrongAnswers);
    sprintStatsButton?.addEventListener('click', () => this.showStats(overlay, container));
  }

  private chooseLevel() {
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    mainContainer.innerHTML = '';
    mainContainer?.append(new GameStartScreen('sprint').startScrElement);
  }

  private startNewSprint(groupId: number) {
    new Sprint(groupId, state.page);
  }

  private getStats(correctAnswers: ISprintAnswer[], wrongAnswers: ISprintAnswer[]) {
    const sendResults: Array<{ wordId: string; result: number }> = [];
    const allWordsSumm = correctAnswers.length + wrongAnswers.length;
    const resultContainer = new BaseElement('div', ['sprint__result-container', 'popup']).element;
    const overlay = new Overlay().overlayElement;
    const closePopupButton = new ClosePopupButton().closePopubButtonElement;
    const scoreContainer = new BaseElement('h2', ['sprint__score']).element;
    const rightWrongContainer = new BaseElement('div', ['sprint__right-wrong-container']).element;
    const rightContainer = new BaseElement('div', ['call__right-container']).element;
    const rightWordsContainer = new BaseElement('div', ['sprint__words-container']).element;
    const wrongWordsContainer = new BaseElement('div', ['sprint__words-container']).element;
    const WORDS_IN_COLUMN = 20;
    const numberOfRightColumns = Math.ceil(correctAnswers.length / WORDS_IN_COLUMN);
    const numberOfWrongColumns = Math.ceil(wrongAnswers.length / WORDS_IN_COLUMN);
    rightWordsContainer.style.columnCount = numberOfRightColumns.toString();
    wrongWordsContainer.style.columnCount = numberOfWrongColumns.toString();
    const wrongContainer = new BaseElement('div', ['call__right-container']).element;
    scoreContainer.textContent = `Результат: ${correctAnswers.length} / ${allWordsSumm}`;
    if (correctAnswers.length) {
      const rWordTitle = new BaseElement('div', ['call__word', 'call__word-answers']).element;
      rWordTitle.textContent = `Правильные ответы`;
      rightContainer.append(rWordTitle);
      correctAnswers.forEach((item) => {
        const rWord = new BaseElement('div', ['sprint__result-word']).element;
        rWord.textContent = `${item.englishWord} — ${item.russianWord}`;
        rightWordsContainer.append(rWord);
        sendResults.push({ wordId: item.wordId, result: 1 });
      });
    }
    if (wrongAnswers.length) {
      const rWordTitleWrong = new BaseElement('div', ['call__word', 'call__word-answers']).element;
      rWordTitleWrong.textContent = `Неправильные ответы`;
      wrongContainer.append(rWordTitleWrong);
      wrongAnswers.forEach((item) => {
        const rWord = new BaseElement('div', ['sprint__result-word', 'call__word-wrong']).element;
        rWord.textContent = `${item.englishWord} — ${item.russianWord}`;
        wrongWordsContainer.append(rWord);
        sendResults.push({ wordId: item.wordId, result: 0 });
      });
    }

    SendStats.sendStats(JSON.stringify({ gameName: 'Sprint', results: sendResults }));

    rightContainer.append(rightWordsContainer);
    wrongContainer.append(wrongWordsContainer);
    rightWrongContainer.append(rightContainer, wrongContainer);
    resultContainer.append(closePopupButton, scoreContainer, rightWrongContainer);

    return {
      overlay: overlay,
      container: resultContainer,
    };
  }

  private showStats(overlay: HTMLElement, container: HTMLElement) {
    document.body.append(overlay, container);
  }
}

export default SprintResults;
