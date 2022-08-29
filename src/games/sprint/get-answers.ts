import { apiStrings } from '../../components/store/constants';
import { ICard, ISprintAnswer } from '../../components/types/interfaces';

class GetSprintAnswers {
  answers: ISprintAnswer[] = [];
  numberOfSets: number;
  numberOfPages: number;
  constructor(groupId: number, numberOfSets: number, numberOfPages: number) {
    this.numberOfSets = numberOfSets;
    this.numberOfPages = numberOfPages;
    const pagesSet = this.createPagesSet();
    pagesSet.forEach(async (page) => {
      try {
        const response = await fetch(`${apiStrings.API_ADDRESS}${apiStrings.API_WORDS}?page=${page}&group=${groupId}`);
        const data = await response.json();
        const dataWords: ISprintAnswer[] = data.map((item: ICard) => {
          return {
            englishWord: item.word,
            russianWord: item.wordTranslate,
          };
        });
        dataWords.forEach((word) => {
          console.log(word);
          this.answers.push(word);
        });
      } catch (err) {
        console.log('this is an error' + err);
      }
    });
  }

  private createPagesSet() {
    const pagesSets = new Set();
    while (pagesSets.size < this.numberOfSets) {
      pagesSets.add(Math.floor(Math.random() * this.numberOfPages));
    }
    return [...pagesSets];
  }
}

export default GetSprintAnswers;
