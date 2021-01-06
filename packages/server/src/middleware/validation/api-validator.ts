import { body } from 'express-validator';
// Requirements shared between endpoints.
const happinessRequirement = body('happiness').exists().isFloat({ min: 0.01, max: 1 });
const questionRequirement = body('question');

// Endpoint specific validation.
const postQuestionValidation = [questionRequirement];
const postHappinessValidation = [happinessRequirement];

export { postQuestionValidation, postHappinessValidation };
