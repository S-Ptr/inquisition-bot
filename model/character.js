const mongoose = require("mongoose");


const Schema = mongoose.Schema;

const CharacterSchema = new Schema({ 
    _id:Schema.Types.ObjectId,
    userId:String,
    firstname: String, 
    lastname: String, 
    race: String,
    gender:String,
    origin:String,
    background:String,
    role:String,
    divination:String,
    equipment:[{itemId:Number, qty:Number}],
    skills: [String],
    talents: [String],
    traits: [String],
    bonuses:[String],
    aptitudes:[{aptitude:String, num:Number}],
    ws:Number,//weapon skill
    bs:Number,//ballistic skill
    str:Number,//strength
    tough:Number,//toughness
    agi:Number,//agility
    int:Number,//intelligence
    per:Number,//perception
    wp:Number,//willpower
    fel:Number,//fellowship
    ifl:Number,//influence
    wounds:Number,//health
    cond:[String],//conditions
    weapon:String, //currently equipped
    fate:Number,//fate points
    fate_t:Number,//fate point threshold
    fate_te:Number,//fate point threshold (Emperor's Blessing)
    exp:Number
});

const Character =  mongoose.model('Character', CharacterSchema, 'characters');

module.exports = Character