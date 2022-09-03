import { state } from '../store/state';
import StatsPage from './stats-page';

class AudioCallStats extends StatsPage {
  constructor(statsContainer: HTMLElement) {
    super(statsContainer);
    this.newWords.textContent = state.statsData.audioCallNewWords.toString();
    this.longSerie.textContent = state.statsData.audioCallLongestSerie.toString();
    const percentage = Math.round(state.statsData.audioCallPercentage).toString();
    this.percentage.textContent = percentage;
  }
}

export default AudioCallStats;
