import BaseElement from '../../base-element/base-element';
import '../sections.scss';

class TeamSection {
  public teamSectionElement: HTMLElement;

  constructor() {
    const projectSection = new BaseElement('section', ['section', 'section-team']).element;
    projectSection.innerHTML = `
    <div class="section__wrapper">
            <h2 class="section__h2 section-team__h2">Команда</h2>
            <div class="section__cards-wrapper section-team__cards-wrapper">
                <div class="card__member">
                    <div class="card__photo photo__berillo"></div>
                    <h4 class="section__h4 card__member-name">Алексей Берилло</h4>
                    <div class="section__github-wrapper">
                        <div class="github-logo"></div>
                        <a href="">zzzpa67</a>
                    </div>
                    <h4 class="section__h4 card__member-role">Разработчик</h4>
                    <ol>
                        <li><span>1. </span>Учебник</li>
                        <li><span>2. </span>Статистика</li>
                        <li><span>3. </span>Игра "Аудиовызов"</li>
                    </ol>
                </div>
                <div class="card__member">
                    <div class="card__photo photo__blinou"></div>
                    <h4 class="section__h4 card__member-name">Гавриил Блинов</h4>
                    <div class="section__github-wrapper">
                        <div class="github-logo"></div>
                        <a href="">gar7777</a>
                    </div>
                    <h4 class="section__h4 card__member-role">Разработчик</h4>
                    <ol>
                        <li><span>1. </span>Учебник</li>
                        <li><span>2. </span>Статистика</li>
                        <li><span>3. </span>Игра "Спринт"</li>
                    </ol>
                </div>
                <div class="card__member">
                    <div class="card__photo photo__korolchuk"></div>
                    <h4 class="section__h4 card__member-name">Ксения Корольчук</h4>
                    <div class="section__github-wrapper">
                        <div class="github-logo"></div>
                        <a href="">kseniya-korolchuk</a>
                    </div>
                    <h4 class="section__h4 card__member-role">Разработчик</h4>
                    <ol>
                        <li><span>1. </span>Учебник</li>
                        <li><span>2. </span>Верстка, дизайн</li>
                    </ol>
                </div>
            </div>
        </div>
    `;
    this.teamSectionElement = projectSection;
  }
}

export default TeamSection;
