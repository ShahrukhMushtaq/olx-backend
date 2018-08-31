var express = require('express');
var router = express.Router();
var bcrpt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a user');
});

router.post('/', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.status(400).send("Invalid email or password");
    }
    const validPwd = bcrpt.compare(req.body.password, user.password);
    if (!validPwd) {
      return res.status(400).send("Invalid password");
    }
    const token = jwt.sign({ _id: user }, "jwtkey");
    if (!token) return res.status(404).send("Invalid User");
    res.send({ user: user, token: token });
  });
});

module.exports = router;