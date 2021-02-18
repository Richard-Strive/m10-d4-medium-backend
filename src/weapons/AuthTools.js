const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Author = require("../routes/author/authorSchema");

const generateJWT = (payload) =>
  new Promise((res, rej) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) rej(err);
        res(token);
      }
    )
  );

const verifyJWT = (token) =>
  new Promise((res, rej) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) rej(err);
      res(decoded);
    })
  );

const authenticate = async (Author) => {
  try {
    const token = await generateJWT({ _id: Author._id });
    Author.token = token;
    await Author.save();
    return token;
    console.log(Author.token);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const authorization = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = await verifyJWT(token);
    console.log(decoded._id);

    const author = await Author.findOne({ _id: decoded._id });

    if (!author) {
      throw new Error("No author found");
    }

    console.log(token);
    req.token = token;
    req.author = author;
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

module.exports = { authenticate, verifyJWT, authorization };
