import BaseElement from '../../base-element/base-element';
import '../sections.scss';

class TeamSection {
  public teamSectionElement: HTMLElement;

  constructor() {
    const projectSection = new BaseElement('section', ['section']).element;
    projectSection.innerHTML = `
    <div class="section__wrapper">
            <h2 class="section__h2">Команда</h2>
            <div class="section__cards-wrapper section-team__cards-wrapper">
                <div class="card__member">
                    <div class="card__photo photo__berillo"></div>
                    <h4 class="section__h4 card__member-name">Алексей Берилло</h4>
                    <h4 class="section__h4 card__member-role">Team-lead</h4>
                </div>
                <div class="card__member">
                    <div class="card__photo photo__blinou"></div>
                    <h4 class="section__h4 card__member-name">Гавриил Блинов</h4>
                    <h4 class="section__h4 card__member-role">Developer</h4>
                </div>
                <div class="card__member">
                    <div class="card__photo photo__korolchuk"></div>
                    <h4 class="section__h4 card__member-name">Ксения Корольчук</h4>
                    <h4 class="section__h4 card__member-role">Designer</h4>
                </div>
            </div>
        </div>
    `;
    this.teamSectionElement = projectSection;
  }
}

export default TeamSection;
