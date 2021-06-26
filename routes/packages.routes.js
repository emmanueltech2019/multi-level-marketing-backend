const router = require('express').Router()
const { addNewPackage,getPackages,deletePackage,singlePackage } = require('../controllers/packages')


router.post('/add',addNewPackage)
router.get('/get',getPackages)
router.get('/single/:id',singlePackage)
router.delete('/delete/:id',deletePackage)


module.exports=router