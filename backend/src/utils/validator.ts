import {body, ValidationChain, validationResult} from "express-validator";
import {Request, Response, NextFunction} from "express";

export const loginValidator: ValidationChain[] = [
  body("email").trim().isEmail().withMessage("Email is required"),
  body("password")
    .notEmpty()
    .isLength({min: 6})
    .withMessage("Password should contain atleast 6 characters"),
];

export const signupValidator: ValidationChain[] = [
  body("name").notEmpty().withMessage("Name is required"),
  ...loginValidator,
];

export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
      const error = await validation.run(req);
      if (!error.isEmpty()) break;
    }
    const errors = validationResult(req);
    if (errors.isEmpty()) return next();
    return res.status(422).json({errors: errors.array()});
  };
};
