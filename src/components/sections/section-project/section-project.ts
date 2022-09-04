import BaseElement from '../../base-element/base-element';
import '../sections.scss';

class ProjectSection {
  public projectSectionElement: HTMLElement;

  constructor() {
    const projectSection = new BaseElement('section', ['section']).element;
    const learnText = `Наше приложение поможет тебе быстро и легко изучить основные английские слова. 
    Ты можешь побродить по Учебнику, который разбит на шесть групп от простых слов к сложным. 
    Каждая группа состоит из 30 страниц по 20 слов.`;
    const memorizeText = `Любое слово можно отметить как Сложное, 
    тогда оно появится на странице сложных слов, и его можно будет изучить более внимательно. 
    Если слово тебе уже знакомо, пометь его как Изученное. 
    Если все слова на странице изучены, RSLang выделит эту страницу.`;
    const playText = `Когда тебе наскучит изучать словарь, ты можешь сыграть в игры: Аудиовызов или Спринт`;
    const analyseText = `Если ты будешь уверенно отгадывать сложное слово, 
    оно станет изученным и пропадет со страницы сложных слов. 
    Ты также можешь посмотреть страницу Статистики и увидеть свой прогресс.
    Успехов в изучении английского!`;

    projectSection.innerHTML = `
      <div class="section__wrapper">
        <h2 id="about" class="section__h2 section-project__h2">
            О приложении
        </h2>
        <div class="section__cards-wrapper">
            <div class="section__card">
                <h3 class="section__h3">Изучай</h3>
                <div class="section__card-text">${learnText}</div>
            </div>
            <div class="section__card">
                <h3 class="section__h3">Запоминай</h3>
                <div class="section__card-text">${memorizeText}</div>
            </div>
            <div class="section__card">
                <h3 class="section__h3">Играй</h3>
                <div class="section__card-text">${playText}</div>
            </div>
            <div class="section__card">
                <h3 class="section__h3">Анализируй</h3>
                <div class="section__card-text">${analyseText}</div>
            </div>
        </div>
      </div>`;

    this.projectSectionElement = projectSection;
  }
}

export default ProjectSection;
