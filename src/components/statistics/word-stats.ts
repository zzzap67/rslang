import { state } from '../store/state';
import StatsPage from './stats-page';

class WordStats extends StatsPage {
  constructor(statsContainer: HTMLElement) {
    super(statsContainer);
    const studiedWordsContainer = statsContainer.querySelector('.stats__change-text') as HTMLElement;
    studiedWordsContainer.innerHTML =
      '<p class="stats__change-text">Количество изученных слов за день <span class="stats__studied-words"></span></p>';
    const studiedWords = studiedWordsContainer.querySelector('.stats__studied-words') as HTMLElement;
    studiedWords.textContent = state.statsData.dayStudiedWords.toString();
    const commonPercentage = Math.round((state.statsData.audioCallPercentage + state.statsData.sprintPercentage) / 2);
    this.percentage.textContent = commonPercentage.toString();
    const commonNewWords = state.statsData.audioCallNewWords + state.statsData.sprintNewWords;
    this.newWords.textContent = commonNewWords.toString();
  }
}

export default WordStats;
