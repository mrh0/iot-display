const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const displaySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required: true},
    message: {
        text:{type:String, default:"Placeholder Message"}, 
        time:{type: Date, default: Date.now},
        overrides:{type: Date, default: Date.now}
    },
    scheduled:[{
        text:{type: String}, 
        time:{type: Date, default: Date.now}, 
        recurring:{type: String, default: "NEVER"} //NEVER, DAILY, WEEKLY
    }]
});

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, unique:true, required: true, dropDups:true},
    hpwd: {type: String, required: true},
    displays:[{
        display:{type: mongoose.Schema.Types.ObjectId}, 
    }]
});

function updateDB(message, scheduled = []){

}

module.exports = {DisplaySchema: mongoose.model('Display', displaySchema), UserSchema: mongoose.model('User', userSchema)};