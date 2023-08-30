import express from "express";
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import 'dotenv/config'

import taskRoute from './route/task_route'
import userRoute from './route/user_route'
import checkJwt from "./middleware/checkJwt";



const app = express()
const port = process.env.PORT || 8080



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())





app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200)
    }
    next();
});




app.use('/user', userRoute)
app.use('/task', checkJwt, taskRoute)



app.listen(port, () => {
    console.log(`Running on port ${port}`);
})