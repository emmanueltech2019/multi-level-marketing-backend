require('dotenv').config()

module.exports={
    DATABASEURL:process.env.DB,
    APPPORT:process.env.PORT,
    APPSECRET:process.env.APPSECRET
}