import jwt from 'jsonwebtoken'
import 'dotenv/config'
import Message from '../contanst/message'
import StatusCode from '../contanst/status_code'
import userService from '../service/user_service'

const privateKey = process.env.JWT_SECRET_KEY


const checkJwt = async (req, res, next) => {

    try {
        const token = req.cookies.token
        const payload = jwt.verify(token, privateKey)
        const user = await userService.getUserByUsername(payload.username)

        if (user.length && user[0].id === payload.userId) {
            req.userId = payload.userId
            req.username = payload.username
            next()
        } else {
            return res.status(401).send({
                Mes: Message.Unauthorized,
                Code: StatusCode.Unauthorized,
                Data: []
            })
        }


    } catch (error) {
        return res.status(401).send({
            Mes: Message.Unauthorized,
            Code: StatusCode.Unauthorized,
            Data: []
        })
    }



}

module.exports = checkJwt