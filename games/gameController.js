const express = require("express");
const router = express.Router();
const Game = require("./Game");

router.get("/games", (req, res) => {
  res.statusCode = 200;
  Game.findAll({
    order: [
      ["id", "DESC"]
    ]
  }).then(games => {
    res.json(games);
  })
});

router.get("/game/:id", (req, res) => {
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

router.post("/game", (req, res) => {
  var { title, price, year } = req.body;

  Game.create({
    title: title,
    price: price,
    year: year
  }).then(() => {
    res.sendStatus(200);
  });
});

router.delete("/game/:id", (req, res) => {

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

router.put("/game/:id", (req, res) => {
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