const express = require("express");
const router = express.Router();
const Game = require("./Game");
const auth = require("../users/userAuth");

router.get("/games", auth, (req, res) => {
  res.statusCode = 200;
  Game.findAll({
    order: [
      ["id", "DESC"]
    ]
  }).then(games => {
    res.json({ user: req.loggedUser, games: games });
  })
});

router.get("/game/:id", auth, (req, res) => {
  res.statusCode = 200;

  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);

    Game.findByPk(id).then(game => {
      if (game != undefined) {
        res.statusCode = 200;
        res.json(game);
      } else {
        res.sendStatus(404);
      }
    })
  }
});

router.post("/game", auth, (req, res) => {
  var { title, price, year } = req.body;

  Game.create({
    title: title,
    price: price,
    year: year
  }).then(() => {
    res.sendStatus(200);
  });
});

router.delete("/game/:id", auth, (req, res) => {

  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);
    Game.findByPk(id).then(game => {
      if (game != undefined) {
        Game.destroy({
          where: {
            id: id
          }
        }).then(() => {
          res.sendStatus(200);
        });
      } else {
        res.sendStatus(404);
      }
    });
  }
});

router.put("/game/:id", auth, (req, res) => {
  if (isNaN(req.params.id)) {
    res.sendStatus(400);
  } else {
    var id = parseInt(req.params.id);

    Game.findByPk(id).then(game => {
      if (game != undefined) {
        var { title, price, year } = req.body;

        Game.update({
          title: title,
          price: price,
          year: year
        }, {
          where: {
            id: id
          }
        }).then(() => {
          res.sendStatus(200);
        })

      } else {
        res.sendStatus(404);
      }
    });
  }
});

module.exports = router;