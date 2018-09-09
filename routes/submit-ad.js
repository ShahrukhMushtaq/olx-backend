var express = require('express');
var router = express.Router();
const User = require('../models/User');
const Ad = require('../models/submitAd');
const multer = require('multer');
const webpush = require('web-push');
var USER_SUBSCRIPTIONS = require('../models/user-subscription');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 20
  }
});

/* GET users listing. */
router.get('/', (req, res, next) => {
  const ad = Ad.find()
    .then(function (result) {
      if (!result) {
        res.status(400).send("Not Found");
        return;
      }
      res.status(200).send(result)
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ error: err });
    });
});

router.get('/ad/:id', (req, res) => {
  // console.log(req.params.id);
  const ad = Ad.find({ user: req.params.id }, (err, result) => {
    if (err) { return res.status(500).send({ error: err }) };
    res.status(200).send(result);
  })
});

router.get('/fulladd/:id', (req, res) => {
  Ad.findOne({ _id: req.params.id }, (err, result) => {
    if (err) { return res.status(500).send({ error: err }) };
    res.status(200).send(result);
  });
})

router.post('/post', upload.single('productImage'), (req, res) => {
  console.log(req.body);
  // console.log(req.file);

  User.findById(req.body.userId)
    .then(user => {
      if (!user) {
        return res.status(404).send("User not found");
      }
      const ad = new Ad({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        model: req.body.category,
        price: req.body.price,
        productImage: req.file.originalname,
        user: req.body.userId
      });
      ad.save(function (error, data) {
        if (error) {
          console.log("error", error);
          res.status(500).send({ error: error });
          return;
        }

        // return res.status(200).send({ ad: data });
      });

      USER_SUBSCRIPTIONS.find(function (err, res) {
        if (err) {
          return res.status(500).send({ error: err });
        }
        const notificationPayload = {
          "notification": {
            "title": "New Ads Available!",
            "body": req.body.title,
            "icon": "assets/olx-logo.png",
            "vibrate": [100, 50, 100],
            "data": {
              "dateOfArrival": Date.now(),
              "primaryKey": 1
            },
            "actions": [{
              "action": "explore",
              "title": "Go to the site"
            }]
          }
        };
        Promise.all(res.map(sub => webpush.sendNotification(sub.user_subscription, JSON.stringify(notificationPayload))))
          .then(() => res.status(200).send({ message: 'Ad sent successfully.' }))
          .catch(err => {
            console.error("Error sending notification, reason: ", err);
            res.sendStatus(500);
          });
        
      })



    })
    .catch(err => {
      console.log(err);
      res.status(500).send({
        error: err
      });
    });
});

router.delete('/delete/:id', (req, res, next) => {
  Ad.findByIdAndRemove(req.params.id)
    .then(ad => {
      if (!ad) {
        return res.status(404).send({
          message: "Ad not found"
        });
      }
      res.send({ message: "Ad deleted successfully!" });
    }).catch(err => {
      if (err.kind === 'ObjectId' || err.name === 'NotFound') {
        return res.status(404).send({
          message: "Ad not found err"
        });
      }
      return res.status(500).send({
        message: "Could not delete ad "
      });
    });
});

module.exports = router;
