const {model,Schema}=require('mongoose')


const termsSchema=new Schema({
    content1:{
        type:String,
        required:true,
    },
    content2:{
        type:String,
        required:true,
    }
})

module.exports=model('terms',termsSchema)