const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const UserSchema = new Schema({
    personal_nr: {
        type: Number,
        unique: true
    },
    account_nr : {
        type: Number,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },

    dateofbirth: {
        type: Date,
        required: true
    }, 
    city: {
        type: String,
        required: true,
    },
    createddate: {
        type: String,
        required: true
    }
});




const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;