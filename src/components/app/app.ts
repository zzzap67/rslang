import Header from '../header/header';
import MainContainer from '../main-container/main-container';
import { state } from '../store/state';

class App {
  private container: HTMLElement;

  constructor() {
    this.container = document.body;
  }

  public start(): void {
    document.addEventListener('DOMContentLoaded', this.getState);
    window.addEventListener('beforeunload', this.setState);
    this.container.append(new Header().headerElement, new MainContainer().mainContainerElement);
  }

  public getState(): void {
    const stringStateFromStorage = localStorage.getItem('state') as string;
    const stateFromStorage = JSON.parse(stringStateFromStorage);
    for (const key in state) {
      state[key] = stateFromStorage[key];
    }
    Header.printUserName();
  }

  private setState(): void {
    localStorage.setItem('state', JSON.stringify(state));
  }
}
export default App;
