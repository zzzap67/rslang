import './loader.scss';

import BaseElement from '../base-element/base-element';

class Loader {
  loaderElement: HTMLElement;
  loaderHTML = `<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>`;
  constructor() {
    const loaderElement = new BaseElement('div', ['lds-roller']).element;
    loaderElement.innerHTML = this.loaderHTML;
    this.loaderElement = loaderElement;
  }
}

export default Loader;
