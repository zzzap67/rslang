import './main-container.scss';
import BaseElement from '../base-element/base-element';

class MainContainer {
  public mainContainerElement: HTMLElement;
  constructor() {
    const mainContainer = new BaseElement('main', ['main']).element;
    const mainImg = new BaseElement('div', ['main__img']).element;
    const mainHeading = new BaseElement('div', ['main__heading']).element;
    mainHeading.innerHTML = `
        <h2 class="main_h2">Learn English</h2>
        <span>with </span>
        <h1 class="main_h1">RS Lang</h1>
    `;
    // TODO: change content of the container
    mainContainer.append(mainHeading, mainImg);
    this.mainContainerElement = mainContainer;
  }
}

export default MainContainer;
