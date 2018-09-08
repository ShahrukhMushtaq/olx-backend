const mongoose = require('mongoose');
const UserSubscription = mongoose.model('UserSubscription', new mongoose.Schema({
    user_subscription: {}
}));
module.exports = UserSubscription;