const Sauces = require("../models/sauces");
const { flatMap } = require("tslint/lib/utils");

exports.like = (req, res, next) => {
  const { userId, like } = req.body;
  const sauceId = req.params.id;

  switch (like) {
    case 1: {
      likeOrDislikeSauce(sauceId, userId, true)
        .then(() => {
          sendResponse(true, res);
        })
        .catch((error) => {
          sendResponse(false, res, error);
        });
      break;
    }
    case 0: {
      resetLike(sauceId, userId)
        .then(() => {
          sendResponse(true, res);
        })
        .catch((error) => {
          sendResponse(false, res, error);
        });
      break;
    }
    case -1: {
      likeOrDislikeSauce(sauceId, userId, false)
        .then(() => {
          sendResponse(true, res);
        })
        .catch((error) => {
          sendResponse(false, res, error);
        });
      break;
    }
  }
};

function likeOrDislikeSauce(sauceId, userId, like) {
  return new Promise((resolve, reject) => {
    let obj = null;
    if (like) {
      obj = { usersLiked: userId };
    } else {
      obj = { usersDisliked: userId };
    }

    Sauces.updateOne({ _id: sauceId }, { $addToSet: obj })
      .then(() => {
        updateLikeAndDislikeNumber(sauceId)
          .then(() => {
            resolve(true);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function resetLike(sauceId, userId) {
  return new Promise((resolve, reject) => {
    Sauces.updateOne(
      { _id: sauceId },
      { $pull: { usersLiked: userId, usersDisliked: userId } }
    )
      .then(() => {
        updateLikeAndDislikeNumber(sauceId)
          .then(() => {
            resolve(true);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function updateLikeAndDislikeNumber(sauceId) {
  return new Promise((resolve, reject) => {
    Sauces.aggregate([
      {
        $project: {
          _id: sauceId,
          likeNumber: { $size: "$usersLiked" },
          dislikeNumber: { $size: "$usersDisliked" },
        },
      },
    ])
      .then((likeAndDislikeNumber) => {
        Sauces.updateOne(
          { _id: sauceId },
          {
            likes: likeAndDislikeNumber[0].likeNumber,
            dislikes: likeAndDislikeNumber[0].dislikeNumber,
          }
        )
          .then((update) => {
            resolve(true);
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function sendResponse(success, res, error = "") {
  if (success) {
    res.status(200).json("post liker");
  } else {
    res.status(400).json(error);
  }
}
