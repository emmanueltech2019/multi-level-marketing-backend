const router = require('express').Router()
const { parser, requireSignin, userMiddleware } = require('../common-middlewares')
const { claimPayout, claimFooditems, changeLevel, paidUsers, paidUsersFood } = require('../controllers/admin')
const { register, userProfile,userProfile2,makePayment,updateContactDets,updateBankDets, login, updatePersonalDets, users, userDownlines, resetpassword, reset, resetPasswordChange, requestWithdrawal, pendingPayouts, userProfile1, requestWithdrawalFood } = require('../controllers/user')


router.post('/register',register)
router.post('/login',login)

router.get('/profile/:id',userProfile)
router.get('/profile/:username/second',userProfile1)
router.get('/downlines/:username',userDownlines)
router.get('/profile/logged/in',requireSignin,userProfile2)
router.post('/makepayment/:id',parser,makePayment)
router.patch('/update/personaldatails',requireSignin,parser,updatePersonalDets)
router.patch('/update/bankdatails',requireSignin,updateBankDets)
router.patch('/update/contactdets',requireSignin,updateContactDets)
router.get('/users',users)
router.post('/claim/payout',requireSignin,userMiddleware,claimPayout)
router.post('/claim/fooditems',requireSignin,userMiddleware,claimFooditems)

router.post('/change/plan/upgrade',requireSignin,userMiddleware,changeLevel)
router.post('/password/reset-request',resetpassword)
router.post('/password/reset/:token',reset)
router.post('/password/change/:token',resetPasswordChange)

router.post('/request/withdrawal',requireSignin,userMiddleware,requestWithdrawal)
router.post('/request/withdrawalfood',requireSignin,userMiddleware,requestWithdrawalFood)
router.get('/paid',paidUsers)
router.get('/paidfood',paidUsersFood)
module.exports=router