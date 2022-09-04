import './main-container.scss';
import BaseElement from '../base-element/base-element';
import ProjectSection from '../sections/section-project/section-project';
import TeamSection from '../sections/section-team/section-team';
import LogoSection from '../sections/section-logo/section-logo';

class MainContainer {
  public mainContainerElement: HTMLElement;
  private mainContainer = new BaseElement('main', ['main']).element;
  private mainImg = new BaseElement('div', ['main__img']).element;
  private mainHeading = new BaseElement('div', ['main__heading']).element;
  private html = `
    <h2 class="main_h2">Learn English</h2>
    <span>with </span>
    <h1 class="main_h1">RS Lang</h1>
    <div class="intro-container">
      <h3 style="font-size: 2rem; font-weight: 500">Приложение для изучения английских слов<br><br><br><br><br><br></h3>
    <div>
`;

  constructor() {
    const mainWrapper = new BaseElement('div', ['main__wrapper']).element;
    this.mainHeading.innerHTML = this.html;
    mainWrapper.append(
      this.mainHeading,
      this.mainImg,
      new LogoSection().logoSectionElement,
      new ProjectSection().projectSectionElement,
      new TeamSection().teamSectionElement
    );
    this.mainContainer.append(mainWrapper);
    this.mainContainerElement = this.mainContainer;
  }

  public render() {
    //Use the next syntax for inline background images
    document.body.style.backgroundImage = 'url(' + require('../../assets/images/bg-beige.png') + ')';
    const mainContainer = document.querySelector('.main') as HTMLElement;
    this.mainContainer.style.height = '100%';
    mainContainer.innerHTML = '';
    this.mainHeading.innerHTML = this.html;
    const mainWrapper = new BaseElement('div', ['main__wrapper']).element;
    mainWrapper.append(
      this.mainHeading,
      this.mainImg,
      new LogoSection().logoSectionElement,
      new ProjectSection().projectSectionElement,
      new TeamSection().teamSectionElement
    );
    mainContainer.append(mainWrapper);
  }
}

export default MainContainer;
