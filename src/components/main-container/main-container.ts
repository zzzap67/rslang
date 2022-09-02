import './main-container.scss';
import BaseElement from '../base-element/base-element';

class MainContainer {
  public mainContainerElement: HTMLElement;
  private mainWrapper = new BaseElement('div', ['main__wrapper']).element;
  private mainImg = new BaseElement('div', ['main__img']).element;
  private mainHeading = new BaseElement('div', ['main__heading']).element;
  private html = `
    <h2 class="main_h2">Learn English</h2>
    <span>with </span>
    <h1 class="main_h1">RS Lang</h1>
    <div class="intro-container">
      <p class="intro-text">Наше приложение поможет тебе быстро и легко изучить основные английские слова. Ты можешь побродить по <strong>Учебнику</strong>, который разбит на шесть групп от простых слов к сложным. В каждой группе имеется 30 страниц по 20 слов. Любое слово можно отметить как <strong>Сложное</strong>, тогда оно появится на странице сложных слов, и его можно будет изучить более внимательно. Если слово тебе уже знакомо, пометь его как <strong>Изученное</strong>. Если все слова на странице изучены, RSLang выделит эту страницу. Когда тебе наскучит изучать словарь, ты можешь сыграть в игры: <strong>Аудиовызов</strong> или <strong>Спринт</strong>. Если сложное слово ты будешь уверенно отгадывать, оно станет изученным и пропадет со страницы сложных слов. Ты также можешь изучить страницу <strong>Статистики</strong> и увидеть свой прогресс.
      </p>
      <p class="intro-text">
      Успехов в изучении английского!
      </p>
    <div>
`;

  constructor() {
    const mainContainer = new BaseElement('main', ['main']).element;
    this.mainHeading.innerHTML = this.html;
    this.mainWrapper.append(this.mainHeading, this.mainImg);
    mainContainer.append(this.mainWrapper);
    this.mainContainerElement = mainContainer;
  }

  public render() {
    //Use the next syntax for inline background images
    document.body.style.backgroundImage = 'url(' + require('../../assets/images/bg-beige.png') + ')';
    document.body.style.backgroundSize = '100%';
    const mainContainer = document.querySelector('.main') as HTMLElement;
    mainContainer.innerHTML = '';
    this.mainHeading.innerHTML = this.html;
    mainContainer.append(this.mainWrapper);
  }
}

export default MainContainer;
