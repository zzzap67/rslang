import Header from '../header/header';
import MainContainer from '../main-container/main-container';

class App {
  private container: HTMLElement;

  constructor() {
    this.container = document.body;
  }

  start() {
    this.container.append(new Header().headerElement, new MainContainer().mainContainerElement);
  }
}
export default App;
