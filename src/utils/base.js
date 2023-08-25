import sanitize from "mongo-sanitize";
import randomString from "randomstring";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import redis from "../config/redis";

dotenv.config();

// to-do : remove synchronous codes where unnecessary

const purify = async function (data) {
  return sanitize(data);
};

const hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const validatePassword = async function (reqPassword, userPassword) {
  const isValid = await bcrypt.compare(reqPassword, userPassword);
  if (isValid) return true;
  return false;
};

const generatePassword = async function () {
  return randomString.generate(10);
};

const generateResetToken = async function () {
  let generatedToken = randomString.generate({
    length: 6,
    charset: "numeric",
  });
  return generatedToken;
};

const generateVerificationToken = async function () {
  let generatedToken = randomString.generate({
    length: 6,
    charset: "numeric",
  });
  return generatedToken;
};


const saveVerificationToken = async function (token, email) {
  await redis.set(token, email, "EX", 300)
};

const decodeVerificationToken = async function (token) {
  const user = await redis.get(token)
  return user;
};

const generatePasswordResetLink = async function (userId) {
  const resetToken = jwt.sign(
    { userId, tokenType: "passwordreset" },
    process.env.JWT_SECRET,
    {
      expiresIn: "15 minutes",
    }
  );
  const resetLink = `${process.env.FRONTEND_URL}/Auth/Reset/${resetToken}`;
  return resetLink;
};

const getIdfromToken = async function (token) {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return decodedToken.userId;
};

const decodeToken = async function (token) {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  return decodedToken;
};



const titleCased = function (word) {
  return word.replace(word.charAt(0), word.charAt(0).toUpperCase());
}

export {
  purify,
  hashPassword,
  validatePassword,
  generatePassword,
  generateResetToken,
  saveVerificationToken,
  generatePasswordResetLink,
  getIdfromToken,
  decodeToken,
  titleCased,
  generateVerificationToken,
  decodeVerificationToken
};
