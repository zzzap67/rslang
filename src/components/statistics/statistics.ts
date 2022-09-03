import BaseElement from '../base-element/base-element';

class Statistics {
  constructor() {
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    const statsWrapper = new BaseElement('div', ['stats__wrapper']).element;
    statsWrapper.textContent = 'Stats';
    mainContainer.innerHTML = '';
    mainContainer.append(statsWrapper);
  }
}

export default Statistics;
