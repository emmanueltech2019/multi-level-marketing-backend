const {model,Schema}=require('mongoose')


const packageSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true,
    }
})

module.exports=model('package',packageSchema)