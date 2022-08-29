import BaseElement from '../../base-element/base-element';

class Timer {
  public timerElement: HTMLElement;

  private timerHtml = `
  <h2>time</h2>
    <svg class="sprint__timer-svg" xmlns="http://www.w3.org/2000/svg">
      <circle id="circle" class="circle_animation" r="46" cy="51" cx="51" stroke-width="4" stroke="#6fdb6f" fill="none"/>
    </svg>
  `;

  constructor() {
    const baseTimer = new BaseElement('div', ['base-timer']).element;
    baseTimer.innerHTML = this.timerHtml;
    this.timerElement = baseTimer;
  }
}

export default Timer;
