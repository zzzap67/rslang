import CheckJwt from '../authorization/chek-jwt';
import Footer from '../footer/footer';
import GameStartScreen from '../games/gameStartScreen';
import Header from '../header/header';
import MainContainer from '../main-container/main-container';
import Statistics from '../statistics/statistics';
import { state } from '../store/state';
import Tutorial from '../tutorial/tutorial';

class App {
  private container: HTMLElement;

  constructor() {
    this.container = document.body;
  }

  public start(): void {
    this.getState();
    // document.addEventListener('DOMContentLoaded', this.getState);
    window.addEventListener('beforeunload', this.setState);
    //const wrapper = new BaseElement('div', ['wrapper']).element;
    //wrapper.append(new Header().headerElement, new MainContainer().mainContainerElement);

    this.container.append(new Header().headerElement, new MainContainer().mainContainerElement);
    switch (state.currentPage) {
      case 'main':
        this.container.append(new MainContainer().mainContainerElement);
        break;

      case 'tutorial':
        new Tutorial();
        break;

      case 'sprint':
        new GameStartScreen('sprint');
        break;

      case 'audioCall':
        new GameStartScreen('audioCall');
        break;

      case 'statistics':
        new Statistics();
        break;
    }
    this.container.append(new Footer().footerElement);
  }

  public getState(): void {
    const stringStateFromStorage = localStorage.getItem('state') as string;
    const stateFromStorage = JSON.parse(stringStateFromStorage);
    for (const key in state) {
      state[key] = stateFromStorage[key];
    }
    CheckJwt.checkJwt();
    // Header.printUserName();
  }

  private setState(): void {
    localStorage.setItem('state', JSON.stringify(state));
  }
}
export default App;
