import config from '../../config';

const HAPPINESS_FACTOR = config.happinessFactor;
const DEFAULT_HAPPINESS = config.defaultHappiness;
const MIN_HAPPINESS = 0.01;
class Happiness {
  private happiness: number;
  private questionCount: number;

  constructor(happiness?: number, questionCount?: number) {
    this.happiness = happiness || DEFAULT_HAPPINESS;
    if (this.happiness < MIN_HAPPINESS) {
      this.happiness = MIN_HAPPINESS;
    }
    this.questionCount = questionCount || 0;
  }

  getHappiness(): number {
    return this.happiness;
  }

  /**
   * Overrides the current happiness.
   * @param desiredHappiness
   */
  forceHappiness(desiredHappiness: number): void {
    if (desiredHappiness > 1) {
      this.happiness = 1;
    } else if (desiredHappiness < 0) {
      this.happiness = 0;
    } else {
      this.happiness = desiredHappiness;
    }
  }
  /**
   * This method assumes its called once per minute.
   * @param updatedQuestionCount
   */
  calculateHappiness(updatedQuestionCount: number): number {
    const engagement = updatedQuestionCount - this.questionCount;
    this.questionCount = updatedQuestionCount;
    if (engagement === 0) {
      this.decreaseHappiness();
    } else {
      this.increaseHappiness(engagement);
    }
    return this.happiness;
  }

  private increaseHappiness(engagement: number) {
    this.happiness += engagement * HAPPINESS_FACTOR;
    if (this.happiness > 1) {
      this.happiness = 1;
    }
  }

  private decreaseHappiness() {
    this.happiness -= this.happiness * HAPPINESS_FACTOR;
    if (this.happiness <= MIN_HAPPINESS) {
      this.happiness = MIN_HAPPINESS; // Let's make sure buka buka has a will to live.
    }
  }
}

export default Happiness;
