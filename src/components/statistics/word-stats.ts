import StatsPage from './stats-page';

class WordStats extends StatsPage {
  constructor(statsContainer: HTMLElement) {
    super(statsContainer);
    statsContainer.append('Изученный слова');
  }
}

export default WordStats;
