import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import StatusCode from "../contanst/status_code"
import Message from "../contanst/message"
import userService from "../service/user_service"
import 'dotenv/config'



const privateKey = process.env.JWT_SECRET_KEY


const handleLogIn = async (req, res) => {
  try {
    const username = req.body.username
    const password = req.body.password
    if (!username || !password) {
      return res.status(400).send(
        {
          Mes: Message.MissingData,
          Code: StatusCode.BadReq,
          Data: []
        }
      )
    }
    let data = await userService.getUserByUsername(username)
    console.log(data);
    if (data.length) {
      if (await bcrypt.compare(password, data[0].password)) {
        const payload = {
          username: data[0].username,
          userId: data[0].id
        }
        var token = jwt.sign(payload, privateKey, { expiresIn: 3600 });

        res.cookie('token', token, { maxAge: 60 * 60 * 1000, httpOnly: true })

        return res.status(200).send({
          Mes: Message.Success,
          Code: StatusCode.Success,
          Data: []
        })
      }
    }
    return res.status(401).send({
      Mes: Message.LogInErr,
      Code: StatusCode.Fail,
      Data: []
    })
  } catch (error) {
    console.log(error);
    res.status(500).send({
      Mes: Message.ServerErr,
      Code: StatusCode.ServerErr,
      Data: []
    })
  }
}

const handleRegister = async (req, res) => {
  try {
    const username = req.body.username
    const password = req.body.password
    if (!username || !password) {
      return res.status(400).send(
        {
          Mes: Message.MissingData,
          Code: StatusCode.BadReq,
          Data: []
        }
      )
    }
    let data = await userService.getUserByUsername(username)
    if (data.length) {
      return res.status(400).send({
        Mes: Message.RegisterErr,
        Code: StatusCode.Fail,
        Data: []
      })
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const id = uuidv4();



    data = await userService.handleRegister({ id, username, hashPassword })
    return res.status(200).send({
      Mes: Message.Success,
      Code: StatusCode.Success,
      Data: []
    })

  } catch (error) {
    console.log(error);
    res.status(500).send({
      Mes: Message.ServerErr,
      Code: StatusCode.ServerErr,
      Data: []
    })
  }
}

const handleSignOut = async (req, res) => {
  res.cookie('token', '', { maxAge: 1000, httpOnly: true })
  return res.status(200).send({
    Mes: Message.Success,
    Code: StatusCode.Success,
    Data: []
  })
}








module.exports = {
  handleLogIn,
  handleRegister,
  handleSignOut
}