//import BaseElement from '../base-element/base-element';
import CheckJwt from '../authorization/chek-jwt';
import Footer from '../footer/footer';
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
    //const wrapper = new BaseElement('div', ['wrapper']).element;
    //wrapper.append(new Header().headerElement, new MainContainer().mainContainerElement);
    this.container.append(
      new Header().headerElement,
      new MainContainer().mainContainerElement,
      new Footer().footerElement
    );
  }

  public getState(): void {
    const stringStateFromStorage = localStorage.getItem('state') as string;
    const stateFromStorage = JSON.parse(stringStateFromStorage);
    for (const key in state) {
      state[key] = stateFromStorage[key];
    }
    CheckJwt.checkJwt();
    Header.printUserName();
  }

  private setState(): void {
    localStorage.setItem('state', JSON.stringify(state));
  }
}
export default App;
