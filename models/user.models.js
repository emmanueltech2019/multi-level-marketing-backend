const { Schema, model } = require("mongoose");


/**
 * @description user schema
*/

const userSchema = new Schema({
    username:{
        type:String,
        unique:true,
    },
    first_name:{
        type:String,
    },
    last_name:{
        type:String,
    },
    email:{
        type:String,
    },
    phone_number:{
        type:String,
    },
    DOB:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    secured_question:{
        type:String,
    },
    secured_answer:{
        type:String,
    },
});

module.exports = model("user", userSchema);
