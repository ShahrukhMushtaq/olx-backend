var express = require('express');
var router = express.Router();
var bcrpt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send({ message: 'respond with a user' });
});

router.post('/', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.status(400).send({ message: "Invalid email or password" });
    }
    if (err) {
      return res.status(500).send({ error: err });
    }
    bcrpt.compare(req.body.password, user.password, (err, resp) => {
      if (resp) {
        const token = jwt.sign({ _id: user }, "jwtkey");
        if (!token) {
          return res.status(404).send({ message: "Invalid user" });
        }
        res.status(200).send({ user: user, token: token });
      } else {
        return res.status(400).send({ message: "Invalid password" });
      }
    });
  });
});

module.exports = router;