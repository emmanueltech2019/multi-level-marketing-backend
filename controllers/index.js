const Terms=require('../models/terms.model')


exports.createContentOne=(req,res)=>{
    Terms.find({})
    .then((terms) => {
        res.send(terms)
    }).catch((err) => {
        console.log(err)
    });
}
