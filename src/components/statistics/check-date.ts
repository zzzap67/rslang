import { state } from '../store/state';
import StatsPage from './stats-page';

class CheckDate {
  static checkDate() {
    const dateNow = new Date();
    const todayDay = dateNow.toLocaleDateString();
    if (state.todayDate !== todayDay) {
      StatsPage.clearDayStats();
      state.todayDate = todayDay;
    }
  }
}

export default CheckDate;
