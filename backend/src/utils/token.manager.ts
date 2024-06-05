import jwt from "jsonwebtoken";

export const createToken = (
  id: string,
  email: string,
  expiresIn?: string | number,
) => {
  const payload = { email, id };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiresIn || process.env.JWT_EXPIRE_TIME,
  });
};
