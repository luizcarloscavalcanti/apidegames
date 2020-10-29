const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Game = require("./games/Game");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

connection
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados efetuada com sucesso!");
  }).catch((err) => {
    console.log(err);
  });

connection.sync();

app.get("/games", (req, res) => {
  res.statusCode = 200;
  Game.findAll({
    order: [
      ["id", "DESC"]
    ]
  }).then(games => {
    res.json(games);
  })
});

app.get("/game/:id", (req, res) => {
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

app.post("/game", (req, res) => {
  var { title, price, year } = req.body;

  Game.create({
    title: title,
    price: price,
    year: year
  }).then(() => {
    res.sendStatus(200);
  });
});

app.delete("/game/:id", (req, res) => {

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

app.put("/game/:id", (req, res) => {
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

app.listen(3000, () => {
  console.log("API iniciada e rodando");
})