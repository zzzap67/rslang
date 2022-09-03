import StatsPage from './stats-page';

class AudioCallStats extends StatsPage {
  constructor(statsContainer: HTMLElement) {
    super(statsContainer);
    statsContainer.append('Аудиовызов');
  }
}

export default AudioCallStats;
