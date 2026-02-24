import { hash, compare } from "bcryptjs";

const hashPassword = async (password) => hash(password, 13);

const comparePassword = async (password, hashed) =>
  await compare(password, hashed);

export default {
  hashPassword,
  comparePassword,
};
