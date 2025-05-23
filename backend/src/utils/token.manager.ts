import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const createToken = (
  id: string,
  email: string,
  expiresIn: string | number = 1800,
) => {
  const payload = { email, id };
  const secret = process.env.JWT_SECRET as string;
  // const expire: string | number | undefined =
  expiresIn ?? process.env.JWT_EXPIRE_TIME;

  return jwt.sign(payload, secret);
};

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.signedCookies["auth_token"];
  if (!token || token.trim() === "") {
    return res.status(401).json({ message: "Token not received" });
  }
  return new Promise<void>((resolve, reject) => {
    return jwt.verify(token, process.env.JWT_SECRET, (err, success) => {
      if (err) {
        reject(err);
        return res.status(401).json({ message: "Unauthorized" });
      }
      resolve(success);
      res.locals.jwtData = success;
      return next();
    });
  });
};
