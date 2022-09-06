import './statistics.scss';
import BaseElement from '../base-element/base-element';
import Button from '../buttons/button';
import { apiStrings } from '../store/constants';
import { IUserStat } from '../types/interfaces';
import { state } from '../store/state';
// import AudioCallStats from './audiocall-stats';
// import SprintStats from './sprint-stats';
// import WordStats from './word-stats';
import CheckJwt from '../authorization/chek-jwt';
import NewWordsChart from './new-words-chart';

class Statistics {
  userStats: Array<IUserStat>;
  longStatsContainer: HTMLElement;

  constructor() {
    this.userStats = [];
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    mainContainer.innerHTML = '';
    mainContainer.style.minHeight = '100vh';
    const statsWrapper = new BaseElement('div', ['stats__wrapper']).element;
    const statsButtonsWrapper = new BaseElement('div', ['stats__buttons-wrapper']).element;
    const statsContainer = new BaseElement('div', ['stats__container']).element;
    const longStatsWrapper = new BaseElement('div', ['long-stats__wrapper']).element;
    const longStatsButtonsWrapper = new BaseElement('div', ['long-stats__buttons']).element;
    const longStatsContainer = new BaseElement('div', ['long-stats__container']).element;
    const statsButtonsNames = ['Аудиовызов', 'Спринт', 'Слова'];
    statsButtonsNames.forEach((button: string, index: number) => {
      const statsButton = new Button(button, ['stats__button']).buttonElement;
      statsButton.id = 'stat-button-' + (index + 1);
      statsButton.addEventListener('click', (e: Event) => this.handleStatsButtons(e));
      statsButtonsWrapper.append(statsButton);
    });
    const longStatsButtonsNames = ['Новые слова', 'Изученные слова'];
    longStatsButtonsNames.forEach((button: string) => {
      const longStatsButton = new Button(button, ['stats__button', 'long-stats__button']).buttonElement;
      longStatsButton.addEventListener('click', (e: Event) => this.handleLongStatsButtons(e));
      longStatsButtonsWrapper.append(longStatsButton);
    });
    statsWrapper.textContent = 'Игровая статистика за сегодня';
    mainContainer.innerHTML = '';
    longStatsWrapper.append(longStatsButtonsWrapper, longStatsContainer);
    this.longStatsContainer = longStatsContainer;
    statsWrapper.append(statsButtonsWrapper, statsContainer, longStatsWrapper);

    this.getUserStats().then(() => {
      // console.log(this.userStats);
      mainContainer.append(statsWrapper);
      this.setStats(1);
      // this.renderTutorial(cardsContainer, state.group).then(() => {
      //   // HardWordsCheck.checkHardWords();
      // });
    });
  }

  private async getUserStats(): Promise<void> {
    if (state.userId !== '') {
      const userId = state.userId;
      await CheckJwt.checkJwt();
      // const token = localStorage.getItem('currentToken');
      try {
        const response = await fetch(
          `${apiStrings.API_ADDRESS}${apiStrings.API_USERS}/${userId}${apiStrings.API_GAMESTATS}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${state.token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        );
        const status = response.status;
        if (status === 401) {
          console.log('Take your token');
        }
        const data = await response.json();
        data.forEach((item: IUserStat) => {
          this.userStats.push(item);
        });
      } catch (e) {
        const err = e as Error;
        console.log(err.name);
      }
    }
  }

  private setStats(statType: number) {
    const statsContainer = document.body.querySelector('.stats__container') as HTMLElement;
    statsContainer.innerHTML = '';

    for (let i = 1; i <= 3; i++) {
      const stButton = document.body.querySelector('#stat-button-' + i) as HTMLElement;
      statType === i ? stButton.classList.add('stats__selected') : stButton.classList.remove('stats__selected');
    }

    const dateNow = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    const todayStats = this.userStats.find((item) => item.dates === dateNow);

    if (todayStats) {
      const statsWrapper = new BaseElement('div', ['stats__bydate']).element;
      let percent = '';
      const sDate =
        todayStats.dates.slice(8, 10) + '.' + todayStats.dates.slice(5, 7) + '.' + todayStats.dates.slice(0, 4);
      switch (statType) {
        case 1:
          todayStats.totalAC > 0
            ? (percent = ((todayStats.rightAC / todayStats.totalAC) * 100).toFixed(2))
            : (percent = '0.00');
          statsWrapper.innerHTML = `${sDate} - Новых: ${todayStats.newWordAC} | Процент: ${percent}% | Самая длинная серия: ${todayStats.seriesAC}`;
          break;
        case 2:
          todayStats.totalSprint > 0
            ? (percent = ((todayStats.rightSprint / todayStats.totalSprint) * 100).toFixed(2))
            : (percent = '0.00');
          statsWrapper.innerHTML = `${sDate} - Новых: ${todayStats.newWordSprint} | Процент: ${percent}% | Самая длинная серия: ${todayStats.seriesSprint}`;
          break;
        case 3:
          todayStats.totalAC + todayStats.totalSprint > 0
            ? (percent = (
                ((todayStats.rightAC + todayStats.rightSprint) / (todayStats.totalAC + todayStats.totalSprint)) *
                100
              ).toFixed(2))
            : (percent = '0.00');
          statsWrapper.innerHTML = `${sDate} - Новых: ${todayStats.newWordAC + todayStats.newWordSprint} | Изученных: ${
            todayStats.studiedWord
          } | Процент: ${percent}%`;
          break;
      }
      statsContainer.append(statsWrapper);
    }

    console.log(todayStats);

    // this.userStats.forEach((item) => {
    //   if (item.dates) {
    //     const statsWrapper = new BaseElement('div', ['stats__bydate']).element;
    //     let percent = '';
    //     const sDate = item.dates.slice(8, 10) + '.' + item.dates.slice(5, 7) + '.' + item.dates.slice(0, 4);
    //     switch (statType) {
    //       case 1:
    //         item.totalAC > 0 ? (percent = ((item.rightAC / item.totalAC) * 100).toFixed(2)) : (percent = '0.00');
    //         statsWrapper.innerHTML = `${sDate} - Новых: ${item.newWordAC} | Процент: ${percent}% | Самая длинная серия: ${item.seriesAC}`;
    //         break;
    //       case 2:
    //         item.totalSprint > 0
    //           ? (percent = ((item.rightSprint / item.totalSprint) * 100).toFixed(2))
    //           : (percent = '0.00');
    //         statsWrapper.innerHTML = `${sDate} - Новых: ${item.newWordSprint} | Процент: ${percent}% | Самая длинная серия: ${item.seriesSprint}`;
    //         break;
    //       case 3:
    //         item.totalAC + item.totalSprint > 0
    //           ? (percent = (((item.rightAC + item.rightSprint) / (item.totalAC + item.totalSprint)) * 100).toFixed(2))
    //           : (percent = '0.00');
    //         statsWrapper.innerHTML = `${sDate} - Новых: ${item.newWordAC + item.newWordSprint} | Изученных: ${
    //           item.studiedWord
    //         } | Процент: ${percent}%`;
    //         break;
    //     }
    //     statsContainer.append(statsWrapper);
    //   }
    // });

    //statsContainer.innerHTML = 'aaaa ' + statType;
  }

  private handleStatsButtons(e: Event) {
    const target = e.target as HTMLElement;
    if (target.textContent === 'Аудиовызов') {
      // new AudioCallStats(statsContainer);
      this.setStats(1);
    }
    if (target.textContent === 'Спринт') {
      // new SprintStats(statsContainer);
      this.setStats(2);
    }
    if (target.textContent === 'Слова') {
      // new WordStats(statsContainer);
      this.setStats(3);
    }
  }

  private handleLongStatsButtons(e: Event) {
    const target = e.target as HTMLElement;
    this.longStatsContainer.innerHTML = '';
    if (target.textContent === 'Новые слова') {
      this.longStatsContainer.append(new NewWordsChart(this.userStats.slice(1), 'newWords').chartElement);
    } else if (target.textContent === 'Изученные слова') {
      this.longStatsContainer.append(new NewWordsChart(this.userStats.slice(1), 'studiedWords').chartElement);
    } else {
      return;
    }
  }
}

export default Statistics;
