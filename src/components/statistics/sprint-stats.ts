import { state } from '../store/state';
import StatsPage from './stats-page';

class SprintStats extends StatsPage {
  constructor(statsContainer: HTMLElement) {
    super(statsContainer);
    this.newWords.textContent = state.statsData.sprintNewWords.toString();
    this.longSerie.textContent = state.statsData.sprintLongestSerie.toString();
    const percentage = Math.round(state.statsData.sprintPercentage).toString();
    this.percentage.textContent = percentage;
  }
}

export default SprintStats;
