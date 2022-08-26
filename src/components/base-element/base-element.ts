class BaseElement {
  private elementType: string;
  private styles: string[];
  public element: HTMLElement;

  constructor(elementType: string, styles: string[] = []) {
    this.elementType = elementType;
    this.styles = styles;
    this.element = document.createElement(this.elementType);
    this.element.className = this.styles.join(' ');
  }
}

export default BaseElement;
