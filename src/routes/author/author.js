const express = require("express");
const mongoose = require("mongoose");
const Author = require("./authorSchema");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { authenticate, authorization } = require("../../weapons/AuthTools");

const route = express.Router();

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.ID_CLIENT,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACKURL,
    },
    async (request, accessToken, refreshToken, profile, next) => {
      console.log(profile);
      try {
        console.log("nothing here");
      } catch (error) {
        console.log("error");
      }
    }
  )
);

passport.serializeUser(function (user, next) {
  next(null, user);
});

route.get("/googleLogin", async (req, res, next) => {
  try {
    passport.authenticate("google", { scope: ["profile", "email"] });

    res.status(201).send("ok");
  } catch (error) {
    console.log(error);
  }
});

route.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const author = await Author.findByCredentials(email, password);

    if (!author) throw new Error("YOU NEED TO CREATE A USER");

    const token = await authenticate(author);

    res.status(200).send(token);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

route.get("/me", authorization, async (req, res, next) => {
  try {
    res.send(req.author);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

route.post("/", async (req, res, next) => {
  try {
    const newAuthor = new Author(req.body);

    const { _id } = newAuthor;

    // const token = await generateJWT({ id: _id });

    // console.log("---->", token);

    await newAuthor.save();
    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
  }
});

route.get("/", async (req, res, next) => {
  try {
    const author = await Author.find();

    res.status(201).send(author);
  } catch (error) {
    console.log(error);
  }
});

route.get("/:id", async (req, res, next) => {
  try {
    const author = await Author.findById(req.params.id);

    res.status(201).send(author);
  } catch (error) {
    console.log(error);
  }
});

route.put("/:id", async (req, res, next) => {
  try {
    const modifiedAuthor = await Author.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        runValidators: true,
        new: true,
        useFindAndModify: false,
      }
    );
    res.status(200).send(modifiedAuthor);
  } catch (error) {
    console.log(error);
  }
});

route.delete("/:id", async (req, res, next) => {
  try {
    const deletedArtic = await Author.findByIdAndDelete(req.params.id);
    res.status(200).send("DELETED");
  } catch (error) {
    console.log(error);
  }
});

module.exports = route;
