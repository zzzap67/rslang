import './main-container.scss';
import BaseElement from '../base-element/base-element';

class MainContainer {
  public mainContainerElement: HTMLElement;
  private mainImg = new BaseElement('div', ['main__img']).element;
  private mainHeading = new BaseElement('div', ['main__heading']).element;
  private html = `
    <h2 class="main_h2">Learn English</h2>
    <span>with </span>
    <h1 class="main_h1">RS Lang</h1>
`;

  constructor() {
    const mainContainer = new BaseElement('main', ['main']).element;
    this.mainHeading.innerHTML = this.html;
    mainContainer.append(this.mainHeading, this.mainImg);
    this.mainContainerElement = mainContainer;
  }

  public render() {
    const mainContainer = document.querySelector('.main') as HTMLElement;
    mainContainer.innerHTML = '';
    this.mainHeading.innerHTML = this.html;
    mainContainer.append(this.mainHeading, this.mainImg);
  }
}

export default MainContainer;
