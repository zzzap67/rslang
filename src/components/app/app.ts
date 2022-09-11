import CheckJwt from '../authorization/chek-jwt';
import BaseElement from '../base-element/base-element';
import Footer from '../footer/footer';
import GameStartScreen from '../games/gameStartScreen';
import Header from '../header/header';
import MainContainer from '../main-container/main-container';
import CheckDate from '../statistics/check-date';
import Statistics from '../statistics/statistics';
import { state } from '../store/state';
import Tutorial from '../tutorial/tutorial';

class App {
  private container: HTMLElement;

  constructor() {
    this.container = document.body;
  }

  public async start(): Promise<void> {
    this.getState();
    await CheckJwt.checkJwt();
    CheckDate.checkDate();
    window.addEventListener('beforeunload', this.setState);

    const mainContainer = new BaseElement('main', ['main']).element;

    this.container.append(new Header().headerElement, mainContainer, new Footer().footerElement);
    switch (state.currentPage) {
      case 'main':
        mainContainer.innerHTML = '';
        mainContainer.append(new MainContainer().mainContainerElement);
        break;

      case 'tutorial':
        new Tutorial();
        break;

      case 'sprint':
        mainContainer.innerHTML = '';
        mainContainer.append(new GameStartScreen('sprint').startScrElement);
        break;

      case 'audioCall':
        mainContainer.innerHTML = '';
        mainContainer.append(new GameStartScreen('audioCall').startScrElement);
        break;

      case 'statistics':
        new Statistics();
        break;
    }
  }

  public getState(): void {
    const stringStateFromStorage = localStorage.getItem('state') as string;
    const stateFromStorage = JSON.parse(stringStateFromStorage);
    for (const key in state) {
      state[key] = stateFromStorage[key];
    }
  }

  private setState(): void {
    localStorage.setItem('state', JSON.stringify(state));
  }
}
export default App;
