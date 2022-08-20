import TutorialCard from '../card/card';
import { apiStrings } from '../constants/constants';
import { state } from '../store/state';
import { ICard } from '../types/interfaces';

class Tutorial {
  constructor() {
    const mainContainer = document.body.querySelector('.main') as HTMLElement;
    mainContainer.textContent = 'Now I/m the tutorial';
    this.renderTutorial(mainContainer);
  }

  private async renderTutorial(container: HTMLElement): Promise<void> {
    const response = await fetch(
      `${apiStrings.API_ADDRESS}${apiStrings.API_WORDS}?page=${state.group}&group=${state.page}`
    );
    const data = await response.json();
    data.forEach((item: ICard) => {
      container.append(new TutorialCard(item).cardElement);
    });
  }
}

export default Tutorial;
