const mongoose = require('mongoose');
const UserSubscription = mongoose.model('UserSubscription', new mongoose.Schema({
    user_subscription: any
}));
module.exports = UserSubscription;