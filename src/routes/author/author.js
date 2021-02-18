const express = require("express");
const mongoose = require("mongoose");
const Author = require("./authorSchema");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { authentica, authorization } = require("../../weapons/AuthTools");

const route = express.Router();

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.ID_CLIENT,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: process.env.CALLBACKURL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      // console.log("The profile----->", profile);
      newUser = {
        googleId: profile.id,
        name: profile.name.givenName,
        surname: profile.name.familyName,
        email: profile.emails[0].value,
        role: "User",
        refreshToken: [],
      };

      try {
        const user = await Author.findOne({ googleId: profile.id });
        if (user) {
          const tokens = await authentica(user._id);
          next(null, { user, tokens });
        } else {
          const createNewUser = new Author(newUser);
          const newUserC = await createNewUser.save();

          console.log(newUserC);

          const tokens = await authentica(newUserC._id);
          next(null, { user: newUserC, tokens });
        }
      } catch (error) {
        next(error);
      }
    }
  )
);

passport.serializeUser(function (user, next) {
  next(null, user);
});

route.get(
  "/googleLogin",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

route.get(
  "/googleRedirect",
  passport.authenticate("google"),
  async (req, res, next) => {
    res.send("ok");
  }
);

route.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const author = await Author.findByCredentials(email, password);

    if (!author) throw new Error("YOU NEED TO CREATE A USER");

    const token = await authentica(author);

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
