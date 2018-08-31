var express = require('express');
var router = express.Router();
var Ad = require('../models/submitAd');

/* GET users listing. */
router.post('/', (req, res, next) => {
  const ad = Ad.find({category: req.body.category}, (err, result) => {
    if (err) {
      return res.status(500).send({error : err});
    }
    if (!result) {
      return res.status(500).send({message : "Not found"});
    }
    res.status(200).send(result);
  });
});

module.exports = router;
