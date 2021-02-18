const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const AuthorSchema = new Schema({
  googleId: String,
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  refreshTokens: [],
});

AuthorSchema.statics.findByCredentials = async function (email, password) {
  const newUser = await this.findOne({ email });

  if (newUser) {
    const isMatch = await bcrypt.compare(password, newUser.password);
    if (isMatch) return newUser;
    else return null;
  } else return null;
};

AuthorSchema.pre("save", async function (next) {
  const newUser = this;
  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(newUser.password, 10);
  }
});

module.exports = model("Author", AuthorSchema);
