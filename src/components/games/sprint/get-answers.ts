import { apiStrings } from '../../store/constants';
import { ICard, ISprintAnswer } from '../../types/interfaces';

class GetSprintAnswers {
  answers: ISprintAnswer[] = [];
  numberOfSets: number;
  numberOfPages: number;
  constructor(groupId: number, numberOfSets: number, numberOfPages: number) {
    this.numberOfSets = numberOfSets;
    this.numberOfPages = numberOfPages;
    const pagesSet = this.createPagesSet();
    // pagesSet.forEach(async (page) => {
    //   try {
    //     const response = await fetch(`${apiStrings.API_ADDRESS}${apiStrings.API_WORDS}?page=${page}&group=${groupId}`);
    //     const data = await response.json();
    //     const dataWords: ISprintAnswer[] = data.map((item: ICard) => {
    //       return {
    //         englishWord: item.word,
    //         russianWord: item.wordTranslate,
    //       };
    //     });
    //     dataWords.forEach((word) => {
    //       answers.push(word);
    //     });
    //   } catch (err) {
    //     console.log('this is an error' + err);
    //   }
    // });
    this.getAnswers(pagesSet, groupId).then((answers) => {
      this.answers = answers;
    });
  }

  async getAnswers(pagesSet: number[], groupId: number) {
    const answers: ISprintAnswer[] = [];
    for (const page of pagesSet) {
      const response = await fetch(`${apiStrings.API_ADDRESS}${apiStrings.API_WORDS}?page=${page}&group=${groupId}`);
      const data = await response.json();
      const dataWords: ISprintAnswer[] = data.map((item: ICard) => {
        return {
          englishWord: item.word,
          russianWord: item.wordTranslate,
        };
      });
      for (const word of dataWords) {
        answers.push(word);
      }
    }
    return answers;
  }

  private createPagesSet(): number[] {
    const pagesSets: Set<number> = new Set();
    while (pagesSets.size < this.numberOfSets) {
      pagesSets.add(Math.floor(Math.random() * this.numberOfPages));
    }
    return [...pagesSets];
  }
}

export default GetSprintAnswers;
