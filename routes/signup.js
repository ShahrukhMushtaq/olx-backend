var express = require('express');
var router = express.Router();
var bcrpt = require('bcrypt');
const User = require('../models/User');

/* GET all users. */
router.get('/', function (req, res, next) {
  const users = User.find();
  users.exec(function (error, user) {
    if (error) {
      console.log("error", error);
      res.status(500).send({ error: error });
      return;
    }
    res.status(200).send({ user: user });
  });
});

router.post('/add-user', (req, res, next) => {

  User.findOne({ email: req.body.email }, (err, user) => {
    if (user) return res.status(400).send("User already registered");
    if (err) return res.status(500).send({ error: err });

    bcrpt.hash(req.body.password, 10, (err, hash) => {
      if (err) return res.status(500).send({ error: err });
      // req.body.password = hash;
      const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash
      });
      user.save(function (error, data) {
        if (error) {
          console.log("error", error);
          res.status(500).send({ error: error });
          return;
        }
        res.status(200).send({ message: "User registered successfully" });
      });
    });
  });
});

router.put('/:id', async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  if (!user) return res.status(404).send("The user with the given id do not exixt");

  res.status(200).send({ message: "Upated successfully" });
});

router.delete('/:id', async (req, res, next) => {
  const user = await User.findByIdAndRemove(req.params.id);
  if (!user) return res.status(404).send("User with the given id do not exist");

  user.exec(function (error, data) {
    if (error) {
      console.log("error", error);
      res.status(500).send({ error: error });
      return;
    }
    res.status(200).send({ message: "Successfully deleted" });
  });
});

module.exports = router;
