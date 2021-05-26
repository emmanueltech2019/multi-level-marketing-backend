/**
 * @description bring in packages
 */
const express = require('express')
const {connect} =require('mongoose')

/**
 * @description bring in modules
 */
const {DATABASEURL,APPPORT}=require('./config')

// app variable for server from express 
const app =express()

/**
 * @description add required app middlewares
*/
app.use(express.json())
app.use(express.urlencoded({extended:true}))


/**
 * @description connect to database
*/

function ConnectDb() {
    connect(DATABASEURL,
    {
        useUnifiedTopology:true,
        useCreateIndex:true,
        useFindAndModify:true,
        useNewUrlParser:true
    })
    .then(() => {
        console.log('Successfully Connected To Database')
    }).catch(() => {
        setTimeout(() => {
            console.log('error Connecting To Database')
            ConnectDb()
        }, 5000);
    });
}
ConnectDb()

/**
 * @description start server with app.listen
*/
app.listen(APPPORT,()=>{
    console.log(`Server Started On Port ${APPPORT}`)
})