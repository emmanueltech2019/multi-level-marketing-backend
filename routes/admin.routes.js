const router = require('express').Router()
const { requireSignin, adminMiddleware } = require('../common-middlewares')
const { register, login, adminProfile2, deleteUser, pendingUsers, approveUser, declineUser, getdeclinedUsers, users, pendingusers, pendingpayouts, payUser, declinePayUser, pendingpayoutsfood, payUserFood } = require('../controllers/admin')



router.post('/register',register)
router.post('/login',login)
router.get('/profile/logged/in',requireSignin,adminProfile2)
router.delete('/delete/user/:id',requireSignin,adminMiddleware,deleteUser)

router.get('/declined/users',requireSignin,adminMiddleware,getdeclinedUsers)
router.get('/pending/users',requireSignin,adminMiddleware,pendingUsers)
router.patch('/approve/user/:id',requireSignin,adminMiddleware,approveUser)
router.patch('/decline/user/:id',requireSignin,adminMiddleware,declineUser)


router.get('/users',users)
router.get('/users/pending',pendingusers)
router.get('/users/pending/payouts',pendingpayouts)
router.get('/users/pending/payoutsfood',pendingpayoutsfood)

router.post('/pay/user',requireSignin,adminMiddleware,payUser)
router.post('/pay/userfood',requireSignin,adminMiddleware,payUserFood)
router.post('/declinepay/user',requireSignin,adminMiddleware,declinePayUser)
module.exports=router