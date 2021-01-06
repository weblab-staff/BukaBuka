import { validationResult } from 'express-validator';
import type { Request, Response, NextFunction } from 'express';

/**
 * Wrapper around the express validator module. Assumes that
 * a previous middleware has enforced requirements defined using
 * express-validator.
 * Example usage:
 * ```typescript
 * import { body } from 'express-validator';
 * const nameRequirement = body('name').exists().isString();
 * const validateName = [nameRequirement];
 *
 * router.post("/name", validateName, validate, (req, res) => {
 *  ...
 *  const name = req.body.name; // Guaranteed to exist and be a string.
 *  ...
 * });
 *
 * ```
 * @param req
 * @param res
 * @param next
 */
const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).send({ error: errors.array() });
  } else {
    next();
  }
};

export default validate;
