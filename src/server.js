const express = require("express");
const mongoose = require("mongoose");
const listEndpoints = require("express-list-endpoints");
const passport = require("passport");

const cors = require("cors");
require("dotenv").config();

const {
  badRequestHandler,
  unauthorizedHandler,
  frobiddenHandler,
  notFoundHandler,
  catchAllErrorHandler,
} = require("./problematicRoutes/errorHandling.js");

const articleRoute = require("./routes/article.js");
const authorRoute = require("./routes/author/author");

const server = express();

const whitelist = ["localhost3000"];

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by Richard Cors"));
    }
  },
  credentials: true,
};
// RIVEDERE LA LEZIONE SU CORS <------------------------

server.use(passport.initialize());
server.use(cors(corsOptions));

const port = process.env.PORT || 5001;

server.use(express.json());
server.use("/articles", articleRoute);
server.use("/authors", authorRoute);

/*<---------
mettere qui gli endpoints con la sintassi e.g:
server.use("/exam", submit)
server.use("/exam", examScore)
----------->*/

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(frobiddenHandler);
server.use(notFoundHandler);
server.use(catchAllErrorHandler);

mongoose
  .connect(process.env.MONGO_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    server.listen(port, () => {
      console.log(`Running localhost:${port}`);
    })
  )
  .catch((err) => console.log(err));

console.log(listEndpoints(server));
