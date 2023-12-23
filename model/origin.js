const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OriginSchema = new Schema({ 
    type: String,
    race_limit:String,
});

const Origin = mongoose.model('Origin', OriginSchema, 'origins');
module.exports = Origin;