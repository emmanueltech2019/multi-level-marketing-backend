const Package = require("../../models/package.model");

exports.addNewPackage = (req, res) => {
  const { name, price } = req.body;
  const newPackage = new Package({
    name,
    price,
  });
  newPackage
    .save()
    .then(() => {
      res.status(201).json({
        message: "package added successfully",
        status: true,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
        status: false,
      });
    });
};

exports.getPackages = (req, res) => {
  Package.find({})
    .then((result) => {
      res.status(200).json({
        packages: result,
        status: true,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
        status: false,
      });
    });
};

exports.singlePackage=(req,res)=>{
  Package.findOne({_id:req.params.id})
  .then((result) => {
    res.status(200).json({
      result,
      status:true
    })
  }).catch((err) => {
    res.status(400).json({
      error:err,
      status:false
    })
  });
}

exports.deletePackage = (req, res) => {
  Package.findOneAndRemove(req.params.id, (err) => {
    if (err) return next(err);
    res.send("Deleted successfully!");
  });
};
