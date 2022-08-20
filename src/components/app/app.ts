import Header from '../header/header';

class App {
  private container: HTMLElement;

  constructor() {
    this.container = document.body;
  }

  start() {
    new Header();
  }
}
export default App;
