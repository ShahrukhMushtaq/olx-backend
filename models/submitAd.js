const mongoose = require('mongoose');
const User = require('./User');
const adSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true        
    },
    description: {
        type: String,
        required: true        
    },
    category: {
        type: String,
        required: true        
    },
    model: {
        type: String,
        required: true        
    },
    price: {
        type: Number,
        required: true
    },
   productImage: {
       type: String,
        required: true        
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const ad = mongoose.model('Submit-Ad',adSchema);
module.exports = ad;