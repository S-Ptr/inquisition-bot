const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({ 
    duid: String, 
    characters: [{
        type: Schema.Types.ObjectId,
        ref: "Character"
    }],
    trust:Number,
    money:Number,
    rank:Number
    
});

const User = mongoose.model('User', UserSchema, 'users');
module.exports = User;