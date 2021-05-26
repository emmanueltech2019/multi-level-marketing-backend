const { Schema, model } = require("mongoose");


/**
 * @description admin schema
*/

const adminSchema = new Schema({
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
});

module.exports = model("admin", adminSchema);
