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
                    <div class="card__photo"></div>
                    <h4 class="card__member-name">Zzzap67</h4>
                    <h4 class="card__member-role">Team-lead</h4>
                </div>
                <div class="card__member">
                    <div class="card__photo"></div>
                    <h4 class="card__member-name">Gar7777</h4>
                    <h4 class="card__member-role">Developer</h4>
                </div>
                <div class="card__member">
                    <div class="card__photo"></div>
                    <h4 class="card__member-name">Redwood</h4>
                    <h4 class="card__member-role">Designer</h4>
                </div>
            </div>
        </div>
    `;
    this.teamSectionElement = projectSection;
  }
}

export default TeamSection;
