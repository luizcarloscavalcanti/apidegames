const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const gameController = require("./games/gameController");
const userController = require("./users/userController");
const cors = require("cors");

app.use(cors());
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

app.use("/", gameController);
app.use("/", userController);

app.listen(3000, () => {
  console.log("API iniciada e rodando");
});