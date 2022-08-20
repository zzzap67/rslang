import BaseElement from '../base-element/base-element';

class MainContainer {
  public mainContainerElement: HTMLElement;
  constructor() {
    const mainContainer = new BaseElement('main', ['main']).element;
    // TODO: change content of the container
    mainContainer.textContent = 'This is the main container';
    this.mainContainerElement = mainContainer;
  }
}

export default MainContainer;
