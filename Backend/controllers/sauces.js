const Sauces = require("../models/sauces");
const fs = require("fs");

exports.getAllSauces = (req, res, next) => {
  Sauces.find({})
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

exports.getOneSauces = (req, res, next) => {
  const id = req.params.id;
  Sauces.findById(id)
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

exports.createSauces = (req, res, next) => {
  const data = JSON.parse(req.body.sauce);

  const sauce = new Sauces({
    name: data.name,
    manufacturer: data.manufacturer,
    description: data.description,
    heat: data.heat,
    likes: 0,
    dislikes: 0,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    mainPepper: data.mainPepper,
    usersLiked: [],
    usersDisliked: [],
    userId: data.userId,
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Sauce creer" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.modifySauces = (req, res, next) => {
  const data = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : {
        ...req.body,
      };

  Sauces.updateOne({ _id: req.params.id }, { ...data, _id: req.params.id })
    .then(() => {
      res.status(200).json({ message: "Sauce update" });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};

exports.deleteSauces = (req, res, next) => {
  const id = req.params.id;

  Sauces.findById(id)
    .then((respond) => {
      const filename = respond.imageUrl.split("/images")[1];
      fs.unlink(`images${filename}`, () => {
        Sauces.findByIdAndDelete(id)
          .then(() => {
            res.status(200).json({ message: "La sauce a bien ete supp" });
          })
          .catch((error) => {
            res.status(500).json({ error: error });
          });
      });
    })
    .catch((error) => {
      res.status(400).json({ error: error });
    });
};
