import StatsPage from './stats-page';

class SprintStats extends StatsPage {
  constructor(statsContainer: HTMLElement) {
    super(statsContainer);
    statsContainer.append('Спринт');
  }
}

export default SprintStats;
