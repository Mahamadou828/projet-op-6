const User = require("../models/user"),
  bcrypt = require("bcrypt"),
  jwt = require("jsonwebtoken");

exports.signUp = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => {
          res.status(201).json({ message: "Bienvenue" });
        })
        .catch((error) => {
          res.status(400).json({ error });
        });
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (!user) {
      return res.status(400).json({ message: "Invalid User" });
    }

    bcrypt.compare(req.body.password, user.password).then((valid) => {
      if (!valid) {
        return res.status(400).json({ message: "Invalid User" });
      }

      res.status(200).json({
        userId: user._id,
        token: jwt.sign(
          { userId: user._id },
          "Contenant egalement l'identifiant userID",
          { expiresIn: "24h" }
        ),
      });
    });
  });
};
