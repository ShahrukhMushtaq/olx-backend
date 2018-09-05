var express = require('express');
var router = express.Router();
const User = require('../models/User');

/* GET users listing. */
router.get('/:id', function (req, res, next) {
  const id = req.params.id;
  // console.log(id);
  const user = User.findById(req.params.id);
  user.exec(function (error, user) {
    if (error) {
      console.log("error", error);
      res.status(500).send({ error: error });
      return;
    }
    res.status(200).send(user);
  });

});

module.exports = router;
