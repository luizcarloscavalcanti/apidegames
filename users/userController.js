const express = require("express");
const router = express.Router();
const User = require("./User");
const jwt = require("jsonwebtoken");

const jwtSecret = "asdfgqwert123987"

router.post("/auth", (req, res) => {
  var { email, password } = req.body;

  if (email != undefined) {
    User.findOne({
      where: {
        email: email
      }
    }).then((user) => {
      if (user.password == password) {
        jwt.sign({ id: user.id, email: user.email },
          jwtSecret, { expiresIn: "48h" }, (err, token) => {
            if (err) {
              res.status(400);
              res.json({ err: "Falha interna" });
            } else {
              res.status(200);
              res.json({ token: token });
            }
          })
      } else {
        res.status(401);
        res.json({ err: "Credenciais inválidas!" });
      }
    }).catch(() => {
      res.status(404);
      res.json({ err: "O E-mail enviado não existe na base de dados" })
    })

  } else {
    res.status(400);
    res.json({ err: "O E-mail enviado é inválido!" })
  }

});

module.exports = router;