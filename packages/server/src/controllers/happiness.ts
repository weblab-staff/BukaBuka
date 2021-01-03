import config from '../config';

const EXPECTED_QUESTIONS_PER_MIN = config.expectedQuestionsPerMin;
const HAPPINESS_FACTOR = config.happinessFactor;
const DEFAULT_HAPPINESS = config.defaultHappiness;

class Happiness {
  private happiness = DEFAULT_HAPPINESS;
  private questionCount = 0;

  getHappiness(): number {
    return this.happiness;
  }

  /**
   * Overrides the current happiness.
   * @param desiredHappiness 
   */
  forceHappiness(desiredHappiness: number): void {
    this.happiness = desiredHappiness;
  }
  /**
   * This method assumes its called once per minute.
   * @param updatedQuestionCount
   */
  calculateHappiness(updatedQuestionCount: number): number {
    const engagement = updatedQuestionCount - this.questionCount;
    this.questionCount = updatedQuestionCount;

    if (engagement >= EXPECTED_QUESTIONS_PER_MIN) {
      this.increaseHappiness();
    } else {
      this.decreaseHappiness();
    }
    return this.happiness;
  }

  private increaseHappiness() {
    this.happiness =  this.happiness * HAPPINESS_FACTOR;
  }

  private decreaseHappiness() {
    this.happiness = this.happiness * (1-HAPPINESS_FACTOR);
  }
}

export default Happiness;
