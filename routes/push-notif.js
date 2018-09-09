var express = require('express');
var router = express.Router();
var USER_SUBSCRIPTIONS = require('../models/user-subscription');

router.post('/', (req, res) => {
    const sub = req.body;

    console.log('Received Subscription on the server: ', sub);
    const user_subs = new USER_SUBSCRIPTIONS({
        user_subscription: sub
    });
    user_subs.save(function (err, result) {
        if (err) {
            console.log("error", err);
            res.status(500).send({ error: err });
            return;
        }
        res.status(200).send({ message: "User subscribed successfully" });
    });
});
module.exports = router;